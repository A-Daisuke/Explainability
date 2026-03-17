class __C__ {
  it('should properly render colored markers', function() {
    var xml = require('./BpmnRenderer.colors.bpmn');

    return bootstrapViewer(xml).call(this).then(function(result) {

      var err = result.error;

      expect(err).not.to.exist;

      inject(function(canvas) {

        [
          [ 'SequenceFlow_1jrsqqc' , 'blue' , 'blue' ],
          [ 'SequenceFlow_0h9s0mp' , 'rgba(255, 0, 0, 0.9)' ],
          [ 'SequenceFlow_0pqo7zt' , 'rgb(251, 140, 0)' , 'rgb(251, 140, 0)' ],
          [ 'SequenceFlow_1qt82pt' , 'blue' , 'blue' ],
          [ 'SequenceFlow_17ohrlh' , 'rgb(251, 140, 0)' , 'rgb(251, 140, 0)' ],
          [ 'MessageFlow_11bysyp' , 'rgb(251, 140, 0)' , 'rgb(255, 224, 178)' ],
          [ 'MessageFlow_1qyovto' , 'rgb(251, 140, 0)' , 'rgb(255, 224, 178)' ],
          [ 'DataInputAssociation_1ncouqr' , 'rgb(251, 140, 0)' , 'none' ],
          [ 'DataOutputAssociation_1i89wkc' , 'rgb(251, 140, 0)' , 'none' ]
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
