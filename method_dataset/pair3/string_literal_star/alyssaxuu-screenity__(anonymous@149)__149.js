function __method_wrapper__() {
  useEffect(() => {
    if (contentState.permissionsChecked) return;
    if (!permissionsRef.current) return;
    if (!contentState.showExtension) return;
    if (!contentState.permissionsLoaded) return;

    permissionsRef.current.contentWindow.postMessage(
      {
        type: "screenity-get-permissions",
      },
      "*"
    );

    setContentState((prevContentState) => ({
      ...prevContentState,
      permissionsChecked: true,
    }));
  }, [

}
