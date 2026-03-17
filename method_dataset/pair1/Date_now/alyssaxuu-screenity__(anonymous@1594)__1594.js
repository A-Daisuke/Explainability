  const onMessage = useCallback((request, sender, sendResponse) => {
    if (request.type === "loaded") {
      setInitProject(false);
      backupRef.current = request.backup;
      if (IS_IFRAME_CONTEXT) {
        // Only trigger if it's actually a region recording
        if (request.region) {
          isInit.current = true;
          chrome.runtime.sendMessage({ type: "get-streaming-data" });
        }
      } else if (!request.region) {
        if (!tabPreferred.current) {
          isTab.current = request.isTab;
          if (request.isTab) getStreamID(request.tabID);
        } else {
          isTab.current = false;
        }
        isInit.current = true;
        chrome.runtime.sendMessage({ type: "get-streaming-data" });
      }
    } else if (request.type === "streaming-data") {
      if (!isInit.current) return;
      if (IS_IFRAME_CONTEXT) {
        if (regionRef.current) {
          startStreaming(JSON.parse(request.data));
        }
      } else if (!regionRef.current) {
        startStreaming(JSON.parse(request.data));
      }
    } else if (request.type === "start-recording-tab") {
      if (!isInit.current) return;

      if (IS_IFRAME_CONTEXT) {
        if (request.region) setTimeout(() => startRecording(), 100);
      } else if (!regionRef.current) {
        setTimeout(() => startRecording(), 100);
      }
    } else if (request.type === "restart-recording-tab") {
      if (!isInit.current) return;
      if (!IS_IFRAME_CONTEXT) {
        restartRecording();
      }
    } else if (request.type === "stop-recording-tab") {
      if (!isInit.current) return;
      stopRecording();
    } else if (request.type === "set-mic-active-tab") {
      if (!isInit.current) return;
      setMic(request);
    } else if (request.type === "set-audio-output-volume") {
      if (!isInit.current) return;
      setAudioOutputVolume(request.volume);
    } else if (request.type === "get-video-time") {
      if (!isInit.current) return;
      const videoTime = getActiveVideoTime() / 1000; // in seconds
      sendResponse({ videoTime });
      return true;
    } else if (request.type === "pause-recording-tab") {
      if (!isInit.current) return;

      // Pause all active recorders
      if (
        screenRecorder.current &&
        screenRecorder.current.state === "recording"
      ) {
        screenRecorder.current.pause();
      }
      if (
        cameraRecorder.current &&
        cameraRecorder.current.state === "recording"
      ) {
        cameraRecorder.current.pause();
      }
      if (
        audioRecorder.current &&
        audioRecorder.current.state === "recording"
      ) {
        audioRecorder.current.pause();
      }

      const now = Date.now();
      if (!screenTimer.current.paused && screenTimer.current.start) {
        screenTimer.current.total += now - screenTimer.current.start;
        screenTimer.current.paused = true;
      }
      if (!cameraTimer.current.paused && cameraTimer.current.start) {
        cameraTimer.current.total += now - cameraTimer.current.start;
        cameraTimer.current.paused = true;
      }
    } else if (request.type === "resume-recording-tab") {
      if (!isInit.current) return;

      // Resume all paused recorders
      if (screenRecorder.current && screenRecorder.current.state === "paused") {
        screenRecorder.current.resume();
      }
      if (cameraRecorder.current && cameraRecorder.current.state === "paused") {
        cameraRecorder.current.resume();
      }
      if (audioRecorder.current && audioRecorder.current.state === "paused") {
        audioRecorder.current.resume();
      }

      const now = Date.now();
      if (screenTimer.current.paused) {
        screenTimer.current.start = now;
        screenTimer.current.paused = false;
      }
      if (cameraTimer.current.paused) {
        cameraTimer.current.start = now;
        cameraTimer.current.paused = false;
      }
    } else if (request.type === "dismiss-recording") {
      if (!isInit.current) return;
      dismissRecording();
    }
  }, []);
