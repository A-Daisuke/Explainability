        function invoker() {
            //获取传进来的参数，是一个数组
            var arguments$1 = arguments;

            //静态方法传进来的函数 赋值给fns
            var fns = invoker.fns;

            //判断fns 是否是一个数组
            if (Array.isArray(fns)) {
                //如果是数组 浅拷贝
                var cloned = fns.slice();
                //执行fns 数组中的函数 并且把 invoker  arguments$1参数一个个传给fns 函数中
                for (var i = 0; i < cloned.length; i++) {

                    cloned[i].apply(null, arguments$1);
                }
            } else {
                // return handler return value for single handlers
                //如果fns 不是数组函数，而是一个函数 则执行arguments$1参数一个个传给fns 函数中
                return fns.apply(null, arguments)
            }
        }
