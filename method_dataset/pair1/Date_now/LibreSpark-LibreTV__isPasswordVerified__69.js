function isPasswordVerified() {
    try {
        if (!isPasswordProtected()) return true;

        const stored = localStorage.getItem(PASSWORD_CONFIG.localStorageKey);
        if (!stored) return false;

        const { timestamp, passwordHash } = JSON.parse(stored);
        const currentHash = window.__ENV__?.PASSWORD;

        return timestamp && passwordHash === currentHash &&
            Date.now() - timestamp < PASSWORD_CONFIG.verificationTTL;
    } catch (error) {
        console.error('检查密码验证状态时出错:', error);
        return false;
    }
}
