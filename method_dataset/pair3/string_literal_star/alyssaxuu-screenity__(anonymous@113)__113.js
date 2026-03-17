function __method_wrapper__() {
    setTimeout(() => {
      chrome.runtime.sendMessage({ type: "discard-backup-restart" });
      chrome.runtime.sendMessage({ type: "restart-recording-tab" });
      // Check if custom region is set
      if (
        contentStateRef.current.recordingType === "region" &&
        contentStateRef.current.cropTarget
      ) {
        contentStateRef.current.regionCaptureRef.contentWindow.postMessage(
          {
            type: "restart-recording",
          },
          "*"
        );
      }
      if (contentStateRef.current.alarm) {
        setTimer(contentStateRef.current.alarmTime);
      } else {
        setTimer(0);
      }
      setContentState((prevContentState) => ({
        ...prevContentState,
        recording: false,
        time: 0,
        paused: false,
      }));
    }, 100);

}
