class __C__ {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const config = {
        count: 10,
        offset: 0,
      };
      const campaigns = this.mailchimp.statusIsSent(this.status)
        ? await this.mailchimp.getCampaignsBySentDate(config)
        : await this.mailchimp.getCampaignsByCreationDate(config);
      const sinceDate = campaigns?.length
        ? this.mailchimp.getCampaignTimestamp(campaigns[0], this.status)
        : Date.now();
      if (campaigns?.length) {
        campaigns.status = this.status;
        campaigns.forEach(this.processEvent);
      }
      this.setDbServiceVariable("lastSinceDate", sinceDate);
    },

}
