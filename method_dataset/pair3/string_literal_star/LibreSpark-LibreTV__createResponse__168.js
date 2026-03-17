    function createResponse(body, status = 200, headers = {}) {
        const responseHeaders = new Headers(headers);
        // 关键：添加 CORS 跨域头，允许前端 JS 访问代理后的响应
        responseHeaders.set("Access-Control-Allow-Origin", "*"); // 允许任何来源访问
        responseHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, POST, OPTIONS"); // 允许的方法
        responseHeaders.set("Access-Control-Allow-Headers", "*"); // 允许所有请求头

        // 处理 CORS 预检请求 (OPTIONS) - 放在这里确保所有响应都处理
         if (request.method === "OPTIONS") {
             // 使用下面的 onOptions 函数可以更规范，但在这里处理也可以
             return new Response(null, {
                 status: 204, // No Content
                 headers: responseHeaders // 包含上面设置的 CORS 头
             });
         }

        return new Response(body, { status, headers: responseHeaders });
    }
