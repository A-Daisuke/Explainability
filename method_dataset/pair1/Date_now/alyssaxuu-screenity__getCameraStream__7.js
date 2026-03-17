export const getCameraStream = async (
  constraints,
  streamRef,
  videoRef,
  offScreenCanvasRef,
  offScreenCanvasContextRef,
  { onStart = () => {}, onFinish = () => {} } = {}
) => {
  const { setWidth, setHeight, recordingTypeRef } = getContextRefs();

  onStart();

  if (!streamRef) {
    console.warn("⚠️ streamRef is undefined. Creating a new reference.");
    streamRef = { current: new MediaStream() };
  }

  if (!videoRef) {
    console.warn("⚠️ videoRef is undefined. Creating a new reference.");
    videoRef = { current: null };
  }

  if (!offScreenCanvasRef) {
    console.warn(
      "⚠️ offScreenCanvasRef is undefined. Creating a new reference."
    );
    offScreenCanvasRef = { current: null };
  }

  if (!offScreenCanvasContextRef) {
    console.warn(
      "⚠️ offScreenCanvasContextRef is undefined. Creating a new reference."
    );
    offScreenCanvasContextRef = { current: null };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    streamRef.current = stream;

    const videoTrack = stream.getVideoTracks()[0];
    const { width, height, deviceId, frameRate } = videoTrack.getSettings();

    if (setWidth && setHeight) {
      const isCamera = recordingTypeRef?.current === "camera";
      const w = isCamera || width / height < 1 ? "100%" : "auto";
      const h = isCamera || width / height < 1 ? "auto" : "100%";
      setWidth(w);
      setHeight(h);
    } else {
      console.warn("⚠️ setWidth or setHeight not available from context.");
    }

    // VIDEO REF SETUP
    if (!videoRef.current) {
      console.warn("⏳ videoRef not ready yet. Will poll every 100ms.");
      const maxWaitTime = 5000;
      const startTime = Date.now();

      const intervalId = setInterval(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          clearInterval(intervalId);
        } else if (Date.now() - startTime > maxWaitTime) {
          console.warn("⚠️ Timed out waiting for videoRef.current");
          clearInterval(intervalId);
        }
      }, 100);
      return;
    }

    const video = videoRef.current;
    video.srcObject = stream;

    await new Promise((resolve) => {
      video.onloadedmetadata = async () => {
        await video.play().catch((err) => {
          console.error("❌ Error during video.play():", err);
        });

        await new Promise((r) => setTimeout(r, 100));

        const canvas = offScreenCanvasRef?.current;
        if (!canvas) {
          console.warn("⚠️ offScreenCanvasRef.current is null.");
          return resolve();
        }

        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        const context = canvas.getContext("2d");
        if (!context) {
          console.error("❌ Failed to get 2D context from canvas.");
          return resolve();
        }

        offScreenCanvasContextRef.current = context;

        resolve();
      };
    });

    onFinish();
  } catch (err) {
    console.error("❌ Failed to get camera stream:", err);
    onFinish();
  }
};
