"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../assets/loader.json"; // your Lottie JSON file

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 z-[999] w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-[200px] h-[80px] overflow-hidden flex items-center justify-center">
          <Player
            autoplay
            loop
            src={animationData}
            style={{ height: "200px", width: "200px" }}
          />
        </div>
        <span className="text-secondary text-base font-mono font-medium mt-2">
          Please wait...
        </span>
      </div>
    </div>
  );
};

export default Loader;
