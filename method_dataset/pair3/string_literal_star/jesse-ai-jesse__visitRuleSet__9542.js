function __method_wrapper__() {
  visitRuleSet(node) {
    const declarations = node.getDeclarations();
    if (!declarations) {
      return false;
    }
    if (!declarations.hasChildren()) {
      this.addEntry(node.getSelectors(), Rules.EmptyRuleSet);
    }
    const propertyTable = [];
    for (const element of declarations.getChildren()) {
      if (element instanceof Declaration) {
        propertyTable.push(new Element2(element));
      }
    }
    const boxModel = calculateBoxModel(propertyTable);
    if (boxModel.width) {
      let properties = [];
      if (boxModel.right.value) {
        properties = union(properties, boxModel.right.properties);
      }
      if (boxModel.left.value) {
        properties = union(properties, boxModel.left.properties);
      }
      if (properties.length !== 0) {
        for (const item of properties) {
          this.addEntry(item.node, Rules.BewareOfBoxModelSize);
        }
        this.addEntry(boxModel.width.node, Rules.BewareOfBoxModelSize);
      }
    }
    if (boxModel.height) {
      let properties = [];
      if (boxModel.top.value) {
        properties = union(properties, boxModel.top.properties);
      }
      if (boxModel.bottom.value) {
        properties = union(properties, boxModel.bottom.properties);
      }
      if (properties.length !== 0) {
        for (const item of properties) {
          this.addEntry(item.node, Rules.BewareOfBoxModelSize);
        }
        this.addEntry(boxModel.height.node, Rules.BewareOfBoxModelSize);
      }
    }
    let displayElems = this.fetchWithValue(propertyTable, "display", "inline-block");
    if (displayElems.length > 0) {
      const elem = this.fetch(propertyTable, "float");
      for (let index = 0; index < elem.length; index++) {
        const node2 = elem[index].node;
        const value = node2.getValue();
        if (value && !value.matches("none")) {
          this.addEntry(node2, Rules.PropertyIgnoredDueToDisplay, t("inline-block is ignored due to the float. If 'float' has a value other than 'none', the box is floated and 'display' is treated as 'block'"));
        }
      }
    }
    displayElems = this.fetchWithValue(propertyTable, "display", "block");
    if (displayElems.length > 0) {
      const elem = this.fetch(propertyTable, "vertical-align");
      for (let index = 0; index < elem.length; index++) {
        this.addEntry(elem[index].node, Rules.PropertyIgnoredDueToDisplay, t("Property is ignored due to the display. With 'display: block', vertical-align should not be used."));
      }
    }
    const elements = this.fetch(propertyTable, "float");
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      if (!this.isValidPropertyDeclaration(element)) {
        this.addEntry(element.node, Rules.AvoidFloat);
      }
    }
    for (let i = 0; i < propertyTable.length; i++) {
      const element = propertyTable[i];
      if (element.fullPropertyName !== "background" && !this.validProperties[element.fullPropertyName]) {
        const value = element.node.getValue();
        if (value && this.documentText.charAt(value.offset) !== "-") {
          const elements2 = this.fetch(propertyTable, element.fullPropertyName);
          if (elements2.length > 1) {
            for (let k = 0; k < elements2.length; k++) {
              const value2 = elements2[k].node.getValue();
              if (value2 && this.documentText.charAt(value2.offset) !== "-" && elements2[k] !== element) {
                this.addEntry(element.node, Rules.DuplicateDeclarations);
              }
            }
          }
        }
      }
    }
    const isExportBlock = node.getSelectors().matches(":export");
    if (!isExportBlock) {
      const propertiesBySuffix = new NodesByRootMap();
      let containsUnknowns = false;
      for (const element of propertyTable) {
        const decl = element.node;
        if (this.isCSSDeclaration(decl)) {
          let name = element.fullPropertyName;
          const firstChar = name.charAt(0);
          if (firstChar === "-") {
            if (name.charAt(1) !== "-") {
              if (!this.cssDataManager.isKnownProperty(name) && !this.validProperties[name]) {
                this.addEntry(decl.getProperty(), Rules.UnknownVendorSpecificProperty);
              }
              const nonPrefixedName = decl.getNonPrefixedPropertyName();
              propertiesBySuffix.add(nonPrefixedName, name, decl.getProperty());
            }
          } else {
            const fullName = name;
            if (firstChar === "*" || firstChar === "_") {
              this.addEntry(decl.getProperty(), Rules.IEStarHack);
              name = name.substr(1);
            }
            if (!this.cssDataManager.isKnownProperty(fullName) && !this.cssDataManager.isKnownProperty(name)) {
              if (!this.validProperties[name]) {
                this.addEntry(decl.getProperty(), Rules.UnknownProperty, t("Unknown property: '{0}'", decl.getFullPropertyName()));
              }
            }
            propertiesBySuffix.add(name, name, null);
          }
        } else {
          containsUnknowns = true;
        }
      }
      if (!containsUnknowns) {
        for (const suffix in propertiesBySuffix.data) {
          const entry = propertiesBySuffix.data[suffix];
          const actual = entry.names;
          const needsStandard = this.cssDataManager.isStandardProperty(suffix) && actual.indexOf(suffix) === -1;
          if (!needsStandard && actual.length === 1) {
            continue;
          }
          const entriesThatNeedStandard = new Set(needsStandard ? entry.nodes : []);
          if (needsStandard) {
            const pseudoElements = this.getContextualVendorSpecificPseudoElements(node);
            for (const node2 of entry.nodes) {
              const propertyName = node2.getName();
              const prefix = propertyName.substring(0, propertyName.length - suffix.length);
              if (pseudoElements.some((x) => x.startsWith(prefix))) {
                entriesThatNeedStandard.delete(node2);
              }
            }
          }
          const expected = [];
          for (let i = 0, len = _LintVisitor.prefixes.length; i < len; i++) {
            const prefix = _LintVisitor.prefixes[i];
            if (this.cssDataManager.isStandardProperty(prefix + suffix)) {
              expected.push(prefix + suffix);
            }
          }
          const missingVendorSpecific = this.getMissingNames(expected, actual);
          if (missingVendorSpecific || needsStandard) {
            for (const node2 of entry.nodes) {
              if (needsStandard && entriesThatNeedStandard.has(node2)) {
                const message = t("Also define the standard property '{0}' for compatibility", suffix);
                this.addEntry(node2, Rules.IncludeStandardPropertyWhenUsingVendorPrefix, message);
              }
              if (missingVendorSpecific) {
                const message = t("Always include all vendor specific properties: Missing: {0}", missingVendorSpecific);
                this.addEntry(node2, Rules.AllVendorPrefixes, message);
              }
            }
          }
        }
      }
    }
    return true;
  }

}
