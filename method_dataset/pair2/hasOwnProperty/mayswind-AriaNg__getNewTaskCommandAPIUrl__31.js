                var getNewTaskCommandAPIUrl = function (task) {
                    var commandAPIUrl = getBaseUrl() + '#!/new/task?' +
                        'url=' + ariaNgCommonService.base64UrlEncode(task.urls[0]);

                    if (scope.context.pauseOnAdded) {
                        commandAPIUrl += '&pause=true';
                    }

                    if (task.options) {
                        for (var key in task.options) {
                            if (!task.options.hasOwnProperty(key)) {
                                continue;
                            }

                            commandAPIUrl += '&' + key + '=' + task.options[key];
                        }
                    }

                    return commandAPIUrl;
                };
