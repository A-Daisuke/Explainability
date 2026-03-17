export default function CreateDataObjectBehavior(eventBus, bpmnFactory) {

  CommandInterceptor.call(this, eventBus);

  this.preExecute('shape.create', function(event) {

    var context = event.context,
        shape = context.shape;

    if (is(shape, 'bpmn:DataObjectReference') && shape.type !== 'label') {

      // create a DataObject every time a DataObjectReference is created
      var dataObject = bpmnFactory.create('bpmn:DataObject');

      // Copy the isCollection property if needed.
      dataObject.isCollection = shape.businessObject.dataObjectRef?.isCollection || false;

      // set the reference to the DataObject
      shape.businessObject.dataObjectRef = dataObject;
    }
  });

}
