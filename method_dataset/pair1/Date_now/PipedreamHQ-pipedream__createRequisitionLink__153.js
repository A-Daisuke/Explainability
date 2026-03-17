class __C__ {
    async createRequisitionLink({
      institutionId,
      maxHistoricalDays,
      accessValidForDays,
      accessScope,
    }) {
      const agreement = await this.createEndUserAgreement({
        data: {
          institution_id: institutionId,
          max_historical_days: maxHistoricalDays,
          access_valid_for_days: accessValidForDays,
          access_scope: accessScope,
        },
      });
      const requisition = await this.createRequisition({
        data: {
          redirect: "https://pipedream.com",
          institution_id: institutionId,
          reference: Date.now(),
          agreement: agreement.id,
          user_language: "EN",
        },
      });
      return requisition;
    },

}
