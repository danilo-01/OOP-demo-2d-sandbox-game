export const applyGravity = (object, environment) => {
  // Check if object is not a surface
  if (object.onSurface !== true) {
    //   Update objects position
    object.position.y += object.velocity.y;

    if (object.position.y + object.dimensions.height <= environment.height) {
      //   Apply velocity
      object.onSurface = false;
      object.velocity.y += 0.15;
    } else {
      object.position.y = environment.height - object.dimensions.height;
      object.resetOnPlaced();
    }
  }
};
