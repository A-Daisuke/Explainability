function __method_wrapper__() {
            ProjectService.prototype.loadTypesMap = function () {
                try {
                    var fileContent = this.host.readFile(this.typesMapLocation); // TODO: GH#18217
                    if (fileContent === undefined) {
                        this.logger.info("Provided types map file \"" + this.typesMapLocation + "\" doesn't exist");
                        return;
                    }
                    var raw = JSON.parse(fileContent);
                    // Parse the regexps
                    for (var _i = 0, _a = Object.keys(raw.typesMap); _i < _a.length; _i++) {
                        var k = _a[_i];
                        raw.typesMap[k].match = new RegExp(raw.typesMap[k].match, "i");
                    }
                    // raw is now fixed and ready
                    this.safelist = raw.typesMap;
                    for (var key in raw.simpleMap) {
                        if (raw.simpleMap.hasOwnProperty(key)) {
                            this.legacySafelist.set(key, raw.simpleMap[key].toLowerCase());
                        }
                    }
                }
                catch (e) {
                    this.logger.info("Error loading types map: " + e);
                    this.safelist = defaultTypeSafeList;
                    this.legacySafelist.clear();
                }
            };

}
