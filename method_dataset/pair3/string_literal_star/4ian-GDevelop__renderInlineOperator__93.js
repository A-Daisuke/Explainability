export const renderInlineOperator = ({
  value,
  InvalidParameterValue,
  useAssignmentOperators,
  parameterMetadata,
}: ParameterInlineRendererProps) => {
  const comparedValueType = parameterMetadata
    ? parameterMetadata.getExtraInfo()
    : 'unknown';
  const operators =
    mapTypeToOperators[comparedValueType] || mapTypeToOperators.unknown;

  if (!operators.includes(value)) {
    return (
      <InvalidParameterValue isEmpty>
        <Trans>Choose an operator</Trans>
      </InvalidParameterValue>
    );
  }

  if (useAssignmentOperators) {
    if (value === '=') return '=';
    else if (value === '+') return '+=';
    else if (value === '-') return '-=';
    else if (value === '/') return '/=';
    else if (value === '*') return '*=';
  } else {
    if (value === '=') return <Trans>set to</Trans>;
    else if (value === '+') return <Trans>add</Trans>;
    else if (value === '-') return <Trans>subtract</Trans>;
    else if (value === '/') return <Trans>divide by</Trans>;
    else if (value === '*') return <Trans>multiply by</Trans>;
  }
  if (value === 'True') return <Trans>set to true</Trans>;
  else if (value === 'False') return <Trans>set to false</Trans>;
  else if (value === 'Toggle') return <Trans>toggle</Trans>;

  return <InvalidParameterValue>{value}</InvalidParameterValue>;
};
