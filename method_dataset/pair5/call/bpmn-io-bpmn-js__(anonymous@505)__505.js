class __C__ {
  it('should render sequenceFlows without source', function() {

    var xml = require('./BpmnRenderer.sequenceFlow-no-source.bpmn');
    return bootstrapModeler(xml, {
      modules: [
        coreModule,
        rendererModule,
        modelingModule
      ]
    }).call(this).then(function(result) {

      var err = result.error;

      expect(err).not.to.exist;

      inject(function(elementFactory, graphicsFactory) {

        // given
        var g = svgCreate('g');

        var connection = elementFactory.create('connection', {
          type: 'bpmn:SequenceFlow',
          waypoints: [
            { x: 0, y: 0 },
            { x: 10, y: 100 }
          ]
        });

        var gfx = graphicsFactory.drawConnection(g, connection);

        expect(gfx).to.exist;
      })();
    });

  });

}
