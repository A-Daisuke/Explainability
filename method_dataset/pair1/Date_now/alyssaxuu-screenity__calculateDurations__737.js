  const calculateDurations = () => {
    const now = Date.now();

    const getDuration = (timer) => {
      const elapsed = !timer.paused && timer.start ? now - timer.start : 0;
      const total = (timer.total || 0) + elapsed;
      const duration = total / 1000;

      // If timer ever started but duration is zero, use min duration
      if (timer.start && duration < MIN_DURATION_SECONDS) {
        return MIN_DURATION_SECONDS;
      }

      return duration;
    };

    return {
      screen: getDuration(screenTimer.current),
      camera: getDuration(cameraTimer.current),
    };
  };
