class __C__ {
  doValidation(document, stylesheet, settings = this.settings) {
    if (settings && settings.validate === false) {
      return [];
    }
    const entries = [];
    entries.push.apply(entries, ParseErrorCollector.entries(stylesheet));
    entries.push.apply(entries, LintVisitor.entries(stylesheet, document, new LintConfigurationSettings(settings && settings.lint), this.cssDataManager));
    const ruleIds = [];
    for (const r in Rules) {
      ruleIds.push(Rules[r].id);
    }
    function toDiagnostic(marker) {
      const range = Range.create(document.positionAt(marker.getOffset()), document.positionAt(marker.getOffset() + marker.getLength()));
      const source = document.languageId;
      return {
        code: marker.getRule().id,
        source,
        message: marker.getMessage(),
        severity: marker.getLevel() === Level.Warning ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
        range
      };
    }
    return entries.filter((entry) => entry.getLevel() !== Level.Ignore).map(toDiagnostic);
  }

}
