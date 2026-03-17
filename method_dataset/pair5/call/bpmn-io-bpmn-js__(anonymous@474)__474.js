function __method_wrapper__() {
  it('should properly render connection markers (2)', function() {
    var xml = require('./BpmnRenderer.connection-colors.bpmn');

    return bootstrapViewer(xml).call(this).then(function(result) {

      var err = result.error;

      expect(err).not.to.exist;

      inject(function(canvas) {

        [
          [ 'MessageFlow_1facuin', 'rgb(23, 100, 255)', 'rgb(23, 100, 255)' ],
          [ 'MessageFlow_1vmbq3n', 'rgb(23, 100, 255)', 'rgb(23, 100, 255)' ],
          [ 'DataInputAssociation', 'rgb(23, 100, 255)', 'none' ],
          [ 'DataOutputAssociation_0ixhole', 'rgb(142, 36, 170)', 'none' ],
        ].forEach(([ id, stroke, fill ]) => {
          var svg = canvas._svg,
              markerPath = svg.querySelector(`[data-element-id="${id}"] marker path`);

          expect(markerPath).to.exist;

          stroke && expect(markerPath.style.stroke).to.eql(stroke);
          fill && expect(markerPath.style.fill).to.eql(fill);

        });
      })();
    });
  });

}
