function __method_wrapper__() {
  (options: RuntimeReportingOptions) => (errorRecord: ErrorRecord) => {
    try {
      if (typeof options.onError === 'function') {
        options.onError.call(null);
      }
    } finally {
      if (
        currentRuntimeErrorRecords.some(
          ({error}) => error === errorRecord.error,
        )
      ) {
        // Deduplicate identical errors.
        // This fixes https://github.com/facebook/create-react-app/issues/3011.
        // eslint-disable-next-line no-unsafe-finally
        return;
      }
      currentRuntimeErrorRecords = currentRuntimeErrorRecords.concat([
        errorRecord,
      ]);
      update();
    }
  };

}
