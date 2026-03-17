  const stopRecording = async (shouldFinalize = true) => {
    if (isFinishing.current || sentLast.current) return;

    if (keepAliveInterval.current) {
      clearInterval(keepAliveInterval.current);
      keepAliveInterval.current = null;
    }

    const { projectId, recordingToScene, multiMode } =
      await chrome.storage.local.get([
        "projectId",
        "recordingToScene",
        "multiMode",
      ]);

    if (shouldFinalize) {
      if (recordingToScene) {
        chrome.runtime.sendMessage({
          type: "prepare-editor-existing",
          multiMode: multiMode,
        });
      } else if (!multiMode && !recordingToScene) {
        chrome.runtime.sendMessage({
          type: "prepare-open-editor",
          url: instantMode.current
            ? `${process.env.SCREENITY_APP_BASE}/view/${projectId}?load=true`
            : `${process.env.SCREENITY_APP_BASE}/editor/${projectId}/edit?load=true`,
          publicUrl: `${process.env.SCREENITY_APP_BASE}/view/${projectId}/`,
          instantMode: instantMode.current,
        });
      }
    }
    isFinishing.current = true;
    chrome.storage.local.set({ recording: false });

    await stopAllRecorders();

    const durations = calculateDurations();

    await flushPendingChunks();

    await Promise.allSettled([
      screenUploader.current?.finalize?.(),
      cameraUploader.current?.finalize?.(),
    ]);

    const { sceneId } = await chrome.storage.local.get(["sceneId"]);

    const uploadMeta = {
      screen: screenUploader.current?.getMeta() || null,
      camera: cameraUploader.current?.getMeta() || null,
      audio: null,
      //sceneId,
      // use sceneId as per the metadata in screenUploader or cameraUploader, whichever exists
      sceneId:
        screenUploader.current?.getMeta()?.sceneId ||
        cameraUploader.current?.getMeta()?.sceneId ||
        sceneId,
    };

    uploadMetaRef.current = uploadMeta;

    cleanupTimers();

    if (!shouldFinalize) return;

    // Validate that at least one media source was successfully uploaded
    const hasValidScreen =
      uploadMeta.screen?.status === "completed" &&
      uploadMeta.screen?.mediaId &&
      uploadMeta.screen?.videoId;
    const hasValidCamera =
      uploadMeta.camera?.status === "completed" &&
      uploadMeta.camera?.mediaId &&
      uploadMeta.camera?.videoId;

    // Warn if upload size seems suspiciously small for recording duration
    const screenDuration = durations.screen || 0;
    const cameraDuration = durations.camera || 0;
    if (hasValidScreen && screenDuration > 5) {
      const screenOffset = uploadMeta.screen?.offset || 0;
      const minExpectedSize = screenDuration * 50000; // ~50KB/sec minimum
      if (screenOffset < minExpectedSize) {
        console.warn(
          `⚠️ Screen upload size (${screenOffset} bytes) seems small for ${screenDuration}s recording. Expected at least ${minExpectedSize} bytes.`
        );
      }
    }

    if (!hasValidScreen && !hasValidCamera) {
      const screenStatus = uploadMeta.screen?.status || "none";
      const cameraStatus = uploadMeta.camera?.status || "none";
      const screenOffset = uploadMeta.screen?.offset || 0;
      const cameraOffset = uploadMeta.camera?.offset || 0;
      const screenError = uploadMeta.screen?.error || "none";
      const cameraError = uploadMeta.camera?.error || "none";
      throw new Error(
        `No media was successfully uploaded. Screen: ${screenStatus} (${screenOffset} bytes, error: ${screenError}), Camera: ${cameraStatus} (${cameraOffset} bytes, error: ${cameraError})`
      );
    }

    // Create final audio blob from chunks
    const audioBlob = createBlobFromChunks(audioChunks.current, "audio/webm");

    const result = await handleAudioUpload(audioBlob, projectId, uploadMeta);
    uploadMeta.audio = result;

    chrome.storage.local.set({ uploadMeta });

    isInit.current = false;

    if (!sentLast.current) {
      sentLast.current = true;
      const silent = audioBlob ? await isAudioSilent(audioBlob) : true;
      try {
        await createSceneOrHandleMultiMode(uploadMeta, durations, silent);

        if (!silent && audioBlob) {
          await handleTranscription(uploadMeta, projectId);
        }

        chrome.runtime.sendMessage({ type: "video-ready", uploadMeta });

        if (!IS_IFRAME_CONTEXT) {
          window.close();
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.error("❌ Failed to create scene:", err);

        // Provide user-friendly error message based on the error type
        let userMessage = "Failed to save recording: ";
        if (
          err.message.includes("No data uploaded") ||
          err.message.includes("offset is 0")
        ) {
          userMessage +=
            "No video data was uploaded. This may be due to network issues. Please check your connection and try again.";
        } else if (err.message.includes("No media was successfully uploaded")) {
          userMessage +=
            "Upload did not complete successfully. Please check your internet connection and try recording again.";
        } else {
          userMessage += err.message;
        }

        sendRecordingError(userMessage);

        chrome.storage.local.set({
          failedRecording: {
            uploadMeta,
            durations,
            timestamp: Date.now(),
            error: err.message,
          },
        });

        // Still close the window even on error to prevent stuck tabs
        // Give user time to see the error message
        setTimeout(() => {
          if (!IS_IFRAME_CONTEXT) {
            window.close();
          } else {
            window.location.reload();
          }
        }, 3000);
      }
    }
  };
