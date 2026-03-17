function __method_wrapper__() {
      gm.noise(0.3).write(noisePath, function (err) {
        if (err) return finish(err);

        const options = {
          highlightColor: 'yellow',
          file: path.join(dir, `compare-test-${Date.now()}.png`),
          tolerance: 0.001
        };

        // Compare these images and write to a file.
        gm.compare(originalJPGFilePath, noisePath, options, function(err) {
          if (err) return finish(err);

          fs.access(options.file, fs.constants.F_OK, function(err) {
            if (err) {
              finish(new Error('Diff file does not exist.'));
            } else {
              fs.unlink(options.file, () => finish());
            }
          });
        });
      });

}
