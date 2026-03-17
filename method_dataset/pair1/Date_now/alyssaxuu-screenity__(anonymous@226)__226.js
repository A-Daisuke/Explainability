function __method_wrapper__() {
  registerMessage("recording-check", (message, sender) => {
    const { recordingStartTime } = message;

    if (recordingStartTime) {
      const time = Math.floor((Date.now() - recordingStartTime) / 1000);
      setTimer(time);
    }

    if (!message.force) {
      if (
        !contentStateRef.current.showExtension &&
        !contentStateRef.current.recording
      ) {
        updateFromStorage(true, sender.id);
      }
    } else {
      setContentState((prev) => ({
        ...prev,
        showExtension: true,
        recording: true,
      }));
      updateFromStorage(false, sender.id);
    }
  });

}
