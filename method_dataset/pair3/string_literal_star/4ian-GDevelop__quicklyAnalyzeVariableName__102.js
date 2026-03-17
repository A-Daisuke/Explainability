export const quicklyAnalyzeVariableName = (
  name: string,
  variablesContainers?: Array<gdVariablesContainer>,
  getVariableSourceFromIdentifier?: (
    identifier: string,
    projectScopedContainers: gdProjectScopedContainers
  ) => VariablesContainer_SourceType | null,
  projectScopedContainersAccessor?: ProjectScopedContainersAccessor,
  isObjectVariable: boolean = false
): VariableNameQuickAnalyzeResult => {
  if (!name) return VariableNameQuickAnalyzeResults.OK;

  for (let i = 0; i < name.length; ++i) {
    const character = name[i];

    if (character === '[') {
      // This probably starts an expression, so stop the analysis.
      break;
    } else if (character === ' ') {
      return VariableNameQuickAnalyzeResults.WRONG_SPACE;
    } else if (character === '"') {
      return VariableNameQuickAnalyzeResults.WRONG_QUOTE;
    } else if (
      character === '(' ||
      character === '+' ||
      character === '-' ||
      character === '/' ||
      character === '*'
    ) {
      return VariableNameQuickAnalyzeResults.WRONG_EXPRESSION;
    }
  }

  const rootVariableName = getRootVariableName(name);
  // Check at least the name of the root variable, it's the best we can do.
  if (
    variablesContainers &&
    !variablesContainers.some(variablesContainer =>
      variablesContainer.has(rootVariableName)
    )
  ) {
    return VariableNameQuickAnalyzeResults.UNDECLARED_VARIABLE;
  }

  if (!projectScopedContainersAccessor) {
    return VariableNameQuickAnalyzeResults.OK;
  }
  const projectScopedContainers = projectScopedContainersAccessor.get();

  if (
    !isObjectVariable &&
    projectScopedContainers
      .getObjectsContainersList()
      .hasObjectOrGroupNamed(rootVariableName)
  ) {
    return VariableNameQuickAnalyzeResults.NAME_COLLISION_WITH_OBJECT;
  }

  if (
    name.length !== rootVariableName.length &&
    getVariableSourceFromIdentifier
  ) {
    const variableSource = getVariableSourceFromIdentifier(
      rootVariableName,
      projectScopedContainers
    );

    if (variableSource === gd.VariablesContainer.Parameters) {
      return VariableNameQuickAnalyzeResults.PARAMETER_WITH_CHILD;
    }
    if (variableSource === gd.VariablesContainer.Properties) {
      return VariableNameQuickAnalyzeResults.PROPERTY_WITH_CHILD;
    }
  }

  return VariableNameQuickAnalyzeResults.OK;
};
