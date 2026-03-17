function __method_wrapper__() {
    builds.forEach(build => {
      if (build.status === 'pending') {
        if (
          (!build.createdAt ||
            build.createdAt < Date.now() - maxTimeBeforeIgnoring) &&
          (!build.updatedAt ||
            build.updatedAt < Date.now() - maxTimeBeforeIgnoring)
        ) {
          console.info(
            "Ignoring a build for polling as it's too old and still pending",
            build
          );
        } else {
          this._pollBuild(
            build.id,
            builds.length > 1 ? bulkWaitTime : waitTime
          );
        }
      }
    });

}
