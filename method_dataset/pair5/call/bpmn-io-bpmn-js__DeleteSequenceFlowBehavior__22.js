export default function DeleteSequenceFlowBehavior(eventBus, modeling) {

  CommandInterceptor.call(this, eventBus);


  this.preExecute('connection.delete', function(event) {
    var context = event.context,
        connection = context.connection,
        source = connection.source;

    if (isDefaultFlow(connection, source)) {
      modeling.updateProperties(source, {
        'default': null
      });
    }
  });
}
