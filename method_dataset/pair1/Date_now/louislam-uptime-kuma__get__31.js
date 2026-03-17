function __method_wrapper__() {
    static async get(key) {

        // Start cache clear if not started yet
        if (!Settings.cacheCleaner) {
            Settings.cacheCleaner = setInterval(() => {
                log.debug("settings", "Cache Cleaner is just started.");
                for (key in Settings.cacheList) {
                    if (Date.now() - Settings.cacheList[key].timestamp > 60 * 1000) {
                        log.debug("settings", "Cache Cleaner deleted: " + key);
                        delete Settings.cacheList[key];
                    }
                }

            }, 60 * 1000);
        }

        // Query from cache
        if (key in Settings.cacheList) {
            const v = Settings.cacheList[key].value;
            log.debug("settings", `Get Setting (cache): ${key}: ${v}`);
            return v;
        }

        let value = await R.getCell("SELECT `value` FROM setting WHERE `key` = ? ", [
            key,
        ]);

        try {
            const v = JSON.parse(value);
            log.debug("settings", `Get Setting: ${key}: ${v}`);

            Settings.cacheList[key] = {
                value: v,
                timestamp: Date.now()
            };

            return v;
        } catch (e) {
            return value;
        }
    }

}
