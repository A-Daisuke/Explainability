function __method_wrapper__() {
        Vue.prototype._update = function (vnode, hydrating) {
            var vm = this;

            if (vm._isMounted) {
                //触发更新数据 触发生命周期函数
                callHook(vm, 'beforeUpdate');
            }

            //获取 vue 的el节点
            var prevEl = vm.$el;
            //vue 的标准 vnode
            var prevVnode = vm._vnode;  //标志上一个 vonde
            console.log(prevVnode)

            var prevActiveInstance = activeInstance;
            activeInstance = vm;
            vm._vnode = vnode; //标志上一个 vonde
            // Vue.prototype.__patch__ is injected in entry points 注入入口点
            // based on the rendering backend used. 基于所使用的呈现后端。
            if (!prevVnode) { //如果这个prevVnode不存在表示上一次没有创建过vnode，这个组件或者new Vue 是第一次进来
                // initial render    起始指令
                //创建dmo 虚拟dom
                console.log('vm.$el=')
                console.log(vm.$el)
                console.log(['vnode=', vnode])
                console.log(['hydrating=', hydrating])
                console.log(['vm.$options._parentElm=', vm.$options._parentElm])
                console.log(['vm.$options._refElm=', vm.$options._refElm])
                console.log('====vm.$el===')
                console.log(vm.$el)

                debugger;
                //更新虚拟dom
                vm.$el = vm.__patch__(
                    vm.$el, //真正的dom
                    vnode, //vnode
                    hydrating, // 空
                    false /* removeOnly */,
                    vm.$options._parentElm, //父节点 空
                    vm.$options._refElm //当前节点 空
                );
                console.log('=vm.$el=')
                console.log(vm.$el)
                // no need for the ref nodes after initial patch 初始补丁之后不需要ref节点
                // this prevents keeping a detached DOM tree in memory (#5851) 这可以防止在内存中保留分离的DOM树
                vm.$options._parentElm = vm.$options._refElm = null;
            } else { //如果这个prevVnode存在，表示vno的已经创建过，只是更新数据而已
                // updates 更新  上一个旧的节点prevVnode 更新虚拟dom
                vm.$el = vm.__patch__(prevVnode, vnode);
            }
            activeInstance = prevActiveInstance; //vue实例化的对象
            // update __vue__ reference 更新vue参考
            console.log('==prevEl==')
            console.log(prevEl)
            console.log(typeof prevEl)
            console.log(Object.prototype.toString.call(prevEl))
            console.log(vm);


            if (prevEl) {
                prevEl.__vue__ = null;
            }
            if (vm.$el) { //更新 __vue__
                vm.$el.__vue__ = vm;
            }
            // if parent is an HOC, update its $el as well
            //如果parent是一个HOC，那么也要更新它的$el
            if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
                vm.$parent.$el = vm.$el;
            }
            // updated hook is called by the scheduler to ensure that children are
            //调度器调用update hook以确保子节点是
            // updated in a parent's updated hook.
            //在父类的更新钩子中更新。
        };

}
