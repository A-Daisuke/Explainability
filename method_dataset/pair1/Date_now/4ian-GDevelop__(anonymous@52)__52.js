function __method_wrapper__() {
    (event: TouchEvent) => {
      if (!startYRef.current || !startTimeRef.current) return;
      const { current: startY } = startYRef;
      const { current: startTime } = startTimeRef;

      const deltaY = event.changedTouches[0].clientY - startY;
      const deltaTimeInSeconds = (Date.now() - startTime) / 1000;
      if (
        Math.abs(deltaY) > minMovement &&
        Math.abs(deltaY) / deltaTimeInSeconds > minSpeed
      ) {
        if (deltaY < 0) onSwipeUp();
        else onSwipeDown();
      }

      // Reset the position of the movement with the touch.
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(0px)`;
      }

      startTimeRef.current = null;
      startYRef.current = null;
    },

}
