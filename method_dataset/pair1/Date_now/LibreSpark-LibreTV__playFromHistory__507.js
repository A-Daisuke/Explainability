async function playFromHistory(url, title, episodeIndex, playbackPosition = 0) {
    // console.log('[playFromHistory in ui.js] Called with:', { url, title, episodeIndex, playbackPosition }); // Log 1
    try {
        let episodesList = [];
        let historyItem = null; // To store the full history item
        let syncSuccessful = false;

        // 检查viewingHistory，查找匹配的项
        const historyRaw = localStorage.getItem('viewingHistory');
        if (historyRaw) {
            const history = JSON.parse(historyRaw);
            historyItem = history.find(item => item.url === url);
            // console.log('[playFromHistory in ui.js] Found historyItem:', historyItem ? JSON.parse(JSON.stringify(historyItem)) : null); // Log 2 (stringify/parse for deep copy)
            if (historyItem) {
                // console.log('[playFromHistory in ui.js] historyItem.vod_id:', historyItem.vod_id, 'historyItem.sourceName:', historyItem.sourceName); // Log 3
            }

            if (historyItem && historyItem.episodes && Array.isArray(historyItem.episodes)) {
                episodesList = historyItem.episodes; // Default to stored episodes
                // console.log(`从历史记录找到视频 "${title}" 的集数数据 (默认):`, episodesList.length);
            }
        }

        // Always attempt to fetch fresh episode list if we have the necessary info
        if (historyItem && historyItem.vod_id && historyItem.sourceName) {
            // Show loading toast to indicate syncing
            showToast('正在同步最新剧集列表...', 'info');

            // console.log(`[playFromHistory in ui.js] Attempting to fetch details for vod_id: ${historyItem.vod_id}, sourceName: ${historyItem.sourceName}`); // Log 4
            try {
                // Construct the API URL for detail fetching
                // historyItem.sourceName is used as the sourceCode here
                // Add a cache buster timestamp
                const timestamp = new Date().getTime();
                const apiUrl = `/api/detail?id=${encodeURIComponent(historyItem.vod_id)}&source=${encodeURIComponent(historyItem.sourceName)}&_t=${timestamp}`;

                // Add timeout to the fetch request
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                const response = await fetch(apiUrl, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                const videoDetails = await response.json();

                if (videoDetails && videoDetails.episodes && videoDetails.episodes.length > 0) {
                    const oldEpisodeCount = episodesList.length;
                    episodesList = videoDetails.episodes;
                    syncSuccessful = true;

                    // Show success message with episode count info
                    const newEpisodeCount = episodesList.length;
                    if (newEpisodeCount > oldEpisodeCount) {
                        showToast(`已同步最新剧集列表 (${newEpisodeCount}集，新增${newEpisodeCount - oldEpisodeCount}集)`, 'success');
                    } else if (newEpisodeCount === oldEpisodeCount) {
                        showToast(`剧集列表已是最新 (${newEpisodeCount}集)`, 'success');
                    } else {
                        showToast(`已同步最新剧集列表 (${newEpisodeCount}集)`, 'success');
                    }

                    // console.log(`成功获取 "${title}" 最新剧集列表:`, episodesList.length, "集");
                    // Update the history item in localStorage with the fresh episodes
                    if (historyItem) {
                        historyItem.episodes = [...episodesList]; // Deep copy
                        historyItem.lastSyncTime = Date.now(); // Add sync timestamp
                        const history = JSON.parse(historyRaw); // Re-parse to ensure we have the latest version
                        const idx = history.findIndex(item => item.url === url);
                        if (idx !== -1) {
                            history[idx] = { ...history[idx], ...historyItem }; // Merge, ensuring other properties are kept
                            localStorage.setItem('viewingHistory', JSON.stringify(history));
                            // console.log("观看历史中的剧集列表已更新。");
                        }
                    }
                } else {
                    // console.log(`未能获取 "${title}" 的最新剧集列表，或列表为空。将使用已存储的剧集。`);
                    showToast('未获取到最新剧集信息，使用缓存数据', 'warning');
                }
            } catch (fetchError) {
                // console.error(`获取 "${title}" 最新剧集列表失败:`, fetchError, "将使用已存储的剧集。");
                if (fetchError.name === 'AbortError') {
                    showToast('同步剧集列表超时，使用缓存数据', 'warning');
                } else {
                    showToast('同步剧集列表失败，使用缓存数据', 'warning');
                }
            }
        } else if (historyItem) {
            // console.log(`历史记录项 "${title}" 缺少 vod_id 或 sourceName，无法刷新剧集列表。将使用已存储的剧集。`);
            showToast('无法同步剧集列表，使用缓存数据', 'info');
        }


        // 如果在历史记录中没找到，尝试使用上一个会话的集数数据
        if (episodesList.length === 0) {
            try {
                const storedEpisodes = JSON.parse(localStorage.getItem('currentEpisodes') || '[]');
                if (storedEpisodes.length > 0) {
                    episodesList = storedEpisodes;
                    // console.log(`使用localStorage中的集数数据:`, episodesList.length);
                }
            } catch (e) {
                // console.error('解析currentEpisodes失败:', e);
            }
        }

        // 将剧集列表保存到localStorage，播放器页面会读取它
        if (episodesList.length > 0) {
            localStorage.setItem('currentEpisodes', JSON.stringify(episodesList));
            // console.log(`已将剧集列表保存到localStorage，共 ${episodesList.length} 集`);
        }

        // 保存当前页面URL作为返回地址
        let currentPath;
        if (window.location.pathname.startsWith('/player.html') || window.location.pathname.startsWith('/watch.html')) {
            currentPath = localStorage.getItem('lastPageUrl') || '/';
        } else {
            currentPath = window.location.origin + window.location.pathname + window.location.search;
        }
        localStorage.setItem('lastPageUrl', currentPath);

        // 构造播放器URL
        let playerUrl;
        const sourceNameForUrl = historyItem ? historyItem.sourceName : (new URLSearchParams(new URL(url, window.location.origin).search)).get('source');
        const sourceCodeForUrl = historyItem ? historyItem.sourceCode || historyItem.sourceName : (new URLSearchParams(new URL(url, window.location.origin).search)).get('source_code');
        const idForUrl = historyItem ? historyItem.vod_id : '';


        if (url.includes('player.html') || url.includes('watch.html')) {
            // console.log('检测到嵌套播放链接，解析真实URL');
            try {
                const nestedUrl = new URL(url, window.location.origin);
                const nestedParams = nestedUrl.searchParams;
                const realVideoUrl = nestedParams.get('url') || url;

                playerUrl = `player.html?url=${encodeURIComponent(realVideoUrl)}&title=${encodeURIComponent(title)}&index=${episodeIndex}&position=${Math.floor(playbackPosition || 0)}&returnUrl=${encodeURIComponent(currentPath)}`;
                if (sourceNameForUrl) playerUrl += `&source=${encodeURIComponent(sourceNameForUrl)}`;
                if (sourceCodeForUrl) playerUrl += `&source_code=${encodeURIComponent(sourceCodeForUrl)}`;
                if (idForUrl) playerUrl += `&id=${encodeURIComponent(idForUrl)}`;


            } catch (e) {
                // console.error('解析嵌套URL出错:', e);
                playerUrl = `player.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&index=${episodeIndex}&position=${Math.floor(playbackPosition || 0)}&returnUrl=${encodeURIComponent(currentPath)}`;
                if (sourceNameForUrl) playerUrl += `&source=${encodeURIComponent(sourceNameForUrl)}`;
                if (sourceCodeForUrl) playerUrl += `&source_code=${encodeURIComponent(sourceCodeForUrl)}`;
                if (idForUrl) playerUrl += `&id=${encodeURIComponent(idForUrl)}`;
            }
        } else {
             // This case should ideally not happen if 'url' is always a player.html link from history
            // console.warn("Playing from history with a non-player.html URL structure. This might be an issue.");
            const playUrl = new URL(url, window.location.origin);
            if (!playUrl.searchParams.has('index') && episodeIndex > 0) {
                playUrl.searchParams.set('index', episodeIndex);
            }
            playUrl.searchParams.set('position', Math.floor(playbackPosition || 0).toString());
            playUrl.searchParams.set('returnUrl', encodeURIComponent(currentPath));
            if (sourceNameForUrl) playUrl.searchParams.set('source', sourceNameForUrl);
            if (sourceCodeForUrl) playUrl.searchParams.set('source_code', sourceCodeForUrl);
            if (idForUrl) playUrl.searchParams.set('id', idForUrl);
            playerUrl = playUrl.toString();
        }

        showVideoPlayer(playerUrl);
    } catch (e) {
        // console.error('从历史记录播放失败:', e);
        const simpleUrl = `player.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&index=${episodeIndex}`;
        showVideoPlayer(simpleUrl);
    }
}
