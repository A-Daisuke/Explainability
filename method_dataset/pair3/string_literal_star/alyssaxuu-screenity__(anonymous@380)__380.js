function __method_wrapper__() {
  registerMessage("update-project-loading", (message, sender) => {
    window.postMessage(
      { source: "update-project-loading", multiMode: message.multiMode },
      "*"
    );

    if (!message.multiMode) {
      setContentState((prev) => ({
        ...prev,
        showExtension: false,
        showPopup: false,
      }));
    }

    updateFromStorage(true, sender.id);
  });

}
