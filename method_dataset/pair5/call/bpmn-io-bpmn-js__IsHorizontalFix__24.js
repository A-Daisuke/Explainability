export default function IsHorizontalFix(eventBus) {

  CommandInterceptor.call(this, eventBus);

  var elementTypesToUpdate = [
    'bpmn:Participant',
    'bpmn:Lane'
  ];

  this.executed([ 'shape.move', 'shape.create', 'shape.resize' ], function(event) {
    var shape = event.context.shape,
        bo = getBusinessObject(shape),
        di = getDi(shape);

    if (isAny(bo, elementTypesToUpdate)) {
      var isHorizontal = di.get('isHorizontal');

      if (isHorizontal === undefined) {
        isHorizontal = true;
      }

      // set attribute directly to avoid modeling#updateProperty side effects
      di.set('isHorizontal', isHorizontal);
    }
  });

}
