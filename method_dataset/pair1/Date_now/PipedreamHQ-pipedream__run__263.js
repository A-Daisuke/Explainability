function __method_wrapper__() {
  async run({ $ }) {
    const configuration = {};
    if (
      (this.postSubmitActionType && !this.postSubmitActionValue) ||
      (!this.postSubmitActionType && this.postSubmitActionValue)
    ) {
      throw new ConfigurationError(
        "Post Submit Action Type and Value must be provided together.",
      );
    }

    if (this.language) {
      configuration.language = this.language;
    }
    if (this.cloneable) {
      configuration.cloneable = this.cloneable;
    }
    if (this.postSubmitActionType) {
      configuration.postSubmitAction = {
        type: this.postSubmitActionType,
        value: this.postSubmitActionValue,
      };
    }
    if (this.editable) {
      configuration.editable = this.editable;
    }
    if (this.archivable) {
      configuration.archivable = this.archivable;
    }
    if (this.recaptchaEnabled) {
      configuration.recaptchaEnabled = this.recaptchaEnabled;
    }
    if (this.notifyContactOwner) {
      configuration.notifyContactOwner = this.notifyContactOwner;
    }
    if (this.notifyRecipients) {
      configuration.notifyRecipients = parseObject(this.notifyRecipients);
    }
    if (this.createNewContactForNewEmail) {
      configuration.createNewContactForNewEmail =
        this.createNewContactForNewEmail;
    }
    if (this.prePopulateKnownValues) {
      configuration.prePopulateKnownValues = this.prePopulateKnownValues;
    }
    if (this.allowLinkToResetKnownValues) {
      configuration.allowLinkToResetKnownValues =
        this.allowLinkToResetKnownValues;
    }
    if (this.lifecycleStages) {
      configuration.lifecycleStages = parseObject(this.lifecycleStages);
    }

    const data = cleanObject({
      formType: "hubspot",
      name: this.name,
      createdAt: new Date(Date.now()).toISOString(),
      archived: this.archived,
      fieldGroups: parseObject(this.fieldGroups),
      displayOptions: {
        renderRawHtml: this.renderRawHtml,
        cssClass: this.cssClass,
        theme: this.theme,
        submitButtonText: this.submitButtonText,
        style: {
          labelTextSize: this.labelTextSize,
          legalConsentTextColor: this.legalConsentTextColor,
          fontFamily: this.fontFamily,
          legalConsentTextSize: this.legalConsentTextSize,
          backgroundWidth: this.backgroundWidth,
          helpTextSize: this.helpTextSize,
          submitFontColor: this.submitFontColor,
          labelTextColor: this.labelTextColor,
          submitAlignment: this.submitAlignment,
          submitSize: this.submitSize,
          helpTextColor: this.helpTextColor,
          submitColor: this.submitColor,
        },
      },
      legalConsentOptions: {
        type: this.legalConsentOptionsType,
        ...(this.legalConsentOptionsObject
          ? parseObject(this.legalConsentOptionsObject)
          : {}),
      },
    });

    data.configuration = cleanObject(configuration);

    const response = await this.hubspot.createForm({
      $,
      data,
    });

    $.export("$summary", `Successfully created form with ID: ${response.id}`);

    return response;
  },

}
