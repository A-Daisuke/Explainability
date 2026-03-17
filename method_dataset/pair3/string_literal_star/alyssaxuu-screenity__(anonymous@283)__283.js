  const startStreaming = useCallback(async () => {
    // Set this early
    setContentState((prev) => ({
      ...prev,
      pendingRecording: true,
    }));

    let permission = false;

    if (
      contentStateRef.current?.isLoggedIn &&
      contentStateRef.current?.isSubscribed &&
      CLOUD_FEATURES_ENABLED
    ) {
      const storageResponse = await chrome.runtime.sendMessage({
        type: "check-storage-quota",
      });

      const { success, canUpload, error } = storageResponse;

      if (success && canUpload === false) {
        contentStateRef.current.openModal(
          chrome.i18n.getMessage("storageLimitReachedTitle"),
          chrome.i18n.getMessage("storageLimitReachedDescription"),
          chrome.i18n.getMessage("manageStorageButtonLabel"),
          chrome.i18n.getMessage("closeModalLabel"),
          () => {
            window.open(process.env.SCREENITY_APP_BASE, "_blank");
          },
          () => {}
        );
      } else if (!success) {
        const isSubError = error === "Subscription inactive";
        const isAuthError = error === "Not authenticated";

        // Update content state if subscription is inactive
        if (isSubError) {
          contentStateRef.current.setContentState((prev) => ({
            ...prev,
            isSubscribed: false,
          }));
        } else if (isAuthError) {
          contentStateRef.current.setContentState((prev) => ({
            ...prev,
            isSubscribed: false,
            isLoggedIn: false,
            screenityUser: null,
            proSubscription: null,
          }));
        }

        const message = isAuthError
          ? chrome.i18n.getMessage("storageCheckFailAuthDescription")
          : chrome.i18n.getMessage("storageCheckFailDescription");

        contentStateRef.current.openModal(
          chrome.i18n.getMessage("storageCheckFailTitle"),
          message,
          chrome.i18n.getMessage("retryButtonLabel"),
          chrome.i18n.getMessage("closeModalLabel"),
          async () => {
            window.location.reload(); // or retry logic
          },
          () => {}
        );
      }

      if (!success || (success && canUpload === false)) {
        setContentState((prev) => ({
          ...prev,
          pendingRecording: false,
          preparingRecording: false,
        }));
        return; // Stop recording setup
      }
    }

    // Check if in content script or extension page (Chrome)
    if (window.location.href.includes("chrome-extension://")) {
      permission = await checkChromeCapturePermissions();
    } else {
      permission = await checkChromeCapturePermissionsSW();
    }

    if (!permission) {
      contentStateRef.current.openModal(
        chrome.i18n.getMessage("chromePermissionsModalTitle"),
        chrome.i18n.getMessage("chromePermissionsModalDescription"),
        chrome.i18n.getMessage("chromePermissionsModalAction"),
        chrome.i18n.getMessage("chromePermissionsModalCancel"),
        async () => {
          await checkChromeCapturePermissionsSW();
          startStreaming(); // Retry streaming
        },
        () => {},
        null,
        chrome.i18n.getMessage("learnMoreDot"),
        URL,
        true
      );
      setContentState((prevContentState) => ({
        ...prevContentState,
        pendingRecording: false,
        preparingRecording: false,
      }));
      return;
    }

    const data = await chrome.runtime.sendMessage({ type: "available-memory" });

    if (
      data.quota < 524288000 &&
      !contentStateRef.current.isLoggedIn &&
      !contentStateRef.current.isSubscribed
    ) {
      if (typeof contentStateRef.current.openModal === "function") {
        let clear = null;
        let clearAction = () => {};
        const locale = chrome.i18n.getMessage("@@ui_locale");
        let helpURL =
          "https://help.screenity.io/troubleshooting/9Jy5RGjNrBB42hqUdREQ7W/what-does-%E2%80%9Cmemory-limit-reached%E2%80%9D-mean-when-recording/8WkwHbt3puuXunYqQnyPcb";

        if (!locale.includes("en")) {
          helpURL =
            "https://translate.google.com/translate?sl=en&tl=" +
            locale +
            "&u=https://help.screenity.io/troubleshooting/9Jy5RGjNrBB42hqUdREQ7W/what-does-%E2%80%9Cmemory-limit-reached%E2%80%9D-mean-when-recording/8WkwHbt3puuXunYqQnyPcb";
        }

        const response = await chrome.runtime.sendMessage({
          type: "check-restore",
        });
        if (response.restore) {
          clear = chrome.i18n.getMessage("clearSpaceButton");
          clearAction = () => {
            chrome.runtime.sendMessage({ type: "clear-recordings" });
          };
        }

        contentStateRef.current.openModal(
          chrome.i18n.getMessage("notEnoughSpaceTitle"),
          chrome.i18n.getMessage("notEnoughSpaceDescription"),
          clear,
          chrome.i18n.getMessage("permissionsModalDismiss"),
          clearAction,
          () => {},
          null,
          chrome.i18n.getMessage("learnMoreDot"),
          helpURL
        );
      }
      setContentState((prevContentState) => ({
        ...prevContentState,
        pendingRecording: false,
        preparingRecording: false,
      }));
      return;
    }
    chrome.storage.local.set({
      tabRecordedID: null,
    });

    if (
      contentStateRef.current.recordingType === "region" &&
      contentStateRef.current.cropTarget
    ) {
      contentStateRef.current.regionCaptureRef.contentWindow.postMessage(
        {
          type: "crop-target",
          target: contentStateRef.current.cropTarget,
          width: contentStateRef.current.regionWidth,
          height: contentStateRef.current.regionHeight,
        },
        "*"
      );
    }

    setContentState((prevContentState) => ({
      ...prevContentState,
      showOnboardingArrow: false,
    }));

    if (
      !contentStateRef.current.micActive &&
      contentStateRef.current.askMicrophone
    ) {
      contentStateRef.current.openModal(
        chrome.i18n.getMessage("micMutedModalTitle"),
        chrome.i18n.getMessage("micMutedModalDescription"),
        chrome.i18n.getMessage("micMutedModalAction"),
        chrome.i18n.getMessage("micMutedModalCancel"),
        () => {
          chrome.runtime.sendMessage({
            type: "desktop-capture",
            region:
              contentStateRef.current.recordingType === "region" ? true : false,
            customRegion: contentStateRef.current.customRegion,
            offscreenRecording: contentStateRef.current.offscreenRecording,
            camera:
              contentStateRef.current.recordingType === "camera" ? true : false,
          });
          setContentState((prevContentState) => ({
            ...prevContentState,

            surface: "default",
            pipEnded: false,
          }));
        },
        () => {},
        false,
        false,
        false,
        false,
        chrome.i18n.getMessage("noShowAgain"),
        () => {
          setContentState((prevContentState) => ({
            ...prevContentState,
            askMicrophone: false,
          }));
          chrome.storage.local.set({ askMicrophone: false });
        }
      );
    } else {
      chrome.runtime.sendMessage({
        type: "desktop-capture",
        region:
          contentStateRef.current.recordingType === "region" ? true : false,
        customRegion: contentStateRef.current.customRegion,
        offscreenRecording: contentStateRef.current.offscreenRecording,
        camera:
          contentStateRef.current.recordingType === "camera" ? true : false,
      });
      setContentState((prevContentState) => ({
        ...prevContentState,

        surface: "default",
        pipEnded: false,
      }));
    }
  }, [contentState, contentStateRef]);
