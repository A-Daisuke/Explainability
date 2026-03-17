function saveSearchHistory(query) {
    if (!query || !query.trim()) return;

    // 清理输入，防止XSS
    query = query.trim().substring(0, 50).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let history = getSearchHistory();

    // 获取当前时间
    const now = Date.now();

    // 过滤掉超过2个月的记录（约60天，60*24*60*60*1000 = 5184000000毫秒）
    history = history.filter(item =>
        typeof item === 'object' && item.timestamp && (now - item.timestamp < 5184000000)
    );

    // 删除已存在的相同项
    history = history.filter(item =>
        typeof item === 'object' ? item.text !== query : item !== query
    );

    // 新项添加到开头，包含时间戳
    history.unshift({
        text: query,
        timestamp: now
    });

    // 限制历史记录数量
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('保存搜索历史失败:', e);
        // 如果存储失败（可能是localStorage已满），尝试清理旧数据
        try {
            localStorage.removeItem(SEARCH_HISTORY_KEY);
            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, 3)));
        } catch (e2) {
            console.error('再次保存搜索历史失败:', e2);
        }
    }

    renderSearchHistory();
}
