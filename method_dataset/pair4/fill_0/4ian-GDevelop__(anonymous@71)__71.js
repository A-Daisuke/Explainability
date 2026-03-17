function __method_wrapper__() {
    () => {
      const options = new Array(maximumNumberOfPlayersAllowed - 1)
        .fill(0)
        .map((_, index) => (
          <SelectOption
            key={index}
            value={index + 2}
            label={(index + 2).toString()}
            shouldNotTranslate
          />
        ));
      if (
        maximumNumberOfPlayersAllowed < maximumValueForMaximumNumberOfPlayers
      ) {
        options.push(
          <SelectOption
            key="more"
            value={maximumNumberOfPlayersAllowed + 1}
            label={t`${(
              maximumNumberOfPlayersAllowed + 1
            ).toString()}+ (Available with a subscription)`}
            disabled
          />
        );
      }
      return options;
    },

}
