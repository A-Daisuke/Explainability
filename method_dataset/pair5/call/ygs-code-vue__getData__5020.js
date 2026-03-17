    function getData(data, vm) {
        // #7573 disable dep collection when invoking data getters
        //调用数据getter时禁用dep收集
        pushTarget();
        try {
            //执行函数 获取数据
            return data.call(vm, vm)
        } catch (e) {
            //收集错误信息
            handleError(e, vm, "data()");
            return {}
        } finally {
            //调用数据getter时禁用dep收集
            popTarget();
        }
    }
