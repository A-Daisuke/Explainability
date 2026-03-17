class __C__ {
  it('should render collapsed subprocess marker centered', function() {
    var xml = require('../../fixtures/bpmn/draw/activity-markers-simple.bpmn');

    return bootstrapViewer(xml).call(this).then(function(result) {

      var err = result.error;

      expect(err).not.to.exist;

      inject(function(elementRegistry) {

        var task = elementRegistry.getGraphics('SubProcessCollapsed');

        const marker = domQuery('[data-marker=sub-process]', task);

        expectDistance(task, marker, { x: 0 });
      })();
    });
  });

}
