function __method_wrapper__() {
        _cookie => {
          // 默认不对已存在相同的name的内容进行更新
          let allowSet = false;
          const now = new Date().getTime() / 1000;

          // 如果当前站点没有这个Cookies，则允许设置
          if (_cookie === null) {
            allowSet = true;
          } else if (
            // 如果站点存在这个Cookies，但已过期，允许设置
            _cookie.expirationDate &&
            _cookie.expirationDate < now
          ) {
            allowSet = true;
          }

          if (allowSet) {
            // 如果要导入的内容已过期，尝试按当天日期增加一天
            if (cookie.expirationDate && cookie.expirationDate < now) {
              cookie.expirationDate = now + 60 * 60 * 24;
            }

            chrome.cookies.set(cookie, result => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
                return;
              }
              resolve(result);
              console.log(result);
            });
          } else {
            console.log("跳过 %s: %s", host, cookie.name);
            resolve();
          }
        }

}
