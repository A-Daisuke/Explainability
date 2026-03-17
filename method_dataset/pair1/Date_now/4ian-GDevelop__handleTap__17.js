  const handleTap = (event: PIXI.InteractionEvent) => {
    const { x, y } = event.data.global;
    const currentTime = Date.now();

    if (
      currentTime - lastClickTime < doubleClickDelay &&
      Math.abs(x - lastClickGlobalX) <= moveTolerance &&
      Math.abs(y - lastClickGlobalY) <= moveTolerance
    ) {
      // Wait for the next event cycle, as otherwise the "touchend"
      // event could be catched by a dialog/another component shown
      // as a result of the double click.
      setTimeout(() => {
        pixiDisplayObject.emit('doubleclick', event);
      });
    }

    lastClickTime = currentTime;
    lastClickGlobalX = x;
    lastClickGlobalY = y;
  };
