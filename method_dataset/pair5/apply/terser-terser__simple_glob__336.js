    function simple_glob(glob) {
        if (Array.isArray(glob)) {
            return [].concat.apply([], glob.map(simple_glob));
        }
        if (glob && glob.match(/[*?]/)) {
            var dir = path.dirname(glob);
            try {
                var entries = fs.readdirSync(dir);
            } catch (ex) {}
            if (entries) {
                var pattern = "^" + path.basename(glob)
                    .replace(/[.+^$[\]\\(){}]/g, "\\$&")
                    .replace(/\*/g, "[^/\\\\]*")
                    .replace(/\?/g, "[^/\\\\]") + "$";
                var mod = process.platform === "win32" ? "i" : "";
                var rx = new RegExp(pattern, mod);
                var results = entries.filter(function(name) {
                    return rx.test(name);
                }).map(function(name) {
                    return path.join(dir, name);
                });
                if (results.length) return results;
            }
        }
        return [ glob ];
    }
