function __method_wrapper__() {
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

}
