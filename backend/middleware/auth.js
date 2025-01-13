import User from "../models/user";

//middleware for authentication
export const authenticateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      accessToken: req.header("Authorization"),
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res
        .status(401)
        .json({ loggedOut: true, message: "Invalid access token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
