        function initComponent(
            vnode, //node 虚拟dom
            insertedVnodeQueue //插入Vnode队列 记录已经实例化过的组件
        ) {
            if (isDef(vnode.data.pendingInsert)) {  //模板缓存 待插入
                insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
                vnode.data.pendingInsert = null;
            }
            vnode.elm = vnode.componentInstance.$el; //组件实例
            if (isPatchable(vnode)) { //   判断组件是否定义有 tag标签
                //invokeCreateHooks，循环cbs.create 钩子函数，并且执行调用，其实cbs.create 钩子函数就是platformModules中的attrs中 updateAttrs更新属性函数。如果是组件则调用componentVNodeHooks中的 create
                invokeCreateHooks(vnode, insertedVnodeQueue);
                //为有作用域的CSS设置作用域id属性。
                //这是作为一种特殊情况来实现的，以避免开销
                //通过常规属性修补过程。
                setScope(vnode);
            } else {
                // empty component root.
                // skip all element-related modules except for ref (#3455)
                //空组件根。
                //跳过除ref(#3455)之外的所有与元素相关的模块
                //注册ref
                registerRef(vnode);
                // make sure to invoke the insert hook
                //确保调用插入钩子
                insertedVnodeQueue.push(vnode);
            }
        }
