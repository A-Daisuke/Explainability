export const handler = async (event, context) => {
    console.log('--- Netlify Proxy Request ---');
    console.log('Time:', new Date().toISOString());
    console.log('Method:', event.httpMethod);
    console.log('Path:', event.path);
    // Note: event.queryStringParameters contains query params if any
    // Note: event.headers contains incoming headers

    // --- CORS Headers (for all responses) ---
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*', // Allow all headers client might send
    };

    // --- Handle OPTIONS Preflight Request ---
    if (event.httpMethod === 'OPTIONS') {
        logDebug("Handling OPTIONS request");
        return {
            statusCode: 204,
            headers: {
                ...corsHeaders,
                'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
            },
            body: '',
        };
    }

    // --- 验证鉴权 ---
    if (!validateAuth(event)) {
        console.warn('Netlify 代理请求鉴权失败');
        return {
            statusCode: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: '代理访问未授权：请检查密码配置或鉴权参数'
            }),
        };
    }

    // --- Extract Target URL ---
    // Based on netlify.toml rewrite: from = "/proxy/*" to = "/.netlify/functions/proxy/:splat"
    // The :splat part should be available in event.path after the base path
    let encodedUrlPath = '';
    const proxyPrefix = '/proxy/'; // Match the 'from' path in netlify.toml
    if (event.path && event.path.startsWith(proxyPrefix)) {
        encodedUrlPath = event.path.substring(proxyPrefix.length);
        logDebug(`Extracted encoded path from event.path: ${encodedUrlPath}`);
    } else {
        logDebug(`Could not extract encoded path from event.path: ${event.path}`);
        // Potentially handle direct calls too? Less likely needed.
        // const functionPath = '/.netlify/functions/proxy/';
        // if (event.path && event.path.startsWith(functionPath)) {
        //     encodedUrlPath = event.path.substring(functionPath.length);
        // }
    }

    const targetUrl = getTargetUrlFromPath(encodedUrlPath);
    logDebug(`Resolved target URL: ${targetUrl || 'null'}`);

    if (!targetUrl) {
        logDebug('Error: Invalid proxy request path.');
        return {
            statusCode: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({ success: false, error: "Invalid proxy request path. Could not extract target URL." }),
        };
    }

    logDebug(`Processing proxy request for target: ${targetUrl}`);

    try {
        // 验证鉴权
        const isValidAuth = validateAuth(event);
        if (!isValidAuth) {
            return {
                statusCode: 403,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                body: JSON.stringify({ success: false, error: "Forbidden: Invalid auth credentials." }),
            };
        }

        // Fetch Original Content (Pass Netlify event headers)
        const { content, contentType, responseHeaders } = await fetchContentWithType(targetUrl, event.headers);

        // --- Process if M3U8 ---
        if (isM3u8Content(content, contentType)) {
            logDebug(`Processing M3U8 content: ${targetUrl}`);
            const processedM3u8 = await processM3u8Content(targetUrl, content);

            logDebug(`Successfully processed M3U8 for ${targetUrl}`);
            return {
                statusCode: 200,
                headers: {
                    ...corsHeaders, // Include CORS headers
                    'Content-Type': 'application/vnd.apple.mpegurl;charset=utf-8',
                    'Cache-Control': `public, max-age=${CACHE_TTL}`,
                    // Note: Do NOT include content-encoding or content-length from original response
                    // as node-fetch likely decompressed it and length changed.
                },
                body: processedM3u8, // Netlify expects body as string
            };
        } else {
            // --- Return Original Content (Non-M3U8) ---
            logDebug(`Returning non-M3U8 content directly: ${targetUrl}, Type: ${contentType}`);

            // Prepare headers for Netlify response object
            const netlifyHeaders = { ...corsHeaders };
            responseHeaders.forEach((value, key) => {
                 const lowerKey = key.toLowerCase();
                 // Exclude problematic headers and CORS headers (already added)
                 if (!lowerKey.startsWith('access-control-') &&
                     lowerKey !== 'content-encoding' &&
                     lowerKey !== 'content-length') {
                     netlifyHeaders[key] = value; // Add other original headers
                 }
             });
            netlifyHeaders['Cache-Control'] = `public, max-age=${CACHE_TTL}`; // Set our cache policy

            return {
                statusCode: 200,
                headers: netlifyHeaders,
                body: content, // Body as string
                // isBase64Encoded: false, // Set true only if returning binary data as base64
            };
        }

    } catch (error) {
        logDebug(`ERROR in proxy processing for ${targetUrl}: ${error.message}`);
        console.error(`[Proxy Error Stack Netlify] ${error.stack}`); // Log full stack

        const statusCode = error.status || 500; // Get status from error if available

        return {
            statusCode: statusCode,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: `Proxy processing error: ${error.message}`,
                targetUrl: targetUrl
            }),
        };
    }
};
