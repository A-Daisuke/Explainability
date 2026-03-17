function __method_wrapper__() {
    Watcher.prototype.run = function run() {
        if (this.active) { //活跃
            var value = this.get(); //获取值 函数 expOrFn
            if (
                value !== this.value ||  //如果值不相等
                // Deep watchers and watchers on Object/Arrays should fire even 深度观察和对象/数组上的观察应该是均匀的
                // when the value is the same, because the value may 当值相等时，因为值可以
                // have mutated. 有突变。
                isObject(value) || //或者值的object
                this.deep  //获取deep为true
            ) {
                // set new value
                var oldValue = this.value; //获取旧的值
                this.value = value; //新的值赋值
                if (this.user) { //如果是user 用更新值
                    try {
                        this.cb.call(this.vm, value, oldValue); //更新回调函数  获取到新的值 和旧的值
                    } catch (e) {
                        handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue);//更新回调函数  获取到新的值 和旧的值
                }
            }
        }
    };

}
