class __C__ {
  it('should render ad-hoc marker centered on expanded subprocess', function() {
    var xml = require('../../fixtures/bpmn/draw/activity-markers-simple.bpmn');

    return bootstrapViewer(xml).call(this).then(function(result) {

      var err = result.error;

      expect(err).not.to.exist;

      inject(function(elementRegistry) {

        var task = elementRegistry.getGraphics('AdHocSubProcessExpanded');

        const marker = domQuery('[data-marker=adhoc]', task);

        expectDistance(task, marker, { x: 0 });
      })();
    });
  });

}
