    const setUserOptions = function() {
        if (gv("k_showDebug", false) === true) {
            $('#nmenuid_sd .checkbutton').classList.add('checked');
            $('#xcanwin').style.display = '';
        } else {
            $('#xcanwin').style.display = 'none';
        }

        if (gv("k_theme", "light") === "dark") {
            $('#nmenuid_dm .checkbutton').classList.add('checked');
            $('body').classList.add("kdark");
        }

        if (gv("k_closeModer", false) === true) {
            $('#nmenuid_cm .checkbutton').classList.add('checked');
        }

        if (gv("k_keenObservation", true) === true) {
            $('#nmenuid_ko .checkbutton').classList.add('checked');
            $('body').classList.add("kkeenobservation");
        }

        if (gv("k_clonechat", false) === true) {
            $('#nmenuid_cc .checkbutton').classList.add('checked');
            cloneChat(true);
        }

        if (gv("k_cleanlyhome", false) === true) {
            $('#nmenuid_pp .checkbutton').classList.add('checked');
            purifyPage();
            $('body').classList.add("kpurifypage");
        }

        if (gv("k_largescreen", false) === true) {
            $('#nmenuid_ls .checkbutton').classList.add('checked');
            $("main.w-full").classList.add('largescreen');
        }

        if (gv("k_speakcompletely", false) === true) {
            $('#nmenuid_sc .checkbutton').classList.add('checked');
        }

        if (gv("k_intercepttracking", false) === true) {
            $('#nmenuid_it .checkbutton').classList.add('checked');
            interceptTracking(true);
        }

        if (gv("k_everchanging", false) === true) {
            $('#nmenuid_ec .checkbutton').classList.add('checked');
            everChanging(true);
        }

        //检查更新：首次、每3天
        if (gv("k_lastupdate", 0) === 0 || Date.now() - gv("k_lastupdate", 0) >= 1000 * 60 * 60 * 24 * 3) {
            sv("k_lastupdate", Date.now());
            checkForUpdates("auto");
        }

        if (gv("k_last_support_author", 0) === 0 || Date.now() - gv("k_last_support_author", 0) >= 1000 * 60 * 60 * 24 * 30) {
            sv("k_last_support_author", Date.now());
            supportAuthor();
        }
    };
