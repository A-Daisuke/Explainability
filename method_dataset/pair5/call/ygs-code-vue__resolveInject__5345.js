    function resolveInject(inject, vm) {

        if (inject) {
            // inject is :any because flow is not smart enough to figure out cached
            // inject是:any，因为flow不够智能，无法计算缓存
            var result = Object.create(null);
            var keys = hasSymbol ?  //判断是否支持Symbol 数据类型
                Reflect.ownKeys(inject).filter(function (key) {
                    //Object.getOwnPropertyDescriptor 查看描述对象 并且获取到enumerable 为true 的时候才会获取到该数组
                    return Object.getOwnPropertyDescriptor(inject, key).enumerable
                }) :
                Object.keys(inject); //如果不支持hasSymbol 则降级用 Object.keys

            // 将数组转化成对象 比如 [1,2,3]转化成
            // * normalized[1]={from: 1}
            for (var i = 0; i < keys.length; i++) { //循环key
                var key = keys[i];  //获取单个key值
                var provideKey = inject[key].from; //normalized[3]={from: 3} 获取key的值
                var source = vm;
                while (source) {
                    if (source._provided && hasOwn(source._provided, provideKey)) { //判断_provided 存在么 并且是对象的时候，并且实例化属性provideKey 存在
                        result[key] = source._provided[provideKey]; //获取值 存起来
                        break
                    }
                    source = source.$parent; //循环父节点
                }
                if (!source) {  //如果vm 不存在
                    if ('default' in inject[key]) { // 判断default key存在inject[key]中么
                        var provideDefault = inject[key].default; //如果存在则获取默认default的值
                        result[key] = typeof provideDefault === 'function' //如果是函数则执行
                            ? provideDefault.call(vm)
                            : provideDefault;
                    } else {
                        warn(("Injection \"" + key + "\" not found"), vm);
                    }
                }
            }
            return result
        }
    }
