class __C__ {
    constructor() {
        // Set axios default user-agent to Uptime-Kuma/version
        axios.defaults.headers.common["User-Agent"] = this.getUserAgent();

        // Set default axios timeout to 5 minutes instead of infinity
        axios.defaults.timeout = 300 * 1000;

        log.info("server", "Creating express and socket.io instance");
        this.app = express();
        if (isSSL) {
            log.info("server", "Server Type: HTTPS");
            this.httpServer = https.createServer({
                key: fs.readFileSync(sslKey),
                cert: fs.readFileSync(sslCert),
                passphrase: sslKeyPassphrase,
            }, this.app);
        } else {
            log.info("server", "Server Type: HTTP");
            this.httpServer = http.createServer(this.app);
        }

        try {
            this.indexHTML = fs.readFileSync("./dist/index.html").toString();
        } catch (e) {
            // "dist/index.html" is not necessary for development
            if (process.env.NODE_ENV !== "development") {
                log.error("server", "Error: Cannot find 'dist/index.html', did you install correctly?");
                process.exit(1);
            }
        }

        // Set Monitor Types
        UptimeKumaServer.monitorTypeList["real-browser"] = new RealBrowserMonitorType();
        UptimeKumaServer.monitorTypeList["tailscale-ping"] = new TailscalePing();
        UptimeKumaServer.monitorTypeList["dns"] = new DnsMonitorType();
        UptimeKumaServer.monitorTypeList["mqtt"] = new MqttMonitorType();
        UptimeKumaServer.monitorTypeList["smtp"] = new SMTPMonitorType();
        UptimeKumaServer.monitorTypeList["group"] = new GroupMonitorType();
        UptimeKumaServer.monitorTypeList["snmp"] = new SNMPMonitorType();
        UptimeKumaServer.monitorTypeList["mongodb"] = new MongodbMonitorType();
        UptimeKumaServer.monitorTypeList["rabbitmq"] = new RabbitMqMonitorType();
        UptimeKumaServer.monitorTypeList["manual"] = new ManualMonitorType();

        // Allow all CORS origins (polling) in development
        let cors = undefined;
        if (isDev) {
            cors = {
                origin: "*",
            };
        }

        this.io = new Server(this.httpServer, {
            cors,
            allowRequest: async (req, callback) => {
                let transport;
                // It should be always true, but just in case, because this property is not documented
                if (req._query) {
                    transport = req._query.transport;
                } else {
                    log.error("socket", "Ops!!! Cannot get transport type, assume that it is polling");
                    transport = "polling";
                }

                const clientIP = await this.getClientIPwithProxy(req.connection.remoteAddress, req.headers);
                log.info("socket", `New ${transport} connection, IP = ${clientIP}`);

                // The following check is only for websocket connections, polling connections are already protected by CORS
                if (transport === "polling") {
                    callback(null, true);
                } else if (transport === "websocket") {
                    const bypass = process.env.UPTIME_KUMA_WS_ORIGIN_CHECK === "bypass";
                    if (bypass) {
                        log.info("auth", "WebSocket origin check is bypassed");
                        callback(null, true);
                    } else if (!req.headers.origin) {
                        log.info("auth", "WebSocket with no origin is allowed");
                        callback(null, true);
                    } else {
                        let host = req.headers.host;
                        let origin = req.headers.origin;

                        try {
                            let originURL = new URL(origin);
                            let xForwardedFor;
                            if (await Settings.get("trustProxy")) {
                                xForwardedFor = req.headers["x-forwarded-for"];
                            }

                            if (host !== originURL.host && xForwardedFor !== originURL.host) {
                                callback(null, false);
                                log.error("auth", `Origin (${origin}) does not match host (${host}), IP: ${clientIP}`);
                            } else {
                                callback(null, true);
                            }
                        } catch (e) {
                            // Invalid origin url, probably not from browser
                            callback(null, false);
                            log.error("auth", `Invalid origin url (${origin}), IP: ${clientIP}`);
                        }
                    }
                }
            }
        });
    }

}
