function __method_wrapper__() {
    async ({
      networkPreview,
      numberOfWindows,
      hotReload,
      projectDataOnlyExport,
      fullLoadingScreen,
      forceDiagnosticReport,
      launchCaptureOptions,
    }: LaunchPreviewOptions) => {
      if (!currentProject) return;
      if (currentProject.getLayoutsCount() === 0) return;

      const previewLauncher = _previewLauncher.current;
      if (!previewLauncher) return;

      // Open the preview windows immediately, if required by the preview launcher.
      // This is because some browsers (like Safari or Firefox) will block the
      // window opening if done after an asynchronous operation.
      const previewWindows = previewLauncher.immediatelyPreparePreviewWindows
        ? previewLauncher.immediatelyPreparePreviewWindows({
            project: currentProject,
            hotReload: !!hotReload,
            numberOfWindows: numberOfWindows || 1,
          })
        : null;

      setPreviewLoading(true);
      notifyPreviewOrExportWillStart(state.editorTabs);

      const layoutName = previewState.isPreviewOverriden
        ? previewState.overridenPreviewLayoutName
        : previewState.previewLayoutName;
      const externalLayoutName = previewState.isPreviewOverriden
        ? previewState.overridenPreviewExternalLayoutName
        : previewState.previewExternalLayoutName;

      const layout =
        layoutName && currentProject.hasLayoutNamed(layoutName)
          ? currentProject.getLayout(layoutName)
          : currentProject.getLayoutAt(0);
      const externalLayout =
        externalLayoutName &&
        currentProject.hasExternalLayoutNamed(externalLayoutName)
          ? currentProject.getExternalLayout(externalLayoutName)
          : null;

      autosaveProjectIfNeeded().catch(err => {
        console.error('Error while auto-saving the project. Ignoring.', err);
      });

      // Note that in the future, this kind of checks could be done
      // and stored in a "diagnostic report", rather than hiding errors
      // from the user.
      findAndLogProjectPreviewErrors(currentProject);

      const fallbackAuthor = authenticatedUser.profile
        ? {
            username: authenticatedUser.profile.username || '',
            id: authenticatedUser.profile.id,
          }
        : null;

      const authenticatedPlayer = await getAuthenticatedPlayerForPreview();

      const captureOptions = await createCaptureOptionsForPreview(
        launchCaptureOptions
      );

      try {
        await eventsFunctionsExtensionsState.ensureLoadFinished();

        const startTime = Date.now();
        let inAppTutorialMessageInPreview = { message: '', position: '' };
        if (inAppTutorialOrchestratorRef.current) {
          inAppTutorialMessageInPreview =
            inAppTutorialOrchestratorRef.current.getPreviewMessage() ||
            inAppTutorialMessageInPreview;
        }
        await previewLauncher.launchPreview({
          project: currentProject,
          layout,
          externalLayout,
          networkPreview: !!networkPreview,
          hotReload: !!hotReload,
          projectDataOnlyExport: !!projectDataOnlyExport,
          fullLoadingScreen: !!fullLoadingScreen,
          fallbackAuthor,
          authenticatedPlayer,
          getIsMenuBarHiddenInPreview: preferences.getIsMenuBarHiddenInPreview,
          getIsAlwaysOnTopInPreview: preferences.getIsAlwaysOnTopInPreview,
          numberOfWindows: numberOfWindows || 1,
          inAppTutorialMessageInPreview: inAppTutorialMessageInPreview.message,
          inAppTutorialMessagePositionInPreview:
            inAppTutorialMessageInPreview.position,
          captureOptions,
          onCaptureFinished,

          previewWindows,
        });
        setPreviewLoading(false);

        sendPreviewStarted({
          quickCustomizationGameId:
            quickCustomizationDialogOpenedFromGameId || null,
          networkPreview: !!networkPreview,
          hotReload: !!hotReload,
          projectDataOnlyExport: !!projectDataOnlyExport,
          fullLoadingScreen: !!fullLoadingScreen,
          numberOfWindows: numberOfWindows || 1,
          forceDiagnosticReport: !!forceDiagnosticReport,
          previewLaunchDuration: Date.now() - startTime,
        });

        if (inAppTutorialOrchestratorRef.current) {
          inAppTutorialOrchestratorRef.current.onPreviewLaunch();
        }
        if (!currentlyRunningInAppTutorial) {
          const wholeProjectDiagnosticReport = currentProject.getWholeProjectDiagnosticReport();
          if (
            (forceDiagnosticReport ||
              preferences.values.openDiagnosticReportAutomatically) &&
            wholeProjectDiagnosticReport.hasAnyIssue()
          ) {
            setDiagnosticReportDialogOpen(true);
          }
        }
      } catch (error) {
        console.error(
          'Error caught while launching preview, this should never happen.',
          error
        );
      }
    },

}
