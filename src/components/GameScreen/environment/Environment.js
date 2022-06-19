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
        image: createImage(cityBackground1, 3),
      },
    };
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

    this.drawBackground(this.backgrounds.city1);
  }

  update() {
    // Draw environment and entities
    this.draw();
  }

  updateOffset(value, direction) {
    this.offset =
      direction === RIGHT ? this.offset + value + 10 : this.offset - value - 10;
  }

  drawBackground(background, offsetModifier = 1) {
    let viewArea = this.width + this.offset;

    // Loop over points and see which ones need to be removed and added
    let pointsOutOfRange = 0;
    const minStart = this.offset - this.width;
    const maxEnd = this.offset + this.width * 2;
    console.log(minStart, maxEnd);

    // for (let point of background.points) {
    //   if (point.end <= minStart && point.start >= maxEnd) {
    //     pointsOutOfRange++;
    //   }
    // }

    if (background.points.length !== 0) {
      if (background.points[0].end < minStart) {
        pointsOutOfRange++;
      }

      if (background.points[2].start > maxEnd) {
        pointsOutOfRange++;
      }
    }

    if (pointsOutOfRange || background.points.length === 0) {
      background.points = [];

      // Far left image
      background.points.push({
        start: minStart,
        end: minStart + this.width,
      });

      // Center image
      background.points.push({
        start: this.offset,
        end: this.offset + this.width,
      });

      // Far right image
      background.points.push({
        start: this.offset + this.width,
        end: maxEnd,
      });
      console.log("resetting points", background.points);
    }

    // Loop over available backgrounds and draw them
    for (let point of background.points) {
      this.ctx.drawImage(
        background.image,
        (point.start - this.offset) / offsetModifier,
        0,
        this.width,
        this.height
      );
    }
  }

  connectPlayer(player) {
    this.player = player;
  }
}
