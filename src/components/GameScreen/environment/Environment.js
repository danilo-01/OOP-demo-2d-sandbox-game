//TODO: Make code for environment backgrounds dynamic

import cityBackground1 from "../../../assets/tileset/2 Background/Night/3.png";
import cityBackground2 from "../../../assets/tileset/2 Background/Night/2.png";
import dayBackground from "../../../assets/tileset/2 Background/Night/1.png";
import { createImage } from "../helpers/createImage";
import movementActions from "../helpers/movementActions";
const { RIGHT } = movementActions;

export default class Environment {
  constructor(ctx, canvas) {
    this.canvas = canvas;
    this.ctx = ctx;

    // Set height on canvas
    this.canvas.height = 300;
    this.canvas.width = 800;

    // Set environment height
    this.height = this.canvas.height;
    this.width = this.canvas.width;

    this.frameLimit = 15;
    this.onFrame = this.frameLimit;

    // Offset for all elements in environment
    this.offset = 0;

    this.backgrounds = {
      city1: {
        points: [],
        image: createImage(cityBackground1),
      },
      city2: {
        points: [],
        image: createImage(cityBackground2),
      },
    };

    this.currentLevel = null;
  }

  draw() {
    // this.ctx.imageSmoothingEnabled = false;
    // this.ctx.imageSmoothingQuality = "high";

    // Draw sky
    this.ctx.drawImage(
      createImage(dayBackground),

      0,
      0,
      this.width,
      this.height
    );

    // Draw city backgrounds
    this.drawBackground(this.backgrounds.city1, 9);
    this.drawBackground(this.backgrounds.city2, 7);

    this.generateLevel();
  }

  update() {
    // Draw environment and entities
    this.draw();
  }

  updateOffset(value, direction) {
    this.offset =
      direction === RIGHT ? this.offset + value + 10 : this.offset - value - 10;
  }

  drawBackground(background, offsetModifier) {
    const currentOffset = this.offset / offsetModifier;

    // Loop over points and see which ones need to be removed and added
    let pointsOutOfRange = 0;
    const minStart = currentOffset - this.width;
    const maxEnd = currentOffset + this.width * 2;

    // Check if first or last background image is doesnt need to be rendered
    if (background.points.length !== 0) {
      if (background.points[0].end < minStart) {
        pointsOutOfRange++;
      }

      if (background.points[2].start > maxEnd) {
        pointsOutOfRange++;
      }
    }

    // If an image is out of the render distance reset the current images
    if (pointsOutOfRange || background.points.length === 0) {
      background.points = [];

      // Far left image
      background.points.push({
        start: minStart,
        end: minStart + this.width,
      });

      // Center image
      background.points.push({
        start: currentOffset,
        end: currentOffset + this.width,
      });

      // Far right image
      background.points.push({
        start: currentOffset + this.width,
        end: maxEnd,
      });
    }

    // Loop over available backgrounds and draw them
    for (let point of background.points) {
      this.ctx.drawImage(
        background.image,
        point.start - currentOffset,
        0,
        this.width,
        this.height
      );
    }
  }

  connectPlayer(player) {
    this.player = player;
  }

  generateLevel() {
    const currentLevel = this.currentLevel;
  }
}
