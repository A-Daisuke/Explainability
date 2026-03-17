function __method_wrapper__() {
  async run({ $ }) {
    let blocks = this.blocks;

    if (!blocks) {
      blocks = [
        this._makeTextBlock(this.mrkdwn),
      ];
    } else if (typeof blocks === "string") {
      blocks = JSON.parse(blocks);
    }

    if (this.include_sent_via_pipedream_flag) {
      const sentViaPipedreamText = this._makeSentViaPipedreamBlock();
      blocks.push(sentViaPipedreamText);
    }

    let metadataEventPayload;

    if (this.metadata_event_type) {

      if (typeof this.metadata_event_payload === "string") {
        try {
          metadataEventPayload = JSON.parse(this.metadata_event_payload);
        } catch (error) {
          throw new Error(`Invalid JSON in metadata_event_payload: ${error.message}`);
        }
      }

      this.metadata = {
        event_type: this.metadata_event_type,
        event_payload: metadataEventPayload,
      };
    }

    const obj = {
      text: this.text,
      channel: await this.getChannelId(),
      attachments: this.attachments,
      unfurl_links: this.unfurl_links,
      unfurl_media: this.unfurl_media,
      parse: this.parse,
      as_user: this.as_user,
      username: this.username,
      icon_emoji: this.icon_emoji,
      icon_url: this.icon_url,
      mrkdwn: this.mrkdwn,
      blocks,
      link_names: this.link_names,
      reply_broadcast: this.thread_broadcast,
      thread_ts: this.thread_ts,
      metadata: this.metadata || null,
    };

    if (this.post_at) {
      obj.post_at = Math.floor(new Date(this.post_at).getTime() / 1000);
      return await this.slack.scheduleMessage(obj);
    }
    const resp = await this.slack.postChatMessage(obj);
    const { channel } = await this.slack.conversationsInfo({
      channel: resp.channel,
    });
    let channelName = `#${channel?.name}`;
    if (channel.is_im) {
      const { profile } = await this.slack.getUserProfile({
        user: channel.user,
      });
      channelName = `@${profile.real_name}`;
    } else if (channel.is_mpim) {
      channelName = `@${channel.purpose.value}`;
    }
    $.export("$summary", `Successfully sent a message to ${channelName}`);
    return resp;
  },

}
