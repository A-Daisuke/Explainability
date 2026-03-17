function __method_wrapper__() {
    Vue.prototype.$mount = function (el, hydrating) { //重写Vue.prototype.$mount

        console.log('$mount 15835')
        debugger
        el = el && query(el); //获取dom
        /* istanbul ignore if */
        //如果el 是body 或者文档 则警告
        if (el === document.body || el === document.documentElement) {
            "development" !== 'production' && warn(
                "Do not mount Vue to <html> or <body> - mount to normal elements instead."
            );
            return this
        }
        //获取参数
        var options = this.$options;
        // resolve template/el and convert to render function
        //解析模板/el并转换为render函数
        if (!options.render) {
            //获取模板字符串
            var template = options.template;

            if (template) { //如果有模板

                if (typeof template === 'string') { //模板是字符串

                    //模板第一个字符串为# 则判断该字符串为 dom的id
                    if (template.charAt(0) === '#') {
                        console.log(template)

                        template = idToTemplate(template); //获取字符串模板的innerHtml
                        console.log(template)

                        /* istanbul ignore if */
                        if ("development" !== 'production' && !template) {
                            warn(
                                ("Template element not found or is empty: " + (options.template)),
                                this
                            );
                        }
                    }
                } else if (template.nodeType) { //如果template 是don节点 则获取他的html
                    template = template.innerHTML;
                } else {
                    //如果什么都是不是则发出警告
                    {
                        warn('invalid template option:' + template, this);
                    }
                    return this

                }
            } else if (el) {

                //如果模板没有，dom节点存在则获取dom节点中的html 给模板
                template = getOuterHTML(el);
                console.log(template)

            }
            if (template) {
                /* istanbul ignore if */
                //监听性能监测
                if ("development" !== 'production' && config.performance && mark) {
                    mark('compile');
                }
                //创建模板
                console.log('==options.comments==')
                console.log(options.comments)

                // render 函数 也是 ast转换 方法
                var ref = compileToFunctions(
                    template, //模板字符串
                    {
                        shouldDecodeNewlines: shouldDecodeNewlines, //flase //IE在属性值中编码换行，而其他浏览器则不会
                        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref, //true chrome在a[href]中编码内容
                        delimiters: options.delimiters, //改变纯文本插入分隔符。修改指令的书写风格，比如默认是{{mgs}}  delimiters: ['${', '}']之后变成这样 ${mgs}
                        comments: options.comments //当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
                    },
                    this
                );
                // res.render = createFunction(compiled.render, fnGenErrors);
                //获取编译函数 是将字符串转化成真正js的函数
                console.log('==ref.render==')
                console.log(ref.render)
                console.log(ref)
                console.log('==ref.render-end==')
                // res.render = createFunction(compiled.render, fnGenErrors);
                // //字符串转化js 创建一个集合函数
                // res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
                //     return createFunction(code, fnGenErrors)
                // });



                // ast: ast, //ast 模板
                //render: code.render, //code 虚拟dom需要渲染的参数函数
                //staticRenderFns: code.staticRenderFns  //空数组

                //这样赋值可以有效地 防止 引用按地址引用，造成数据修改而其他对象也修改问题，
                var render = ref.render;
                var staticRenderFns = ref.staticRenderFns;

                /*
                 render 是  虚拟dom，需要执行的编译函数 类似于这样的函数
                 (function anonymous( ) {
                      with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"info",rawName:"v-info"},{name:"data",rawName:"v-data"}],attrs:{"type":"text"}}),_v(" "),_m(0)])}
                   })
                 */
                options.render = render;
                options.staticRenderFns = staticRenderFns;
                console.log(options);
                console.log(options.render);

                /* istanbul ignore if */
                if ("development" !== 'production' && config.performance && mark) {
                    mark('compile end');
                    measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
                }
            }
        }
        console.log(render)
        console.log(el)
        console.log(hydrating)


        //执行$mount方法 一共执行了两次 第一次是在9000多行那一个  用$mount的方法把扩展挂载到dom上
        return mount.call(
            this,
            el, //真实的dom
            hydrating //undefined
        )
    };

}
