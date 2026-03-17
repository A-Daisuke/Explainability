    function handleError(err, vm, info) {
        if (vm) {
            var cur = vm;
            //循环父组件
            while ((cur = cur.$parent)) {
                //如果hooks 存在 则循环 所有的hooks
                var hooks = cur.$options.errorCaptured;
                if (hooks) {
                    for (var i = 0; i < hooks.length; i++) {
                        try {
                            //调用hooks 中函数，如果发生错误则调用globalHandleError
                            var capture = hooks[i].call(cur, err, vm, info) === false;
                            if (capture) {
                                return
                            }
                        } catch (e) {
                            //调用全局日志输出
                            globalHandleError(e, cur, 'errorCaptured hook');
                        }
                    }
                }
            }
        }
        //调用全局日志输出
        globalHandleError(err, vm, info);
    }
