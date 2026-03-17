function hmrDownload(asset) {
  if (asset.type === 'js') {
    if (typeof document !== 'undefined') {
      let script = document.createElement('script');
      script.src = asset.url + '?t=' + Date.now();
      if (asset.outputFormat === 'esmodule') {
        script.type = 'module';
      }
      return new Promise((resolve, reject) => {
        script.onload = () => resolve(script);
        script.onerror = reject;
        document.head?.appendChild(script);
      });
    } else if (typeof importScripts === 'function') {
      // Worker scripts
      if (asset.outputFormat === 'esmodule') {
        return __parcel__import__(asset.url + '?t=' + Date.now());
      } else {
        return new Promise((resolve, reject) => {
          try {
            __parcel__importScripts__(asset.url + '?t=' + Date.now());
            resolve();
          } catch (err) {
            reject(err);
          }
        });
      }
    }
  }
}
