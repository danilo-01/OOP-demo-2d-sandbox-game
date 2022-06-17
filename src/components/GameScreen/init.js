import Player from "./entities/player";
import playerAsset from "../../assets/player_asse.png";
import Environment from "./environment/Environment";
import movementActions from "./helpers/movementActions";
const { STILL, LEFT, RIGHT, JUMP } = movementActions;

export const init = (ctx, canvas) => {
  // Environment
  const environment = new Environment(ctx, canvas);

  // Player
  const player = new Player({
    environment: environment,
    ctx: ctx,
    imageUrl: playerAsset,
    x: 30,
    y: 30,
  });

  // Background

  // Key events
  // key down
  document.addEventListener("keydown", ({ key }) => {
    player.updateMovementStatus(key, false);
  });
  // Key up
  document.addEventListener("keyup", ({ key }) => {
    player.updateMovementStatus(key, true);
  });

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Update and draw player on screen
    player.update();

    window.requestAnimationFrame(animate);
  };
  animate();
};
