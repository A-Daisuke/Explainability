export default async function handler(req, res) {
    // --- 记录请求开始 ---
    console.info('--- Vercel 代理请求开始 ---');
    console.info('时间:', new Date().toISOString());
    console.info('方法:', req.method);
    console.info('URL:', req.url); // 原始请求 URL (例如 /proxy/...)
    console.info('查询参数:', JSON.stringify(req.query)); // Vercel 解析的查询参数

    // --- 提前设置 CORS 头 ---
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*'); // 允许所有请求头

    // --- 处理 OPTIONS 预检请求 ---
    if (req.method === 'OPTIONS') {
        console.info("处理 OPTIONS 预检请求");
        res.status(204).setHeader('Access-Control-Max-Age', '86400').end(); // 缓存预检结果 24 小时
        return;
    }

    let targetUrl = null; // 初始化目标 URL

    try { // ---- 开始主处理逻辑的 try 块 ----

        // --- 验证鉴权 ---
        const isAuthorized = await validateAuth(req);
        if (!isAuthorized) {
            console.warn('代理请求鉴权失败');
            res.status(401).json({
                success: false,
                error: '代理访问未授权：请检查密码配置或鉴权参数'
            });
            return;
        }

        // --- 提取目标 URL (主要依赖 req.query["...path"]) ---
        // Vercel 将 :path* 捕获的内容（可能包含斜杠）放入 req.query["...path"] 数组
        const pathData = req.query["...path"]; // 使用正确的键名
        let encodedUrlPath = '';

        if (pathData) {
            if (Array.isArray(pathData)) {
                encodedUrlPath = pathData.join('/'); // 重新组合
                console.info(`从 req.query["...path"] (数组) 组合的编码路径: ${encodedUrlPath}`);
            } else if (typeof pathData === 'string') {
                encodedUrlPath = pathData; // 也处理 Vercel 可能只返回字符串的情况
                console.info(`从 req.query["...path"] (字符串) 获取的编码路径: ${encodedUrlPath}`);
            } else {
                console.warn(`[代理警告] req.query["...path"] 类型未知: ${typeof pathData}`);
            }
        } else {
            console.warn(`[代理警告] req.query["...path"] 为空或未定义。`);
            // 备选：尝试从 req.url 提取（如果需要）
            if (req.url && req.url.startsWith('/proxy/')) {
                encodedUrlPath = req.url.substring('/proxy/'.length);
                console.info(`使用备选方法从 req.url 提取的编码路径: ${encodedUrlPath}`);
            }
        }

        // 如果仍然为空，则无法继续
        if (!encodedUrlPath) {
             throw new Error("无法从请求中确定编码后的目标路径。");
        }

        // 解析目标 URL
        targetUrl = getTargetUrlFromPath(encodedUrlPath);
        console.info(`解析出的目标 URL: ${targetUrl || 'null'}`); // 记录解析结果

        // 检查目标 URL 是否有效
        if (!targetUrl) {
            // 抛出包含更多上下文的错误
            throw new Error(`无效的代理请求路径。无法从组合路径 "${encodedUrlPath}" 中提取有效的目标 URL。`);
        }

        console.info(`开始处理目标 URL 的代理请求: ${targetUrl}`);

        // --- 获取并处理目标内容 ---
        const { content, contentType, responseHeaders } = await fetchContentWithType(targetUrl, req.headers);

        // --- 如果是 M3U8，处理并返回 ---
        if (isM3u8Content(content, contentType)) {
            console.info(`正在处理 M3U8 内容: ${targetUrl}`);
            const processedM3u8 = await processM3u8Content(targetUrl, content);

            console.info(`成功处理 M3U8: ${targetUrl}`);
            // 发送处理后的 M3U8 响应
            res.status(200)
                .setHeader('Content-Type', 'application/vnd.apple.mpegurl;charset=utf-8')
                .setHeader('Cache-Control', `public, max-age=${CACHE_TTL}`)
                // 移除可能导致问题的原始响应头
                .removeHeader('content-encoding') // 很重要！node-fetch 已解压
                .removeHeader('content-length')   // 长度已改变
                .send(processedM3u8); // 发送 M3U8 文本

        } else {
            // --- 如果不是 M3U8，直接返回原始内容 ---
            console.info(`直接返回非 M3U8 内容: ${targetUrl}, 类型: ${contentType}`);

            // 设置原始响应头，但排除有问题的头和 CORS 头（已设置）
            responseHeaders.forEach((value, key) => {
                 const lowerKey = key.toLowerCase();
                 if (!lowerKey.startsWith('access-control-') &&
                     lowerKey !== 'content-encoding' && // 很重要！
                     lowerKey !== 'content-length') {   // 很重要！
                     res.setHeader(key, value); // 设置其他原始头
                 }
             });
            // 设置我们自己的缓存策略
            res.setHeader('Cache-Control', `public, max-age=${CACHE_TTL}`);

            // 发送原始（已解压）内容
            res.status(200).send(content);
        }

    // ---- 结束主处理逻辑的 try 块 ----
    } catch (error) { // ---- 捕获处理过程中的任何错误 ----
        // **检查这个错误是否是 "Assignment to constant variable"**
        console.error(`[代理错误处理 V3] 捕获错误！目标: ${targetUrl || '解析失败'} | 错误类型: ${error.constructor.name} | 错误消息: ${error.message}`);
        console.error(`[代理错误堆栈 V3] ${error.stack}`); // 记录完整的错误堆栈信息

        // 特别标记 "Assignment to constant variable" 错误
        if (error instanceof TypeError && error.message.includes("Assignment to constant variable")) {
             console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
             console.error("捕获到 'Assignment to constant variable' 错误!");
             console.error("请再次检查函数代码及所有辅助函数中，是否有 const 声明的变量被重新赋值。");
             console.error("错误堆栈指向:", error.stack);
             console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        }

        // 尝试从错误对象获取状态码，否则默认为 500
        const statusCode = error.status || 500;

        // 确保在发送错误响应前没有发送过响应头
        if (!res.headersSent) {
             res.setHeader('Content-Type', 'application/json');
             // CORS 头应该已经在前面设置好了
             res.status(statusCode).json({
                success: false,
                error: `代理处理错误: ${error.message}`, // 返回错误消息给前端
                targetUrl: targetUrl // 包含目标 URL 以便调试
            });
        } else {
            // 如果响应头已发送，无法再发送 JSON 错误
            console.error("[代理错误处理 V3] 响应头已发送，无法发送 JSON 错误响应。");
            // 尝试结束响应
             if (!res.writableEnded) {
                 res.end();
             }
        }
    } finally {
         // 记录请求处理结束
         console.info('--- Vercel 代理请求结束 ---');
    }
}
