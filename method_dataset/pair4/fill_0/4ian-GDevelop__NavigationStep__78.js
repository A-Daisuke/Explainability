const NavigationStep = ({ stepIndex }: {| stepIndex: number |}) => {
  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  return (
    <Line justifyContent="center">
      {new Array(STEP_MAX_COUNT).fill(0).map((_, index) => {
        return (
          <div
            key={index}
            style={{
              ...styles.navigationDot,
              backgroundColor:
                index === stepIndex
                  ? gdevelopTheme.text.color.primary
                  : gdevelopTheme.text.color.disabled,
            }}
          />
        );
      })}
    </Line>
  );
};
