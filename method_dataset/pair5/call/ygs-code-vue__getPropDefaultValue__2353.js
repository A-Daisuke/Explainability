    function getPropDefaultValue(vm, prop, key) {
        // no default, return undefined
        //判断该对象prop 中的default 是否是prop 实例化的
        if (!hasOwn(prop, 'default')) {
            return undefined
        }
        var def = prop.default;
        // warn against non-factory defaults for Object & Array
        //警告对象和数组的非工厂默认值
        if ("development" !== 'production' && isObject(def)) {
            warn(
                'Invalid default value for prop "' + key + '": ' +
                'Props with type Object/Array must use a factory function ' +
                'to return the default value.',
                vm
            );
        }
        // the raw prop value was also undefined from previous render,
        //原始PROP值也未从先前的渲染中定义，
        // return previous default value to avoid unnecessary watcher trigger
        //返回先前的默认值以避免不必要的监视触发器
        if (vm && vm.$options.propsData &&
            vm.$options.propsData[key] === undefined &&
            vm._props[key] !== undefined
        ) {
            return vm._props[key]
        }
        // call factory function for non-Function types
        //非功能类型调用工厂函数
        // a value is Function if its prototype is function even across different execution context
        //一个值是函数，即使它的原型在不同的执行上下文中也是函数。
        //getType检查函数是否是函数声明  如果是函数表达式或者匿名函数是匹配不上的
        //判断def 是不是函数 如果是则执行，如果不是则返回props的PropDefaultValue
        return typeof def === 'function' && getType(prop.type) !== 'Function'
            ? def.call(vm)
            : def
    }
