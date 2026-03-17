  const enumerateDevices = async (camGranted = true, micGranted = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: micGranted,
        video: camGranted,
      });

      const devicesInfo = await navigator.mediaDevices.enumerateDevices();

      let audioinput = [];
      let audiooutput = [];
      let videoinput = [];

      if (micGranted) {
        // Filter by audio input
        audioinput = devicesInfo
          .filter((device) => device.kind === "audioinput")
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label,
          }));

        // Filter by audio output and extract relevant properties
        audiooutput = devicesInfo
          .filter((device) => device.kind === "audiooutput")
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label,
          }));
      }

      if (camGranted) {
        // Filter by video input and extract relevant properties
        videoinput = devicesInfo
          .filter((device) => device.kind === "videoinput")
          .map((device) => ({
            deviceId: device.deviceId,
            label: device.label,
          }));
      }

      // Save in Chrome local storage
      chrome.storage.local.set({
        // Set available devices
        audioinput: audioinput,
        audiooutput: audiooutput,
        videoinput: videoinput,
        cameraPermission: camGranted,
        microphonePermission: micGranted,
      });

      // Post message to parent window
      window.parent.postMessage(
        {
          type: "screenity-permissions",
          success: true,
          audioinput: audioinput,
          audiooutput: audiooutput,
          videoinput: videoinput,
          cameraPermission: camGranted,
          microphonePermission: micGranted,
        },
        "*"
      );

      //sendResponse({ success: true, audioinput, audiooutput, videoinput });

      // End the stream
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
    } catch (err) {
      // Post message to parent window
      window.parent.postMessage(
        {
          type: "screenity-permissions",
          success: false,
          error: err.name,
        },
        "*"
      );
      //sendResponse({ success: false, error: err.name });
    }
  };
