function validateAuth(event) {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const authHash = params.get('auth');
    const timestamp = params.get('t');
    
    // 获取服务器端密码哈希
    const serverPassword = process.env.PASSWORD;
    if (!serverPassword) {
        console.error('服务器未设置 PASSWORD 环境变量，代理访问被拒绝');
        return false;
    }
    
    // 使用 crypto 模块计算 SHA-256 哈希
    const serverPasswordHash = crypto.createHash('sha256').update(serverPassword).digest('hex');
    
    if (!authHash || authHash !== serverPasswordHash) {
        console.warn('代理请求鉴权失败：密码哈希不匹配');
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
