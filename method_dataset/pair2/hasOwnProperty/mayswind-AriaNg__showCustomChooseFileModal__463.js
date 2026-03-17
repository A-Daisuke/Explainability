function __method_wrapper__() {
        $scope.showCustomChooseFileModal = function () {
            if (!$scope.task || !$scope.task.files) {
                return;
            }

            var files = $scope.task.files;
            var extensionsMap = {};

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                if (file.isDir) {
                    continue;
                }

                var extension = ariaNgCommonService.getFileExtension(file.fileName);

                if (extension) {
                    extension = extension.toLowerCase();
                }

                var extensionInfo = extensionsMap[extension];

                if (!extensionInfo) {
                    var extensionName = extension;

                    if (extensionName.length > 0 && extensionName.charAt(0) === '.') {
                        extensionName = extensionName.substring(1);
                    }

                    extensionInfo = {
                        extension: extensionName,
                        classified: false,
                        selected: false,
                        selectedCount: 0,
                        unSelectedCount: 0
                    };

                    extensionsMap[extension] = extensionInfo;
                }

                if (file.selected) {
                    extensionInfo.selected = true;
                    extensionInfo.selectedCount++;
                } else {
                    extensionInfo.unSelectedCount++;
                }
            }

            var allClassifiedExtensions = {};

            for (var type in ariaNgFileTypes) {
                if (!ariaNgFileTypes.hasOwnProperty(type)) {
                    continue;
                }

                var extensionTypeName = ariaNgFileTypes[type].name;
                var allExtensions = ariaNgFileTypes[type].extensions;
                var extensions = [];

                for (var i = 0; i < allExtensions.length; i++) {
                    var extension = allExtensions[i];
                    var extensionInfo = extensionsMap[extension];

                    if (extensionInfo) {
                        extensionInfo.classified = true;
                        extensions.push(extensionInfo);
                    }
                }

                if (extensions.length > 0) {
                    allClassifiedExtensions[type] = {
                        name: extensionTypeName,
                        extensions: extensions
                    };
                }
            }

            var unClassifiedExtensions = [];

            for (var extension in extensionsMap) {
                if (!extensionsMap.hasOwnProperty(extension)) {
                    continue;
                }

                var extensionInfo = extensionsMap[extension];

                if (!extensionInfo.classified) {
                    unClassifiedExtensions.push(extensionInfo);
                }
            }

            if (unClassifiedExtensions.length > 0) {
                allClassifiedExtensions.other = {
                    name: 'Other',
                    extensions: unClassifiedExtensions
                };
            }

            $scope.context.fileExtensions = allClassifiedExtensions;
            angular.element('#custom-choose-file-modal').modal();
        };

}
