function __method_wrapper__() {
    Object.keys(engines).forEach(function (ext) {
        var spec, module, args, engine;

        spec = engines[ext];
        const modulePath = tryResolve(spec.module);
        if (!modulePath) {
          throw new TypeError(`Module ${spec.module} not found`);
        }
        module = require(modulePath);

        if (thing.isObject(spec.renderer) && thing.isFunction(module[spec.renderer.method])) {
            args = Array.isArray(spec.renderer['arguments']) ? spec.renderer['arguments'].slice() : [];
            engine = module[spec.renderer.method].apply(null, args);

        } else if (thing.isString(spec.renderer) && thing.isFunction(module[spec.renderer])) {
            engine = module[spec.renderer];

        } else if (thing.isFunction(module[spec.name])) {
            engine = module[spec.name];

        } else if (thing.isFunction(module[ext])) {
            engine = module[ext];

        } else {
            engine = module;
        }

        app.engine(ext, engine);
    });

}
