export default function DataInputAssociationBehavior(eventBus, bpmnFactory) {

  CommandInterceptor.call(this, eventBus);


  this.executed([
    'connection.create',
    'connection.delete',
    'connection.move',
    'connection.reconnect'
  ], ifDataInputAssociation(fixTargetRef));

  this.reverted([
    'connection.create',
    'connection.delete',
    'connection.move',
    'connection.reconnect'
  ], ifDataInputAssociation(fixTargetRef));


  function usesTargetRef(element, targetRef, removedConnection) {

    var inputAssociations = element.get('dataInputAssociations');

    return find(inputAssociations, function(association) {
      return association !== removedConnection &&
             association.targetRef === targetRef;
    });
  }

  function getTargetRef(element, create) {

    var properties = element.get('properties');

    var targetRefProp = find(properties, function(p) {
      return p.name === TARGET_REF_PLACEHOLDER_NAME;
    });

    if (!targetRefProp && create) {
      targetRefProp = bpmnFactory.create('bpmn:Property', {
        name: TARGET_REF_PLACEHOLDER_NAME
      });

      collectionAdd(properties, targetRefProp);
    }

    return targetRefProp;
  }

  function cleanupTargetRef(element, connection) {

    var targetRefProp = getTargetRef(element);

    if (!targetRefProp) {
      return;
    }

    if (!usesTargetRef(element, targetRefProp, connection)) {
      collectionRemove(element.get('properties'), targetRefProp);
    }
  }

  /**
   * Make sure targetRef is set to a valid property or
   * `null` if the connection is detached.
   *
   * @param {Event} event
   */
  function fixTargetRef(event) {

    var context = event.context,
        connection = context.connection,
        connectionBo = connection.businessObject,
        target = connection.target,
        targetBo = target && target.businessObject,
        newTarget = context.newTarget,
        newTargetBo = newTarget && newTarget.businessObject,
        oldTarget = context.oldTarget || context.target,
        oldTargetBo = oldTarget && oldTarget.businessObject;

    var dataAssociation = connection.businessObject,
        targetRefProp;

    if (oldTargetBo && oldTargetBo !== targetBo) {
      cleanupTargetRef(oldTargetBo, connectionBo);
    }

    if (newTargetBo && newTargetBo !== targetBo) {
      cleanupTargetRef(newTargetBo, connectionBo);
    }

    if (targetBo) {
      targetRefProp = getTargetRef(targetBo, true);
      dataAssociation.targetRef = targetRefProp;
    } else {
      dataAssociation.targetRef = null;
    }
  }
}
