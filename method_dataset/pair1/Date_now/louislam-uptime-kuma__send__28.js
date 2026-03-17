function __method_wrapper__() {
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        // All DMs should have same timestamp
        const createdAt = Math.floor(Date.now() / 1000);

        const senderPrivateKey = await this.getPrivateKey(notification.sender);
        const recipientsPublicKeys = await this.getPublicKeys(notification.recipients);

        // Create NIP-04 encrypted direct message event for each recipient
        const events = [];
        for (const recipientPublicKey of recipientsPublicKeys) {
            const ciphertext = await nip04.encrypt(senderPrivateKey, recipientPublicKey, msg);
            let event = {
                kind: kinds.EncryptedDirectMessage,
                created_at: createdAt,
                tags: [[ "p", recipientPublicKey ]],
                content: ciphertext,
            };
            const signedEvent = finalizeEvent(event, senderPrivateKey);
            events.push(signedEvent);
        }

        // Publish events to each relay
        const relays = notification.relays.split("\n");
        let successfulRelays = 0;
        for (const relayUrl of relays) {
            const relay = await Relay.connect(relayUrl);
            let eventIndex = 0;

            // Authenticate to the relay, if required
            try {
                await relay.publish(events[0]);
                eventIndex = 1;
            } catch (error) {
                if (relay.challenge) {
                    await relay.auth(async (evt) => {
                        return finalizeEvent(evt, senderPrivateKey);
                    });
                }
            }

            try {
                for (let i = eventIndex; i < events.length; i++) {
                    await relay.publish(events[i]);
                }
                successfulRelays++;
            } catch (error) {
                console.error(`Failed to publish event to ${relayUrl}:`, error);
            } finally {
                relay.close();
            }
        }

        // Report success or failure
        if (successfulRelays === 0) {
            throw Error("Failed to connect to any relays.");
        }
        return `${successfulRelays}/${relays.length} relays connected.`;
    }

}
