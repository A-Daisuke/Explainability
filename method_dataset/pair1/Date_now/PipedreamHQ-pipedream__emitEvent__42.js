class __C__ {
    async emitEvent() {
      const lastProfile = this._getLastProfile();
      const data = await this.app.fetchCreatorProfile({
        platform: this.platform,
        profileId: this.profileId,
      });

      const profile = data?.data?.user || data?.data || data;

      const diff = getObjectDiff(lastProfile, profile);

      if (Object.keys(diff).length > 0) {
        this._setLastProfile(profile);
        this.$emit({
          profile,
          diff,
        }, {
          id: Date.now(),
          summary: `New profile update for ${this.profileId}`,
          ts: Date.parse(new Date()),
        });
      }

    },

}
