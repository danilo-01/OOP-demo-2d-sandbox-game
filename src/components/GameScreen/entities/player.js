import { applyGravity } from "../helpers/applyGravity";
import movementActions from "../helpers/movementActions";
const { STILL, LEFT, RIGHT, JUMP } = movementActions;

export default class Player {
  constructor({ ctx, environment, x = 0, y = 0, imageUrl }) {
    //   Canvas context
    this.ctx = ctx;

    // Game environment
    this.environment = environment;

    // Player position
    this.position = {
      x,
      y,
    };

    // Player dimensions
    this.dimensions = {
      height: 30,
      width: 30,
    };

    // Player velocity
    this.velocity = {
      x: 0,
      y: 0,
    };

    // Player speeds
    this.speeds = {
      walking: 1.5,
      running: 3,
    };

    // Movement status (STILL, LEFT, RIGHT, JUMP)
    this.actions = {
      left: false,
      right: false,
      still: true,
      jump: false,
      running: false,
      lastPressedHorizontal: null,
    };

    // Track jumps
    this.jumped = 0;

    // On surface
    this.onSurface = false;

    // Set images
    const image = new Image();
    image.src = imageUrl;
    this.image = image;
  }

  draw() {
    this.ctx.translate(this.dimensions.width, 0);
    this.ctx.scale(-1, 1);

    this.ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.dimensions.width,
      this.dimensions.height
    );
  }

  update() {
    this.draw();

    // Update player based on movement statuses
    applyMovementModifier(this, this.environment);

    // Apply gravity
    applyGravity(this, this.environment);
  }

  updateMovementStatus(key, keyup) {
    switch (key) {
      case "A":
      case "a":
        this.actions.lastPressedHorizontal = keyup
          ? this.actions.lastPressedHorizontal
          : LEFT;
        this.actions.still = false;
        this.actions.left = keyup ? false : true;
        break;
      case "D":
      case "d":
        this.actions.lastPressedHorizontal = keyup
          ? this.actions.lastPressedHorizontal
          : RIGHT;
        this.actions.still = false;
        this.actions.right = keyup ? false : true;
        break;
      case " ":
        if (this.jumped < 2 && !keyup) applyPlayerJump(this);

        break;
      case "Shift":
        this.actions.running = keyup ? false : true;
        break;
    }
  }

  resetOnPlaced() {
    //   Reset velocity
    this.onSurface = true;
    this.velocity.y = 0;
    this.jumped = false;
  }
}

const applyPlayerMovementHorizontal = (object, environment, action) => {
  const { left: movingLeft, right: movingRight, running } = object.actions;

  // Apply speed based on action
  object.velocity.x += running ? object.speeds.running : object.speeds.walking;

  // Moving left
  if (
    (movingLeft && object.actions.lastPressedHorizontal === LEFT) ||
    (movingLeft && !movingRight)
  ) {
    object.position.x -= object.velocity.x;
  }

  // Moving right
  if (
    (movingRight && object.actions.lastPressedHorizontal === RIGHT) ||
    (movingRight && !movingLeft)
  ) {
    object.position.x += object.velocity.x;
  }

  // Reset velocity on x position
  object.velocity.x = 0;
};

const applyPlayerJump = (object, environment) => {
  object.onSurface = false;
  object.jumped++;
  object.velocity.y = 0;
  object.velocity.y -= 3;
};

const applyMovementModifier = (object, environment) => {
  // Horizontal movement
  applyPlayerMovementHorizontal(object);
};
