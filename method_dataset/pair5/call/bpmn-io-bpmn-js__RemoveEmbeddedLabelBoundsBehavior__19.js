export default function RemoveEmbeddedLabelBoundsBehavior(eventBus, modeling) {
  CommandInterceptor.call(this, eventBus);

  this.preExecute('shape.resize', function(context) {
    var shape = context.shape;

    var di = getDi(shape),
        label = di && di.get('label'),
        bounds = label && label.get('bounds');

    if (bounds) {
      modeling.updateModdleProperties(shape, label, {
        bounds: undefined
      });
    }
  }, true);
}
