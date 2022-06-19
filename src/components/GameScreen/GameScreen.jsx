import React, { useEffect, useRef } from "react";
import { init } from "./init";
import "./GameScreen.css";

const GameScreen = (props) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");

    init(context, canvas);
  }, []);

  return <canvas className="game-screen" ref={canvasRef} {...props} />;
};

export default GameScreen;
