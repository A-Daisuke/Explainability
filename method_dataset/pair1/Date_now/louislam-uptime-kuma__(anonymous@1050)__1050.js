function __method_wrapper__() {
        socket.on("deleteMonitor", async (monitorID, callback) => {
            try {
                checkLogin(socket);

                log.info("manage", `Delete Monitor: ${monitorID} User ID: ${socket.userID}`);

                if (monitorID in server.monitorList) {
                    await server.monitorList[monitorID].stop();
                    delete server.monitorList[monitorID];
                }

                const startTime = Date.now();

                await R.exec("DELETE FROM monitor WHERE id = ? AND user_id = ? ", [
                    monitorID,
                    socket.userID,
                ]);

                // Fix #2880
                apicache.clear();

                const endTime = Date.now();

                log.info("DB", `Delete Monitor completed in : ${endTime - startTime} ms`);

                callback({
                    ok: true,
                    msg: "successDeleted",
                    msgi18n: true,
                });
                await server.sendDeleteMonitorFromList(socket, monitorID);

            } catch (e) {
                callback({
                    ok: false,
                    msg: e.message,
                });
            }
        });

}
