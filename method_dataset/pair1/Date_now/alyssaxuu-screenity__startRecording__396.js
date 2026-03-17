  const startRecording = async () => {
    setInitProject(false);
    startKeepAlive();

    if (!uploadersInitialized.current) {
      sendRecordingError(
        "Uploaders not initialized. Please restart recording."
      );
      return;
    }

    if (!screenStream.current && !cameraStream.current) {
      sendRecordingError("No streams to record");
      return;
    }

    const { projectId } = await chrome.storage.local.get(["projectId"]);

    if (!projectId) {
      sendRecordingError("No project ID found. Please restart recording.");
      return;
    }

    if (!screenUploader.current && !cameraUploader.current) {
      sendRecordingError("Uploaders not ready. Please restart recording.");
      return;
    }

    await chunksStore.clear();
    lastTimecode.current = 0;
    hasChunks.current = false;
    index.current = 0;

    // Clear blob storage arrays
    screenChunks.current = [];
    cameraChunks.current = [];
    audioChunks.current = [];

    navigator.storage.persist();

    try {
      // Screen recorder setup
      if (screenStream.current) {
        const stream = attachMicToStream(
          screenStream.current,
          micStream.current
        );

        const screenOptions = {
          mimeType: "video/webm;codecs=vp9,opus",
          videoBitsPerSecond: 16000000, // 16 Mbps
          audioBitsPerSecond: 128000, // 128 Kbps
        };

        screenRecorder.current = createMediaRecorder(
          stream,
          screenOptions,
          async (blob) => {
            checkMaxMemory();

            // Detect empty chunks which indicate recording failure
            if (!blob || blob.size === 0) {
              console.error("❌ MediaRecorder produced empty chunk!");
              consecutiveScreenFailures.current++;
              if (consecutiveScreenFailures.current > 3) {
                sendRecordingError(
                  "Recording failed - no video data being captured. Please try again."
                );
                sendStopRecording();
              }
              return;
            }

            // Store for final blob creation
            screenChunks.current.push(blob);

            const timestamp = Date.now();

            if (!hasChunks.current) {
              hasChunks.current = true;
              lastTimecode.current = timestamp;
            } else if (timestamp < lastTimecode.current) {
              return; // Skip duplicate
            } else {
              lastTimecode.current = timestamp;
            }

            await chunksStore.setItem(`chunk_${index.current}`, {
              index: index.current,
              chunk: blob,
              timestamp,
            });

            if (uploadersInitialized.current && screenUploader.current) {
              try {
                if (screenUploader.current?.isPaused) return;
                await screenUploader.current.write(blob);
                consecutiveScreenFailures.current = 0; // Reset on success
              } catch (uploadErr) {
                console.error("Failed to upload chunk to Bunny:", uploadErr);
                consecutiveScreenFailures.current++;
                if (consecutiveScreenFailures.current > 3) {
                  sendRecordingError(
                    "Screen upload failed repeatedly. Stopping recording."
                  );
                  sendStopRecording();
                }
              }
            }

            if (backupRef.current) {
              chrome.runtime.sendMessage({
                type: "write-file",
                index: index.current,
              });
            }

            index.current++;
          }
        );

        // Start recording with 2-second time slices
        screenRecorder.current.start(2000);

        screenStream.current.getVideoTracks()[0].onended = () => {
          chrome.storage.local.set({
            recording: false,
            restarting: false,
          });
          cleanupTimers();
          sendStopRecording();
        };
      }

      // Audio recorder setup (for transcription)
      if (rawMicStream.current) {
        const audioOptions = {
          mimeType: "audio/webm", // Using webm instead of wav for better browser support
          audioBitsPerSecond: 128000,
        };

        audioRecorder.current = createMediaRecorder(
          rawMicStream.current,
          audioOptions,
          (blob) => {
            // Store chunks for final blob creation
            audioChunks.current.push(blob);
          }
        );

        audioRecorder.current.start(2000);
      }

      // Camera recorder setup
      if (cameraStream.current) {
        let streamToRecord = cameraStream.current;

        if (recordingType.current === "camera") {
          if (micStream.current) {
            streamToRecord = attachMicToStream(
              cameraStream.current,
              micStream.current
            );
          } else {
            console.warn("⚠️ Camera-only recording: microphone not available");
          }
        }

        const cameraOptions = {
          mimeType:
            recordingType.current === "camera"
              ? "video/webm;codecs=vp9,opus"
              : "video/webm;codecs=vp9",
          videoBitsPerSecond: 16000000, // 16 Mbps
          audioBitsPerSecond: 128000, // 128 Kbps
        };

        cameraRecorder.current = createMediaRecorder(
          streamToRecord,
          cameraOptions,
          async (blob) => {
            // Detect empty chunks
            if (!blob || blob.size === 0) {
              console.warn("⚠️ Camera MediaRecorder produced empty chunk");
              consecutiveCameraFailures.current++;
              return;
            }

            // Store for final blob creation
            cameraChunks.current.push(blob);

            if (uploadersInitialized.current && cameraUploader.current) {
              try {
                if (cameraUploader.current?.isPaused) return;
                await cameraUploader.current.write(blob);
                consecutiveCameraFailures.current = 0; // Reset on success
              } catch (uploadErr) {
                console.error(
                  "Failed to upload camera chunk to Bunny:",
                  uploadErr
                );
                consecutiveCameraFailures.current++;
                if (consecutiveCameraFailures.current > 3) {
                  console.error("Camera upload failing repeatedly");
                  // Don't stop recording, just log - camera is secondary
                }
              }
            }
          }
        );

        cameraRecorder.current.start(2000);
      }

      let warned = false;
      const MAX_DURATION =
        parseFloat(process.env.MAX_RECORDING_DURATION) || 60 * 60;
      const WARNING_THRESHOLD =
        parseFloat(process.env.RECORDING_WARNING_THRESHOLD) || 60;

      if (screenTimer.current.notificationInterval)
        clearInterval(screenTimer.current.notificationInterval);

      const timerInterval = setInterval(() => {
        // stop if not recording anymore
        if (!screenStream.current && !cameraStream.current) {
          clearInterval(timerInterval);
          cleanupTimers();
          console.warn("Recording stopped, clearing timer");
          return;
        }

        const elapsed = getActiveVideoTime() / 1000;
        const remaining = MAX_DURATION - elapsed;

        if (!warned && remaining <= WARNING_THRESHOLD) {
          warned = true;
          chrome.runtime.sendMessage({
            type: "time-warning",
          });
        }

        if (remaining <= 0) {
          clearInterval(timerInterval);
          chrome.runtime.sendMessage({
            type: "time-stopped",
          });
          sendStopRecording();
        }
      }, 1000);

      // Save to clear later
      screenTimer.current.notificationInterval = timerInterval;
      screenTimer.current.warned = warned;

      chrome.storage.local.set({ recording: true });
      setStarted(true);
    } catch (err) {
      sendRecordingError("Recording failed: " + err.message);
    }

    const now = Date.now();
    if (screenStream.current) {
      screenTimer.current.start = now;
      screenTimer.current.paused = false;
      screenTimer.current.total = 0;
    }
    if (cameraStream.current) {
      cameraTimer.current.start = now;
      cameraTimer.current.paused = false;
      cameraTimer.current.total = 0;
    }
  };
