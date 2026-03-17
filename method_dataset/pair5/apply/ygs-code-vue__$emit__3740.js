function __method_wrapper__() {
        Vue.prototype.$emit = function (event) {
            var vm = this;
            {
                var lowerCaseEvent = event.toLowerCase(); //转成小写
                //如果事件转成小写之后并不相等以前字符串，并且是不存在_events 事件队列中
                if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                    //然后根据组件追踪发出一个警告
                    tip(
                        "Event \"" + lowerCaseEvent + "\" is emitted in component " +
                        (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
                        "Note that HTML attributes are case-insensitive and you cannot use " +
                        "v-on to listen to camelCase events when using in-DOM templates. " +
                        "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
                    );
                }
            }
            //获取事件值
            var cbs = vm._events[event];
            if (cbs) {
                //如果长度大于1 将它变成一个真正的数组
                cbs = cbs.length > 1 ? toArray(cbs) : cbs;
                //将参数变成一个真正数组
                var args = toArray(arguments, 1);
                //循环事件
                for (var i = 0, l = cbs.length; i < l; i++) {
                    try {
                        //执行触发事件
                        cbs[i].apply(vm, args);
                    } catch (e) {
                        //如果发生错误则发出报错警告
                        handleError(e, vm, ("event handler for \"" + event + "\""));
                    }
                }
            }
            return vm
        };

}
