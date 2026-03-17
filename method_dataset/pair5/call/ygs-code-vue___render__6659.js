function __method_wrapper__() {
        Vue.prototype._render = function () {
            var vm = this;
            //获取vm参数
            var ref = vm.$options;
            /*
             render 是  虚拟dom，需要执行的编译函数 类似于这样的函数
             (function anonymous( ) {
                   with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"info",rawName:"v-info"},{name:"data",rawName:"v-data"}],attrs:{"type":"text"}}),_v(" "),_m(0)])}
             })
             */
            var render = ref.render;
            var _parentVnode = ref._parentVnode;

            // reset _rendered flag on slots for duplicate slot check
            //重置槽上的_render标记，以检查重复槽
            {
                for (var key in vm.$slots) {
                    // $flow-disable-line
                    //标志位
                    vm.$slots[key]._rendered = false;
                }
            }

            if (_parentVnode) {  //判断是否有parentVnode
                // data.scopedSlots = {default: children[0]};  //获取插槽
                vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
            }

            // set parent vnode. this allows render functions to have access
            //设置父vnode。这允许呈现函数具有访问权限
            // to the data on the placeholder node.
            //到占位符节点上的数据。

            //把父层的Vnode 赋值的到$vnode
            vm.$vnode = _parentVnode;
            // render self
            var vnode;
            try {
                //创建一个空的组件
                // vm.$options.render = createEmptyVNode;
                //_renderProxy 代理拦截
                /*
                 render 是  虚拟dom，需要执行的编译函数 类似于这样的函数
                 (function anonymous(
                 ) {

                      with(this){return _c('div',{attrs:{"id":"app"}},[_c('input',{directives:[{name:"info",rawName:"v-info"},{name:"data",rawName:"v-data"}],attrs:{"type":"text"}}),_v(" "),_m(0),_v(" "),_c('div',[_v("\n        "+_s(message)+"\n    ")])])}
                 })
                 */

                vnode = render.call(
                    vm._renderProxy, //this指向 其实就是vm
                    vm.$createElement //这里虽然传参进去但是没有接收参数
                );
                console.log(vnode)


            } catch (e) { //收集错误信息 并抛出
                handleError(e, vm, "render");
                // return error render result,
                // or previous vnode to prevent render error causing blank component
                //返回错误渲染结果，
                //或以前的vnode，以防止渲染错误导致空白组件
                /* istanbul ignore else */
                {
                    if (vm.$options.renderError) {
                        try {
                            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                        } catch (e) {
                            handleError(e, vm, "renderError");
                            vnode = vm._vnode;
                        }
                    } else {
                        vnode = vm._vnode;
                    }
                }
            }
            // return empty vnode in case the render function errored out 如果呈现函数出错，返回空的vnode
            if (!(vnode instanceof VNode)) {
                if ("development" !== 'production' && Array.isArray(vnode)) {
                    warn(
                        'Multiple root nodes returned from render function. Render function ' +
                        'should return a single root node.',
                        vm
                    );
                }
                //创建一个节点 为注释节点 空的vnode
                vnode = createEmptyVNode();
            }
            // set parent
            vnode.parent = _parentVnode; //设置父vnode
            return vnode
        };

}
