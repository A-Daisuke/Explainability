function __method_wrapper__() {
      CallExpression(path, _ref4) {
        var filename = _ref4.file.opts.filename;

        var isPreval = looksLike(path, {
          node: {
            callee: {
              type: 'MemberExpression',
              object: { name: 'preval' },
              property: { name: 'require' },
            },
          },
        });
        if (!isPreval) {
          return;
        }

        var _path$get = path.get('arguments'),
          _path$get2 = _toArray(_path$get),
          source = _path$get2[0],
          args = _path$get2.slice(1);

        var argValues = args.map(function(a) {
          var result = a.evaluate();
          if (!result.confident) {
            throw new Error('preval cannot determine the value of an argument in preval.require');
          }
          return result.value;
        });
        var absolutePath = p.resolve(p.dirname(filename), source.node.value);
        try {
          // allow for transpilation of required modules
          require('@babel/register');
        } catch (e) {
          // ignore error
        }
        var mod = require(absolutePath);
        if (argValues.length) {
          if (typeof mod !== 'function') {
            throw new Error(
              `\`preval.require\`-ed module (${
                source.node.value
              }) cannot accept arguments because it does not export a function. You passed the arguments: ${argValues.join(
                ', ',
              )}`,
            );
          }
          mod = mod.apply(undefined, _toConsumableArray(argValues));
        }
        path.replaceWith(objectToAST(mod));
      },

}
