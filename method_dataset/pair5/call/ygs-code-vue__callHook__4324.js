    function callHook(vm,  //虚拟dom  vonde
        hook //钩子函数的key
    ) {
        // #7573 disable dep collection when invoking lifecycle hooks
        //调用生命周期钩子时禁用dep集合
        //Dep.target = _target; //存储
        pushTarget();
        //在vm 中添加声明周期函数
        var handlers = vm.$options[hook];
        console.log('hook=' + hook)
        console.log('vm.$options[hook]')
        console.log(vm.$options[hook])
        console.log('==handlers==')
        console.log(handlers)
        if (handlers) {  //数组
            for (var i = 0, j = handlers.length; i < j; i++) {
                try {
                    //执行生命周期函数
                    handlers[i].call(vm);
                } catch (e) {
                    handleError(e, vm, (hook + " hook"));
                }
            }
        }
        if (vm._hasHookEvent) {
            vm.$emit('hook:' + hook);
        }
        popTarget();
    }
