const getTouch = (client: Position, force: number): Object => {
  // window.Touch not supported in jest yet so just returning an object

  // const touch: Touch = new window.Touch({
  const touch = {
    // const touch: Touch = {
    identifier: Date.now(),
    // being super generic here
    target: window,
    clientX: client.x,
    clientY: client.y,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 0,
    force,
  };

  return touch;
};
