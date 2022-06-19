import idlePlayerSprite from "../../../assets/3 Cyborg/Cyborg_idle.png";
import idleLeftPlayerSprite from "../../../assets/3 Cyborg/Cyborg_idle_left.png";
import runPlayerSprite from "../../../assets/3 Cyborg/Cyborg_run.png";
import runLeftPlayerSprite from "../../../assets/3 Cyborg/Cyborg_run_left.png";
import jumpPlayerSprite from "../../../assets/3 Cyborg/Cyborg_jump.png";
import jumpLeftPlayerSprite from "../../../assets/3 Cyborg/Cyborg_jump_left.png";

import { createImage } from "../helpers/createImage";
import { applyGravity } from "../helpers/applyGravity";
import movementActions from "../helpers/movementActions";
const { STILL, LEFT, RIGHT, JUMP, RUNNING } = movementActions;

export default class Player {
  constructor({ ctx, environment, x = 0, y = 0 }) {
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
      height: 100,
      width: 150,
    };

    // Player velocity
    this.velocity = {
      x: 0,
      y: 0,
    };

    // Player speeds
    this.speed = 2.2;

    // Movement status (STILL, LEFT, RIGHT, JUMP)
    this.actions = {
      left: false,
      right: false,
      still: true,
      jumping: false,
      lastPressedHorizontal: null,
    };

    // Track jumps
    this.jumped = 0;

    // On surface
    this.onSurface = false;

    // Player sprites
    this.sprites = {
      idle: {
        rightSprite: createImage(idlePlayerSprite),
        leftSprite: createImage(idleLeftPlayerSprite),
        frames: 4,
      },
      run: {
        rightSprite: createImage(runPlayerSprite),
        leftSprite: createImage(runLeftPlayerSprite),
        frames: 6,
      },
      jump: {
        rightSprite: createImage(jumpPlayerSprite),
        leftSprite: createImage(jumpLeftPlayerSprite),
        frames: 4,
      },
      frame: 0,
    };
  }

  draw() {
    // Set sprite quality
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.imageSmoothingQuality = "high";

    // Set which sprite set to use based on current action
    let spriteToUse;
    switch (determinePlayerAction(this)) {
      case STILL:
        spriteToUse = this.sprites.idle;
        break;
      case RUNNING:
        spriteToUse = this.sprites.run;
        break;
      case JUMP:
        spriteToUse = this.sprites.jump;
        break;
    }

    const facingLeft = this.actions.lastPressedHorizontal === LEFT;

    this.ctx.drawImage(
      facingLeft ? spriteToUse.leftSprite : spriteToUse.rightSprite,
      facingLeft ? 48 * this.sprites.frame : 48 * this.sprites.frame,
      0,
      48,
      48,
      this.position.x,
      this.position.y,
      this.dimensions.width,
      this.dimensions.height
    );

    // Sprite loop throttle
    if (--this.environment.onFrame === 0) {
      // Update sprite frame
      this.sprites.frame++;
      this.environment.onFrame = this.environment.frameLimit;
    }
    if (this.sprites.frame >= spriteToUse.frames) {
      this.sprites.frame = 0;
    }
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
        this.actions.still = false;
        this.actions.jumping = true;

        break;
      case "Shift":
        this.actions.running = keyup ? false : true;
        break;
    }
  }

  resetOnPlaced() {
    //   Reset velocity
    this.actions.still = true;
    this.onSurface = true;
    this.velocity.y = 0;
    this.actions.jumping = false;
    this.jumped = 0;
  }
}

const applyPlayerMovementHorizontal = (object, environment, action) => {
  const { left: movingLeft, right: movingRight, running } = object.actions;

  // Apply speed based on action
  object.velocity.x += object.speed;

  if (
    // Moving left
    ((movingLeft && object.actions.lastPressedHorizontal === LEFT) ||
      (movingLeft && !movingRight)) &&
    object.position.x >= 2
  ) {
    object.position.x -= Math.floor(object.velocity.x);
  } else if (
    // Moving right
    ((movingRight && object.actions.lastPressedHorizontal === RIGHT) ||
      (movingRight && !movingLeft)) &&
    object.position.x <= 250
  ) {
    object.position.x += Math.floor(object.velocity.x);
  } else {
    if (movingLeft && object.actions.lastPressedHorizontal === LEFT) {
      environment.updateOffset(1, LEFT);
    }
    if (movingRight && object.actions.lastPressedHorizontal === RIGHT) {
      environment.updateOffset(1, RIGHT);
    }
  }

  // Reset velocity on x position
  object.velocity.x = 0;
};

const applyPlayerJump = (object, environment) => {
  object.onSurface = false;
  object.jumped++;
  object.velocity.y = 0;
  object.velocity.y -= 5;
};

const applyMovementModifier = (object, environment) => {
  // Horizontal movement
  applyPlayerMovementHorizontal(object, environment);
};

const determinePlayerAction = (object) => {
  if (object.actions.jumping) return JUMP;

  if (object.actions.left || object.actions.right) return RUNNING;

  if (object.actions.still) return STILL;

  return STILL;
};
