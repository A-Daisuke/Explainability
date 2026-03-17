function __method_wrapper__() {
    Watcher.prototype.get = function get() {
        //添加一个dep target
        pushTarget(this);
        var value;
        var vm = this.vm;
        try {
            console.log(this.getter)
            //获取值 如果报错 则执行catch
            value = this.getter.call(vm, vm);
            console.log(value)

        } catch (e) {
            if (this.user) {
                handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
            } else {
                throw e
            }
        } finally {
            // "touch" every property so they are all tracked as
            // dependencies for deep watching
            //“触摸”每个属性，以便它们都被跟踪为
            //依赖深度观察
            if (this.deep) {

                // //如果val 有__ob__ 属性
                // if (val.__ob__) {
                //     var depId = val.__ob__.dep.id;
                //     // seen 中是否含有depId 属性或者方法
                //     if (seen.has(depId)) {
                //         return
                //     }
                //     //如果没有则添加进去
                //     seen.add(depId);
                // }
                //为 seenObjects 深度收集val 中的key
                traverse(value);
            }
            // 出盏一个pushTarget
            popTarget();
            //清理依赖项集合。
            this.cleanupDeps();
        }
        //返回值
        return value
    };

}
