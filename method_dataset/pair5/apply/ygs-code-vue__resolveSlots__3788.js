    function resolveSlots(children,
        context) {
        var slots = {};
        //如果没有子节点 则返回一个空对象
        if (!children) {
            return slots
        }
        //循环子节点
        for (var i = 0, l = children.length; i < l; i++) {
            //获取单个子节点
            var child = children[i];
            //获取子节点数据
            var data = child.data;
            // remove slot attribute if the node is resolved as a Vue slot node
            //如果节点被解析为Vue槽节点，则删除slot属性 slot 分发式属性
            if (data && data.attrs && data.attrs.slot) {
                delete data.attrs.slot;
            }
            //只有在
            // named slots should only be respected if the vnode was rendered in the
            //如果在VN节点中呈现VNT，则只应命名命名槽。

            // same context.
            //同样的背景。
            //context 上下文
            if ((child.context === context || child.fnContext === context) &&
                data && data.slot != null
            ) {
                //如果有内容分发 插槽
                var name = data.slot;
                var slot = (slots[name] || (slots[name] = []));
                //child 有模板
                if (child.tag === 'template') {
                    //把子节点的 子节点 添加 到slot插槽中
                    slot.push.apply(slot, child.children || []);
                } else {
                    //把子节点 添加 到slot插槽中
                    slot.push(child);
                }
            } else {
                //
                (slots.default || (slots.default = [])).push(child);
            }
        }
        // ignore slots that contains only whitespace
        //忽略只包含空白的槽
        for (var name$1 in slots) {
            //删除空的插槽
            if (slots[name$1].every(isWhitespace)) {
                delete slots[name$1];
            }
        }
        return slots
    }
