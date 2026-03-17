function __method_wrapper__() {
        def(arrayMethods, method, function mutator() {
            console.log('==def_original==')
            console.log(original)

            var args = [], len = arguments.length;
            while (len--) args[len] = arguments[len];

            var result = original.apply(this, args);
            var ob = this.__ob__;
            console.log('this.__ob__')
            console.log(this.__ob__)


            var inserted;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args;
                    break
                case 'splice':
                    inserted = args.slice(2);
                    break
            }
            if (inserted) {
                //观察数组数据
                ob.observeArray(inserted);
            }
            // notify change
            //更新通知
            ob.dep.notify();
            console.log('====result====')
            console.log(result)
            return result
        });

}
