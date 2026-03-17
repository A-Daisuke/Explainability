function __method_wrapper__() {
        Vue.use = function (plugin) {
            var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
            //
            if (installedPlugins.indexOf(plugin) > -1) { //判断是否已经安装过插件了

                return this
            }

            // additional parameters//额外的参数
            var args = toArray(arguments, 1);  //变成真的数组
            args.unshift(this); //在前面添加
            if (typeof plugin.install === 'function') { //如果plugin.install 是个函数 则执行安装
                plugin.install.apply(plugin, args);
            } else if (typeof plugin === 'function') { //如果plugin 是个函数则安装
                plugin.apply(null, args);
            }
            installedPlugins.push(plugin); // 将已经安装过的插件添加到队列去
            return this
        };

}
