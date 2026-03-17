function __method_wrapper__() {
      fs.readFile.mockImplementation((path) => {
        if (path.includes('manifest.json')) {
          return Promise.resolve(JSON.stringify({
            type: 'pre-init',
            timestamp: Date.now(),
            files: ['CLAUDE.md']
          }));
        }
        if (path.includes('checkpoint.json')) {
          return Promise.resolve(JSON.stringify({
            phase: 'file-creation',
            timestamp: Date.now(),
            status: 'completed'
          }));
        }
        return Promise.resolve('{}');
      });

}
