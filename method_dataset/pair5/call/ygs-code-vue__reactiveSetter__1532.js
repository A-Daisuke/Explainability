function __method_wrapper__() {
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val;
                /* eslint-disable no-self-compare  新旧值比较 如果是一样则不执行了*/
                if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                }
                /* eslint-enable no-self-compare
                 *   不是生产环境的情况下
                 * */
                if ("development" !== 'production' && customSetter) {
                    customSetter();
                }
                if (setter) {
                    //set 方法 设置新的值
                    setter.call(obj, newVal);
                } else {
                    //新的值直接给他
                    val = newVal;
                }
                console.log(newVal)

                //observe 添加 观察者
                childOb = !shallow && observe(newVal);
                //更新数据
                dep.notify();
            }

}
