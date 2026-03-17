function __method_wrapper__() {
        Vue.prototype.$watch = function (expOrFn, //用户手动监听
            cb, // 监听 变化之后 回调函数
            options //参数
        ) {
            var vm = this;
            if (isPlainObject(cb)) { //判断是否是对象 如果是对象则递归 深层 监听 直到它不是一个对象的时候才会跳出递归
                //    转义handler 并且为数据 创建 Watcher 观察者
                return createWatcher(
                    vm,
                    expOrFn,
                    cb,
                    options
                )
            }
            options = options || {};
            options.user = true; //用户手动监听， 就是在 options 自定义的 watch
            console.log(expOrFn)

            //实例化Watcher 观察者
            var watcher = new Watcher(
                vm, //vm  vode
                expOrFn,  //函数 手动
                cb, //回调函数
                options  //参数
            );
            if (options.immediate) {
                //回调触发函数
                cb.call(vm, watcher.value);
            }
            return function unwatchFn() { //卸载观察者
                //从所有依赖项的订阅方列表中删除self。
                watcher.teardown();
            }
        };

}
