    async function validateAuth(request, env) {
        const url = new URL(request.url);
        const authHash = url.searchParams.get('auth');
        const timestamp = url.searchParams.get('t');
        
        // 获取服务器端密码
        const serverPassword = env.PASSWORD;
        if (!serverPassword) {
            console.error('服务器未设置 PASSWORD 环境变量，代理访问被拒绝');
            return false;
        }
        
        // 使用 SHA-256 哈希算法（与其他平台保持一致）
        // 在 Cloudflare Workers 中使用 crypto.subtle
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(serverPassword);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const serverPasswordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            if (!authHash || authHash !== serverPasswordHash) {
                console.warn('代理请求鉴权失败：密码哈希不匹配');
                return false;
            }
        } catch (error) {
            console.error('计算密码哈希失败:', error);
            return false;
        }
        
        // 验证时间戳（10分钟有效期）
        if (timestamp) {
            const now = Date.now();
            const maxAge = 10 * 60 * 1000; // 10分钟
            if (now - parseInt(timestamp) > maxAge) {
                console.warn('代理请求鉴权失败：时间戳过期');
                return false;
            }
        }
        
        return true;
    }
