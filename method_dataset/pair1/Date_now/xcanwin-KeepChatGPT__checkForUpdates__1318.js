    const checkForUpdates = function(action = "click") {
        const downloadURL = `https://raw.githubusercontent.com/xcanwin/KeepChatGPT/main/KeepChatGPT.user.js`;
        const updateURL = downloadURL;
        GM_xmlhttpRequest({
            method: "GET",
            url: `${updateURL}?t=${Date.now()}`,
            onload: function(response) {
                const crv = GM_info.script.version;
                const m = response.responseText.match(/@version\s+(\S+)/);
                const ltv = m && m[1];
                if (ltv && verInt(ltv) > verInt(crv)) {
                    ndialog(`${tl("检查更新")}`, `${tl("当前版本")}: ${crv}, ${tl("发现最新版")}: ${ltv}`, `UPDATE`, function(t) {
                        window.open(`${downloadURL}?t=${Date.now()}`, '_blank');
                    });
                } else {
                    if (action === "click") {
                        ndialog(`${tl("检查更新")}`, `${tl("当前版本")}: ${crv}, ${tl("已是最新版")}`, `OK`);
                    }
                }
            }
        });
    };
