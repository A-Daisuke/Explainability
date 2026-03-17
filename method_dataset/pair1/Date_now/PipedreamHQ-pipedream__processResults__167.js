class __C__ {
    async processResults(after, params) {
      if (this.skipFirstRun && !after) {
        this._setAfter(Date.now());
        return;
      }

      const properties = await this.hubspot.getContactProperties();
      const propertyNames = properties.map((property) => property.name);
      if (!propertyNames.includes(this.property)) {
        throw new Error(
          `Property "${this.property}" not supported for Contacts. See Hubspot's default contact properties documentation - https://knowledge.hubspot.com/contacts/hubspots-default-contact-properties`,
        );
      }

      const updatedContacts = await this.getPaginatedItems(
        this.hubspot.searchCRM,
        params,
        after,
      );

      if (!updatedContacts.length) {
        return;
      }

      const results = await this.processChunks({
        batchRequestFn: this.batchGetContacts,
        chunks: this.getChunks(updatedContacts),
      });

      this.processEvents(results, after);
    },

}
