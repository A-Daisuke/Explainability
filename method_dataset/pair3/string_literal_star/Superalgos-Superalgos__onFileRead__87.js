        function onFileRead(err, file) {
            if (err) {
                SA.logger.error('respondWithFont -> File Not Found: ' + fileName + ' or Error = ' + err.stack)
                return
            }
            httpResponse.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate') // HTTP 1.1.
            httpResponse.setHeader('Pragma', 'no-cache') // HTTP 1.0.
            httpResponse.setHeader('Expires', '0') // Proxies.
            httpResponse.setHeader('Access-Control-Allow-Origin', '*') // Allows to access data from other domains.

            if (fileName.indexOf('2') < 0) {
                httpResponse.writeHead(200, { 'Content-Type': 'font/woff' })
            } else {
                httpResponse.writeHead(200, { 'Content-Type': 'font/woff2' })
            }
            httpResponse.end(file, 'binary')
        }
