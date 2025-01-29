import Lottie from "lottie-react";
import loadingAnimation from "../assets/Animation - 1738089651426.json";

export const Test = () => {
  return (
    <div style={{ height: "200px", width: "200px" }}>
      <Lottie animationData={loadingAnimation} loop />
    </div>
  );
};

