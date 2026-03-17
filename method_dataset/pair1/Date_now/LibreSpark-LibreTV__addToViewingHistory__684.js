function addToViewingHistory(videoInfo) {
    // 密码保护校验
    if (window.isPasswordProtected && window.isPasswordVerified) {
        if (window.isPasswordProtected() && !window.isPasswordVerified()) {
            showPasswordModal && showPasswordModal();
            return;
        }
    }
    try {
        const history = getViewingHistory();

        // Ensure videoInfo has a showIdentifier
        if (!videoInfo.showIdentifier) {
            if (videoInfo.sourceName && videoInfo.vod_id) {
                videoInfo.showIdentifier = `${videoInfo.sourceName}_${videoInfo.vod_id}`;
            } else {
                // Fallback if critical IDs are missing for the preferred identifier
                videoInfo.showIdentifier = (videoInfo.episodes && videoInfo.episodes.length > 0) ? videoInfo.episodes[0] : videoInfo.directVideoUrl;
                // console.warn(`addToViewingHistory: videoInfo for "${videoInfo.title}" was missing sourceName or vod_id for preferred showIdentifier. Generated fallback: ${videoInfo.showIdentifier}`);
            }
        }

        const existingIndex = history.findIndex(item =>
            item.title === videoInfo.title &&
            item.sourceName === videoInfo.sourceName &&
            item.showIdentifier === videoInfo.showIdentifier // Strict check using the determined showIdentifier
        );

        if (existingIndex !== -1) {
            // Exact match with showIdentifier: Update existing series entry
            const existingItem = history[existingIndex];
            existingItem.episodeIndex = videoInfo.episodeIndex;
            existingItem.timestamp = Date.now();
            existingItem.sourceName = videoInfo.sourceName || existingItem.sourceName;
            existingItem.sourceCode = videoInfo.sourceCode || existingItem.sourceCode;
            existingItem.vod_id = videoInfo.vod_id || existingItem.vod_id;
            existingItem.directVideoUrl = videoInfo.directVideoUrl || existingItem.directVideoUrl;
            existingItem.url = videoInfo.url || existingItem.url;
            existingItem.playbackPosition = videoInfo.playbackPosition > 10 ? videoInfo.playbackPosition : (existingItem.playbackPosition || 0);
            existingItem.duration = videoInfo.duration || existingItem.duration;

            if (videoInfo.episodes && Array.isArray(videoInfo.episodes) && videoInfo.episodes.length > 0) {
                if (!existingItem.episodes ||
                    !Array.isArray(existingItem.episodes) ||
                    existingItem.episodes.length !== videoInfo.episodes.length ||
                    !videoInfo.episodes.every((ep, i) => ep === existingItem.episodes[i])) {
                    existingItem.episodes = [...videoInfo.episodes];
                    // console.log(`更新 (addToViewingHistory) "${videoInfo.title}" 的剧集数据: ${videoInfo.episodes.length}集`);
                }
            }

            history.splice(existingIndex, 1);
            history.unshift(existingItem);
            // console.log(`更新历史记录 (addToViewingHistory): "${videoInfo.title}", 第 ${videoInfo.episodeIndex !== undefined ? videoInfo.episodeIndex + 1 : 'N/A'} 集`);
        } else {
            // No exact match: Add as a new entry
            const newItem = {
                ...videoInfo, // Includes the showIdentifier we ensured is present
                timestamp: Date.now()
            };

            if (videoInfo.episodes && Array.isArray(videoInfo.episodes)) {
                newItem.episodes = [...videoInfo.episodes];
            } else {
                newItem.episodes = [];
            }

            history.unshift(newItem);
            // console.log(`创建新的历史记录 (addToViewingHistory): "${videoInfo.title}", Episode: ${videoInfo.episodeIndex !== undefined ? videoInfo.episodeIndex + 1 : 'N/A'}`);
        }

        // 限制历史记录数量为50条
        const maxHistoryItems = 50;
        if (history.length > maxHistoryItems) {
            history.splice(maxHistoryItems);
        }

        // 保存到本地存储
        localStorage.setItem('viewingHistory', JSON.stringify(history));
    } catch (e) {
        // console.error('保存观看历史失败:', e);
    }
}
