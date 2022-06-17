export const applyGravity = (object, environment) => {
  // Check if object is not a surface
  if (object.onSurface !== true) {
    //   Update objects position
    object.position.y += object.velocity.y;

    if (object.position.y + object.dimensions.height <= environment.floor) {
      //   Apply velocity
      object.onSurface = false;
      object.velocity.y += 0.1;
    } else {
      object.position.y = environment.floor - object.dimensions.height;
      object.resetOnPlaced();
    }
  }
};
