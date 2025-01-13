import bcrypt from "bcrypt-nodejs"

// route to register as a user
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password: bcrypt.hashSync(password) });
    await user.save();
    res.status(201).json({
      id: user._id,
      accessToken: user.accessToken,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
});

//route for login
app.post("/login", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ name }, { email }], // $or - make it possible to use both name or email
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        userId: user._id,
        accessToken: user.accessToken,
        message: "Logged in successfully",
      });
    } else {
      res.status(401).json({
        success: false,
        notFound: true,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});