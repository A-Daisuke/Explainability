function __method_wrapper__() {
        inject(function(canvas, copyPaste, elementRegistry, modeling) {

          // given
          var subProcess = elementRegistry.get('SubProcess_1'),
              rootElement = canvas.getRootElement();

          // when
          copyPaste.copy(subProcess);

          modeling.removeShape(subProcess);

          var elements = copyPaste.paste({
            element: rootElement,
            point: {
              x: 300,
              y: 300
            }
          });

          // then
          var task = find(elements, function(element) {
            return is(element, 'bpmn:Task');
          });

          var taskBo = getBusinessObject(task);

          var conditionalFlow = find(elementRegistry.getAll(), function(element) {
            return is(element, 'bpmn:SequenceFlow') && element.businessObject.conditionExpression;
          });

          var defaultFlow = find(elementRegistry.getAll(), function(element) {
            return is(element, 'bpmn:SequenceFlow') && taskBo.default.id === element.id;
          });

          expect(conditionalFlow).to.exist;
          expect(defaultFlow).to.exist;
          expect(Object.prototype.propertyIsEnumerable.call(taskBo, 'default')).to.be.false;
        })

}
