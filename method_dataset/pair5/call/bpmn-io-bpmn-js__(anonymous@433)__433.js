class __C__ {
  it('should render compensation marker centered', function() {
    var xml = require('../../fixtures/bpmn/draw/activity-markers-simple.bpmn');

    return bootstrapViewer(xml).call(this).then(function(result) {

      var err = result.error;

      expect(err).not.to.exist;

      inject(function(elementRegistry) {

        var task = elementRegistry.getGraphics('TaskCompensation');

        const marker = domQuery('[data-marker=compensation]', task);

        expectDistance(task, marker, { x: 0 });
      })();
    });
  });

}
