        var buildRequestOptions = function (originalOptions, context) {
            var options = angular.copy(originalOptions);

            for (var optionName in options) {
                if (!options.hasOwnProperty(optionName)) {
                    continue;
                }

                if (isOptionSubmitArray(options, optionName)) {
                    options[optionName] = buildArrayOption(options[optionName], aria2AllOptions[optionName]);
                }
            }

            if (context && context.pauseOnAdded) {
                options.pause = 'true';
            }

            return options;
        };
