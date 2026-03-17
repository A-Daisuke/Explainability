function __method_wrapper__() {
            get: function reactiveGetter() {

                var value = getter ? getter.call(obj) : val;
                if (Dep.target) {  //Dep.target 静态标志 标志了Dep添加了Watcher 实例化的对象
                    //添加一个dep
                    dep.depend();
                    if (childOb) {  //如果子节点存在也添加一个dep
                        childOb.dep.depend();
                        if (Array.isArray(value)) {  //判断是否是数组 如果是数组
                            dependArray(value);   //则数组也添加dep
                        }
                    }
                }
                return value
            },

}
