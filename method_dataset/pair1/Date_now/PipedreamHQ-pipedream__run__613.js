class __C__ {
  async run(event) {
    // Default to polling if triggerType is not webhook
    if (this.triggerType !== "webhook") {
      let lastHistoryId = this._getLastHistoryId();

      if (!lastHistoryId) {
        lastHistoryId = await this.getHistoryId();
      }
      await this.emitHistories(lastHistoryId);
      return;
    }

    // Handle webhook case
    if (this.triggerType === "webhook") {
      if (event.timestamp) {
        // event was triggered by timer
        const topicName = this._getTopicName();
        if (topicName) {
          // renew Gmail push notifications if expiring within the next hour
          // or if no email has been received within the last hour
          const currentExpiration = this._getExpiration();
          const lastReceivedTime = this._getLastReceivedTime();
          if (
            (+currentExpiration < (event.timestamp + 3600) * 1000)
            || (lastReceivedTime < (event.timestamp - 3600) * 1000)
          ) {
            const { expiration } = await this.setupGmailNotifications(topicName);
            this._setExpiration(expiration);
          }
          return;
        } else {
          // first run, no need to renew push notifications
          this._setTopicName(this.topic);
          const initialHistoryId = this.initialHistoryId || this._getLastHistoryId();
          this._setLastProcessedHistoryId(initialHistoryId);
          this._setExpiration(this.expiration);
          return;
        }
      }

      this.http.respond({
        status: 200,
      });

      // Extract the Pub/Sub message data
      const pubsubMessage = event.body.message;
      if (!pubsubMessage) {
        return;
      }
      const decodedData = JSON.parse(
        Buffer.from(pubsubMessage.data, "base64").toString(),
      );

      console.log("Decoded Pub/Sub data:", decodedData);

      const { historyId: receivedHistoryId } = decodedData;

      // Retrieve the last processed historyId
      const lastProcessedHistoryId = this._getLastProcessedHistoryId();
      console.log("Last processed historyId:", lastProcessedHistoryId);

      // Use the minimum of lastProcessedHistoryId and the received historyId
      let startHistoryId = Math.min(
        parseInt(lastProcessedHistoryId),
        parseInt(receivedHistoryId),
      );
      console.log("Using startHistoryId:", startHistoryId);

      // Fetch the history
      let historyResponses;
      try {
        historyResponses = await this.getHistoryResponses(startHistoryId);
      } catch {
        // catch error thrown if startHistoryId is invalid or expired

        // emit recent messages to attempt to avoid missing any messages
        await this.emitRecentMessages();

        // set startHistoryId to the historyId received from the webhook
        startHistoryId = parseInt(receivedHistoryId);
        console.log("Using startHistoryId:", startHistoryId);
        historyResponses = await this.getHistoryResponses(startHistoryId);
      }

      console.log(
        "History responses:",
        JSON.stringify(historyResponses, null, 2),
      );

      // Process history to find new messages
      const newMessages = [];
      for (const historyResponse of historyResponses) {
        if (historyResponse.history) {
          const historyResponseFiltered = this.filterHistory(historyResponse.history);
          for (const historyItem of historyResponseFiltered) {
            newMessages.push(
              ...historyItem.messagesAdded.map((msg) => msg.message),
            );
          }
        }
      }

      console.log("New messages found:", newMessages.length);

      // Fetch full message details for new messages
      const newMessageIds = newMessages?.map(({ id }) => id) || [];
      const messageDetails = await this.getMessageDetails(newMessageIds);

      if (!messageDetails?.length) {
        return;
      }

      console.log("Fetched message details count:", messageDetails.length);

      // Store the latest historyId in the db
      let latestHistoryId = receivedHistoryId;
      for (const historyResponse of historyResponses) {
        latestHistoryId = Math.max(latestHistoryId, historyResponse.historyId);
      }
      this._setLastProcessedHistoryId(latestHistoryId);
      console.log("Updated lastProcessedHistoryId:", latestHistoryId);

      this._setLastReceivedTime(Date.now());

      messageDetails.forEach((message) => {
        if (message?.id) {
          this.emitEvent(message);
        }
      });
    }
  },

}
