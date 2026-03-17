function __method_wrapper__() {
    it('should rebuild when .babelrc changes', async function () {
      if (process.platform !== 'linux') {
        // This test is flaky outside of Linux. Skip it for now.
        return;
      }

      let inputDir = tempy.directory();
      let differentPath = path.join(inputDir, 'differentConfig');
      let configPath = path.join(inputDir, '.babelrc');

      await fs.ncp(
        path.join(__dirname, 'integration/babelrc-custom'),
        inputDir,
      );

      let b = bundler(path.join(inputDir, 'index.js'), {
        outputFS: fs,
        shouldAutoInstall: true,
      });

      subscription = await b.watch();
      await getNextBuild(b);
      let distFile = await fs.readFile(path.join(distDir, 'index.js'), 'utf8');
      assert(distFile.includes('hello there'));
      await fs.copyFile(differentPath, configPath);
      await new Promise(resolve => setTimeout(resolve, 100));
      // On Windows only, `fs.utimes` arguments must be instances of `Date`,
      // otherwise it fails. For Mac instances on Azure CI, using a Date instance
      // does not update the utime correctly, so for all other platforms, use a
      // number.
      // https://github.com/nodejs/node/issues/5561
      let now = os.platform() === 'win32' ? new Date() : Date.now();
      // fs.copyFile does not reliably update mtime, which babel uses to invalidate cached file contents
      await fs.utimes(configPath, now, now);
      await getNextBuild(b);
      distFile = await fs.readFile(path.join(distDir, 'index.js'), 'utf8');
      assert(!distFile.includes('hello there'));
      assert(distFile.includes('something different'));
    });

}
