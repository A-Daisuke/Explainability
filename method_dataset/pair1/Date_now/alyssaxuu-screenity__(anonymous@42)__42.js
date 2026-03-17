function __method_wrapper__() {
      chrome.storage.local.get(["token"], async (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError));
        } else {
          const token = result.token;
          if (!token || token === null) {
            // Token is not set, trigger sign-in
            const newToken = await signIn();
            if (!newToken || newToken === null) {
              // Sign-in failed, throw an error
              reject(new Error("Sign-in failed"));
            }
            resolve(newToken);
          } else {
            // Token is set, check if it has expired
            let payload;
            try {
              payload = JSON.parse(atob(token.split(".")[1]));
            } catch (err) {
              // Token is invalid, refresh it
              chrome.identity.getAuthToken(
                { interactive: true },
                (newToken) => {
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError));
                  } else {
                    resolve(newToken);
                  }
                }
              );
              return;
            }

            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            const currentTime = Date.now();
            if (currentTime >= expirationTime) {
              // Token has expired, refresh it
              chrome.identity.getAuthToken(
                { interactive: true },
                (newToken) => {
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError));
                  } else {
                    resolve(newToken);
                  }
                }
              );
            } else {
              // Token is still valid
              resolve(token);
            }
          }
        }
      });

}
