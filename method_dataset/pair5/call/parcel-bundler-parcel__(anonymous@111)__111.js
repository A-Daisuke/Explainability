function __method_wrapper__() {
    await new Promise((resolve, reject) => {
      this.call({
        method: 'childInit',
        args: [
          forkModule,
          {
            shouldPatchConsole: !!this.options.shouldPatchConsole,
            shouldTrace: !!this.options.shouldTrace,
          },
        ],
        retries: 0,
        skipReadyCheck: true,
        resolve,
        reject,
      });
    });

}
