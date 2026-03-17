function __method_wrapper__() {
    getVariablePathInContainerByLoopingThroughAllVariables(
      variable: gdjs.Variable,
      childrenToLookIn: Children | null = null
    ): string[] | null {
      const variables = childrenToLookIn || this._variables.items;
      for (const variableName in variables) {
        if (variables.hasOwnProperty(variableName)) {
          const variableItem = variables[variableName];
          if (variableItem === variable) {
            return [variableName];
          } else if (variableItem.getType() === 'structure') {
            const variableItemChildren = variableItem.getAllChildren();
            const childPath =
              this.getVariablePathInContainerByLoopingThroughAllVariables(
                variable,
                variableItemChildren
              );
            if (childPath) {
              return [variableName, ...childPath];
            }
          }
        }
      }

      return null;
    }

}
