function __method_wrapper__() {
        lastHeartBeat() {
            // Also trigger screenshot refresh here
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.cacheTime = Date.now();

            if (
                this.monitor.id in this.$root.lastHeartbeatList &&
                this.$root.lastHeartbeatList[this.monitor.id]
            ) {
                return this.$root.lastHeartbeatList[this.monitor.id];
            }

            return {
                status: -1,
            };
        },

}
