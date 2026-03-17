class __C__ {
    generateMeta({
      id, name,
    }) {
      const labelName = this._getLabelName();
      const labelColor = this._getLabelColor();
      let summary = labelColor;
      summary += labelName
        ? ` - ${labelName}`
        : "";
      summary += `; added to ${name}`;
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },

}
