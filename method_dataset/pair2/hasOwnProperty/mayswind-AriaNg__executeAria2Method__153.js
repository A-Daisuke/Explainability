function __method_wrapper__() {
        $scope.executeAria2Method = function () {
            if (!$scope.context.rpcRequestMethod || $scope.context.rpcRequestMethod.indexOf('.') < 0) {
                ariaNgCommonService.showError('RPC method is illegal!');
                return;
            }

            var methodNameParts = $scope.context.rpcRequestMethod.split('.');

            if (methodNameParts.length !== 2) {
                ariaNgCommonService.showError('RPC method is illegal!');
                return;
            }

            var methodName = methodNameParts[1];

            if (!angular.isFunction(aria2RpcService[methodName])) {
                ariaNgCommonService.showError('AriaNg does not support this RPC method!');
                return;
            }

            var context = {
                silent: false,
                callback: function (response) {
                    if (response) {
                        $scope.context.rpcResponse = $filter('json')(response.data);
                    } else {
                        $scope.context.rpcResponse = $filter('json')(response);
                    }
                }
            };

            var parameters = {};

            try {
                parameters = angular.fromJson($scope.context.rpcRequestParameters);
            } catch (ex) {
                ariaNgLogService.error('[AriaNgDebugController.executeAria2Method] failed to parse request parameters: ' + $scope.context.rpcRequestParameters, ex);
                ariaNgCommonService.showError('RPC request parameters are invalid!');
                return;
            }

            for (var key in parameters) {
                if (!parameters.hasOwnProperty(key) || key === 'silent' || key === 'callback') {
                    continue;
                }

                context[key] = parameters[key];
            }

            return aria2RpcService[methodName](context);
        };

}
