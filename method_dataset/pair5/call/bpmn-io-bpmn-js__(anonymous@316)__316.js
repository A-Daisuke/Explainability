class __C__ {
  it('should render call activity', function() {
    var xml = require('../../fixtures/bpmn/draw/call-activity.bpmn');

    return bootstrapViewer(xml).call(this).then(function(result) {

      var err = result.error;

      expect(err).not.to.exist;

      inject(function(elementRegistry) {

        var callActivityGfx = elementRegistry.getGraphics('CallActivity');

        // make sure the + marker is shown
        expect(domQuery('[data-marker=sub-process]', callActivityGfx)).to.exist;
      })();
    });

  });

}
