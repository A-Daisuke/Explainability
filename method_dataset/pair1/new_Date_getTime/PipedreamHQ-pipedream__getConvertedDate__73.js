class __C__ {
    getConvertedDate(date, fieldName) {
      let converted = null;
      if (!this.isFieldEmptyOrNull(date)) {
        if (!isNaN(date)) {
          converted = date;
        } else {
          if (!this.isDateValid(date)) {
            throw new ConfigurationError(`Invalid date informed for field ${fieldName}`);
          }
          converted = new Date(date).getTime();
        }
      }

      return converted;
    },

}
