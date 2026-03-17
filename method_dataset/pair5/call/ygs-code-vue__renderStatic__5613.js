    function renderStatic(index, //索引
        isInFor //是否是for指令
    ) {
        var cached = this._staticTrees || (this._staticTrees = []); //静态数
        var tree = cached[index]; //获取单个数
        // if has already-rendered static tree and not inside v-for, 如果已经渲染的静态树不在v-for中，
        // we can reuse the same tree. 我们可以重用相同的树。
        if (tree && !isInFor) {
            return tree
        }
        // otherwise, render a fresh tree. 否则，渲染一个新的树。
        tree = cached[index] = this.$options.staticRenderFns[index].call(
            this._renderProxy,
            null,
            this // for render fns generated for functional component templates 用于为功能组件模板生成的呈现fns
        );
        //循环标志静态的vonde 虚拟dom
        markStatic(tree, ("__static__" + index), false);
        return tree
    }
