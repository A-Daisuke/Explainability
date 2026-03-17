  const checkPermissions = async () => {
    // Individually check the camera and microphone permissions using the Permissions API. Then enumerate devices respectively.
    try {
      const cameraPermission = await navigator.permissions.query({
        name: "camera",
      });
      const microphonePermission = await navigator.permissions.query({
        name: "microphone",
      });

      cameraPermission.onchange = () => {
        checkPermissions();
      };

      microphonePermission.onchange = () => {
        checkPermissions();
      };

      // If the permissions are granted, enumerate devices
      if (
        cameraPermission.state === "granted" ||
        microphonePermission.state === "granted"
      ) {
        enumerateDevices(
          cameraPermission.state === "granted",
          microphonePermission.state === "granted"
        );
      } else {
        // Post message to parent window
        window.parent.postMessage(
          {
            type: "screenity-permissions",
            success: false,
            error: err.name,
          },
          "*"
        );
        // sendResponse({ success: false, error: err.name });
      }
    } catch (err) {
      enumerateDevices();
    }
  };
