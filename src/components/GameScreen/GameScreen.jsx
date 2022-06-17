import React, { useEffect, useRef } from "react";
import { init } from "./init";

const GameScreen = (props) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    init(context, canvas);
  }, []);

  return <canvas ref={canvasRef} {...props} />;
};

export default GameScreen;
