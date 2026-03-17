function __method_wrapper__() {
            importAllOptions: function (options) {
                var finalOptions = angular.copy(ariaNgDefaultOptions);

                for (var key in options) {
                    if (!options.hasOwnProperty(key) || !finalOptions.hasOwnProperty(key)) {
                        continue;
                    }

                    if (angular.isObject(options[key]) || angular.isArray(options[key])) {
                        continue;
                    }

                    finalOptions[key] = options[key];
                }

                if (angular.isArray(options.extendRpcServers)) {
                    for (var i = 0; i < options.extendRpcServers.length; i++) {
                        var rpcSetting = options.extendRpcServers[i];
                        var finalRpcSetting = createNewRpcSetting();

                        for (var key in rpcSetting) {
                            if (!rpcSetting.hasOwnProperty(key) || !finalRpcSetting.hasOwnProperty(key)) {
                                continue;
                            }

                            if (angular.isObject(rpcSetting[key]) || angular.isArray(rpcSetting[key])) {
                                continue;
                            }

                            finalRpcSetting[key] = rpcSetting[key];
                        }

                        finalOptions.extendRpcServers.push(finalRpcSetting);
                    }
                }

                setOptions(finalOptions);
            },

}
