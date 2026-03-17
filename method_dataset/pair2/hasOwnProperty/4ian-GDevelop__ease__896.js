      export const ease = (
        easingValue: string,
        fromValue: float,
        toValue: float,
        weighting: float
      ) => {
        // This local declaration is needed because otherwise the transpiled
        // code doesn't know it.
        const easingFunctions = gdjs.evtTools.tween.easingFunctions;

        const easingFunction = easingFunctions.hasOwnProperty(easingValue)
          ? easingFunctions[easingValue]
          : easingFunctions.linear;
        return fromValue + (toValue - fromValue) * easingFunction(weighting);
      };
