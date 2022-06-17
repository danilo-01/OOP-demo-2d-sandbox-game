export default class Environment {
  constructor(ctx, canvas) {
    canvas.width = 400;

    this.floor = canvas.height;
    this.width = canvas.width;

    this.frameLimit = 15;
    this.onFrame = this.frameLimit;
  }
}
