function __method_wrapper__() {
  it('constructor() should allow for configuration of max concurrent running functions', async () => {
    const maxConcurrent = 5;
    const queue = new PromiseQueue({maxConcurrent});
    let running = 0;

    new Array(100).fill(0).map(() =>
      queue.add(async () => {
        running++;
        assert(queue._numRunning === running);
        assert(running <= maxConcurrent);
        await Promise.resolve(Math.floor(Math.random() * 10) + 1);
        running--;
      }),
    );

    await queue.run();
  });

}
