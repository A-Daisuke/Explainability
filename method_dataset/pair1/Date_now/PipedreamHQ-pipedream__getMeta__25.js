class __C__ {
    getMeta(spreadsheet, worksheet) {
      const {
        sheetId: worksheetId,
        title: worksheetTitle,
      } = worksheet.properties;
      const { properties: { title: sheetTitle } } = spreadsheet;

      const ts = Date.now();
      const id = `${worksheetId}${ts}`;
      const summary = `${sheetTitle} - ${worksheetTitle}`;
      return {
        id,
        summary,
        ts,
      };
    },

}
