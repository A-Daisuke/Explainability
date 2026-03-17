        var doNewTaskCommand = function (url, params) {
            try {
                url = ariaNgCommonService.base64UrlDecode(url);
            } catch (ex) {
                ariaNgCommonService.showError('URL is not base64 encoded!');
                return false;
            }

            var options = {};
            var isPaused = false;

            if (params) {
                for (var key in params) {
                    if (!params.hasOwnProperty(key)) {
                        continue;
                    }

                    if (aria2SettingService.isOptionKeyValid(key)) {
                        options[key] = params[key];
                    }
                }

                if (params.pause === 'true') {
                    isPaused = true;
                }
            }

            $rootScope.loadPromise = aria2TaskService.newUriTask({
                urls: [url],
                options: options
            }, isPaused, function (response) {
                if (!response.success) {
                    return false;
                }

                if (isPaused) {
                    $location.path('/waiting');
                } else {
                    $location.path('/downloading');
                }
            });

            ariaNgLogService.info('[CommandController] new download: ' + url);

            return true;
        };
