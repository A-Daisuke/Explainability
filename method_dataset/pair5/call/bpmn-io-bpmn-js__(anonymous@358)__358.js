function __method_wrapper__() {
  it('should add random ID suffix to marker ID', function() {

    var xml = require('../../fixtures/bpmn/simple.bpmn');
    return bootstrapViewer(xml).call(this).then(function(result) {

      var err = result.error;

      expect(err).not.to.exist;

      inject(function(canvas) {
        var svg = canvas._svg;
        var markers = svg.querySelectorAll('marker');

        expect(markers[0].id).to.match(/^marker-[A-Za-z0-9]+$/);
      })();
    });
  });

}
