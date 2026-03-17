function __method_wrapper__() {
BaseViewer.prototype._init = function(container, moddle, options) {

  const baseModules = options.modules || this.getModules(options),
        additionalModules = options.additionalModules || [],
        staticModules = [
          {
            bpmnjs: [ 'value', this ],
            moddle: [ 'value', moddle ]
          }
        ];

  const diagramModules = [].concat(staticModules, baseModules, additionalModules);

  const diagramOptions = assign(omit(options, [ 'additionalModules' ]), {
    canvas: assign({}, options.canvas, { container: container }),
    modules: diagramModules
  });

  // invoke diagram constructor
  Diagram.call(this, diagramOptions);

  if (options && options.container) {
    this.attachTo(options.container);
  }
};

}
