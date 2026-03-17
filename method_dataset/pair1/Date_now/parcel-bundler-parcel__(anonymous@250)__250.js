function __method_wrapper__() {
  client.onNotification(NotificationBuildStatus, (state, message) => {
    // console.log('got NotificationBuildStatus', state, message);
    if (state === 'start') {
      progressReporter.begin();
      for (let uri of uris) {
        connection.sendDiagnostics({uri, diagnostics: []});
      }
    } else if (state === 'progress' && message != null) {
      progressReporter.report(message);
    } else if (state === 'end') {
      result.lastBuild = String(Date.now());
      sendDiagnosticsRefresh();
      progressReporter.done();
      connection.sendNotification(NotificationBuild);
    }
  });

}
