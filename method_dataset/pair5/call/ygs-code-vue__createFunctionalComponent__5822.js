    function createFunctionalComponent(
        Ctor, //组件构造函数VueComponent
        propsData, //组件props数据
        data,  //  组件属性 数据
        contextVm, //vm  vue实例化对象
        children //组件子节点
    ) {
        console.log('==Ctor==')
        console.log(Ctor)
        console.log('==propsData==')
        console.log(propsData)
        console.log('==data==')
        console.log(data)
        console.log('==contextVm==')
        console.log(contextVm)
        console.log('==children==')
        console.log(children)



        var options = Ctor.options; //获取拓展参数
        var props = {};
        var propOptions = options.props; //获取props 参数 就是组建 定义的props 类型数据
        console.log('==options.props==')
        console.log(options.props)

        if (isDef(propOptions)) { //如果定义了props 参数
            for (var key in propOptions) { //循环 propOptions 参数

                /*
                    验证支柱  验证 prosp 是否是规范数据 并且为props 添加 value.__ob__  属性，把prosp添加到观察者中
                     *  校验 props 参数 就是组建 定义的props 类型数据，校验类型
                     *
                     * 判断prop.type的类型是不是Boolean或者String，如果不是他们两类型，调用getPropDefaultValue获取默认值并且把value添加到观察者模式中
                     */
                props[key] = validateProp(
                    key,  //key
                    propOptions, //原始props 参数
                    propsData || emptyObject  // 转义过的组件props数据
                );
            }
        } else {
            if (isDef(data.attrs)) {  //如果定义有属性
                // 前拷贝合并 props属性 并且把 from 的key 由 - 写法变成 驼峰的写法。
                mergeProps(props, data.attrs); //合并props 和 属性
            }
            if (isDef(data.props)) { //如果data定义有props 合并props
                mergeProps(props, data.props);
            }
        }
        //  Ctor,
        // propsData, //组件props数据
        // data,  // vonde 虚拟dom的数据
        // contextVm, //上下文this Vm
        // children //子节点
        console.log(Ctor)
        // Ctor = function VueComponent(options) {
        //     this._init(options);
        // }
        //
        //返回
        var renderContext = new FunctionalRenderContext(  //实例化一个对象
            data,// vonde 虚拟dom的数据
            props, //props 属性
            children, //子节点
            contextVm, //vm
            Ctor  //VueComponent 构造函数
        );

        // children : undefined
        // data : Object
        // injections :  undefined
        // listeners  : Object
        // parent :  Vue
        // props :  Object
        // slots : function ()
        // _c: function (a, b, c, d)
        // __proto__:  Object
        console.log('==renderContext==')
        console.log(renderContext)

        //创建 vnode
        var vnode = options.render.call(null, renderContext._c, renderContext);

        if (vnode instanceof VNode) { //如果 vnode 的构造函数是VNode

            //克隆并标记函数结果
            return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
        } else if (Array.isArray(vnode)) { //如果vnode 是数组

            //normalizeArrayChildren 创建一个规范的子节点 vonde
            var vnodes = normalizeChildren(vnode) || [];
            var res = new Array(vnodes.length); // 创建一个空数组
            for (var i = 0; i < vnodes.length; i++) {
                //克隆并标记函数结果 静态 节点
                res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
            }
            return res
        }
    }
