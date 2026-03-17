function __method_wrapper__() {
      return new Promise((resolve, reject) => {
        const existingScriptElement = this._reloadedScriptElement[srcFilename];
        if (existingScriptElement) {
          head.removeChild(existingScriptElement);
        } else {
          // Check if there is an existing scriptElement in head
          const headScriptElements = head.getElementsByTagName('script');
          for (let i = 0; i < headScriptElements.length; ++i) {
            const scriptElement = headScriptElements[i];
            if (endsWith(scriptElement.src, srcFilename)) {
              head.removeChild(scriptElement);
            }
          }
        }
        const reloadedScriptElement = document.createElement('script');
        reloadedScriptElement.src = srcFilename + '?timestamp=' + Date.now();
        reloadedScriptElement.onload = () => {
          resolve();
        };
        reloadedScriptElement.onerror = (event) => {
          reject(event);
        };
        head.appendChild(reloadedScriptElement);
        this._reloadedScriptElement[srcFilename] = reloadedScriptElement;
      });

}
