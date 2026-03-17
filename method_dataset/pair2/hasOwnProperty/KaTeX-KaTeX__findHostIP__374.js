async function findHostIP() {
    if (!katexIP) {
        katexIP = "localhost";
    }
    if (katexIP !== "*any*" || katexURL) {
        if (!katexURL) {
            katexURL = "http://" + katexIP + ":" + katexPort + "/";
            console.log("KaTeX URL is " + katexURL);
        }
        return;
    }

    // Now we need to find an IP the container can connect to.
    // First, install a server component to get notified of successful connects
    const connect = new Promise((resolve) => {
        devServer.app.get("/ss-connect.js", function(req, res, next) {
            if (!katexURL) {
                katexIP = req.query.ip;
                katexURL = "http://" + katexIP + ":" + katexPort + "/";
                console.log("KaTeX URL is " + katexURL);
            }
            res.setHeader("Content-Type", "text/javascript");
            res.send("//OK");
            resolve();
        });
    });

    // Next, enumerate all network addresses
    const ips = [];
    const devs = os.networkInterfaces();
    for (const dev in devs) {
        if (devs.hasOwnProperty(dev)) {
            const addrs = devs[dev];
            for (let i = 0; i < addrs.length; ++i) {
                let addr = addrs[i].address;
                if (/:/.test(addr)) {
                    addr = "[" + addr + "]";
                }
                ips.push(addr);
            }
        }
    }
    console.log("Looking for host IP among " + ips.join(", "));

    // Load a data: URI document which attempts to contact each of these IPs
    let html = "<!doctype html>\n<html><body>\n";
    html += ips.map(function(ip) {
        return '<script src="http://' + ip + ':' + katexPort +
            '/ss-connect.js?ip=' + encodeURIComponent(ip) +
            '" defer></script>';
    }).join("\n");
    html += "\n</body></html>";
    html = "data:text/html," + encodeURIComponent(html);
    await driver.get(html);
    await connect;
}
