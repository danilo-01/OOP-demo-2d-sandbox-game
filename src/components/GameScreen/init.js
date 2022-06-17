import Player from "./entities/player";
import Environment from "./environment/Environment";
import movementActions from "./helpers/movementActions";
const { STILL, LEFT, RIGHT, JUMP } = movementActions;

export const init = (ctx, canvas) => {
  let frameCount = 10;

  // Environment
  const environment = new Environment(ctx, canvas);

  // Player
  const player = new Player({
    environment: environment,
    ctx: ctx,
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
    frameCount = 5;

    window.requestAnimationFrame(animate);
  };
  animate();
};
