            function compile(
                template,  //字符串模板
                options //options 参数
            ) {
                console.log(options)


                //template 模板  options 参数
                // 创建一个对象 拷贝baseOptions 拷贝到 原型 protype 中
                var finalOptions = Object.create(baseOptions); //为虚拟dom添加基本需要的属性
                console.log(finalOptions)
                console.log(finalOptions.__proto__)
                console.log(finalOptions.property)

                var errors = [];
                var tips = [];
                //声明警告函数
                finalOptions.warn = function (msg, tip) {
                    (tip ? tips : errors).push(msg);
                };

                if (options) {
                    console.log(options)

                    // merge custom modules
                    //baseOptions中的modules参数为
                    // modules=modules$1=[
                    //     {       // class 转换函数
                    //         staticKeys: ['staticClass'],
                    //         transformNode: transformNode,
                    //         genData: genData
                    //     },
                    //     {  //style 转换函数
                    //         staticKeys: ['staticStyle'],
                    //         transformNode: transformNode$1,
                    //         genData: genData$1
                    //     },
                    //     {
                    //         preTransformNode: preTransformNode
                    //     }
                    // ]



                    if (options.modules) { //
                        finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
                    }
                    // merge custom directives 合并定制指令
                    if (options.directives) {
                        finalOptions.directives = extend(Object.create(baseOptions.directives || null), options.directives);
                    }
                    console.log(options)

                    // options 为：

                    // comments: undefined
                    // delimiters: undefined
                    // shouldDecodeNewlines: false
                    // shouldDecodeNewlinesForHref: true

                    // copy other options 复制其他选项
                    for (var key in options) {
                        if (key !== 'modules' && key !== 'directives') {
                            //浅拷贝
                            finalOptions[key] = options[key];
                        }
                    }
                }
                //参数传进来的函数
                //template 模板
                //finalOptions 基本参数
                var compiled = baseCompile(
                    template, //template 模板
                    finalOptions  //finalOptions 基本参数  为虚拟dom添加基本需要的属性
                );


                {
                    errors.push.apply(errors, detectErrors(compiled.ast));
                }
                compiled.errors = errors;
                compiled.tips = tips;
                return compiled
            }
