const __obj__ = {
            copyObjectTo: function (from, to) {
                if (!to) {
                    return from;
                }

                for (var name in from) {
                    if (!from.hasOwnProperty(name)) {
                        continue;
                    }

                    var fromValue = from[name];
                    var toValue = to[name];

                    if (angular.isObject(fromValue) || angular.isArray(fromValue)) {
                        to[name] = this.copyObjectTo(from[name], to[name]);
                    } else {
                        if (fromValue !== toValue) {
                            to[name] = fromValue;
                        }
                    }
                }

                return to;
            },

};
