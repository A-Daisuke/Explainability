function __method_wrapper__() {
    it('with di', function() {

      var xml = require('./DataInputOutput.bpmn');

      // given
      return bootstrapViewer(xml).call(this).then(function(result) {

        var err = result.error;

        expect(err).not.to.exist;

        // when
        inject(function(elementRegistry) {

          var inputLabel = elementRegistry.get('DataInput').label,
              outputLabel = elementRegistry.get('DataOutput').label;

          var inputLabelCenter = getCenter(inputLabel),
              outputCenter = getCenter(outputLabel);

          // then
          expect(inputLabelCenter.x).to.be.within(110, 130);
          expect(inputLabelCenter.y).to.be.within(150, 170);
          expect(inputLabel.width).to.be.above(20);
          expect(inputLabel.height).to.be.above(10);

          expect(outputCenter.x).to.be.within(290, 310);
          expect(outputCenter.y).to.be.within(190, 210);
          expect(outputLabel.width).to.be.above(20);
          expect(outputLabel.height).to.be.above(10);
        })();

      });
    });

}
