  const fetchVideos = useCallback(async () => {
    if (!CLOUD_FEATURES_ENABLED) {
      // show only local placeholder videos
      return;
    }

    const now = Date.now();

    if (
      !contentState.isSubscribed ||
      loading ||
      !hasMore ||
      now - lastFetchTimeRef.current < FETCH_COOLDOWN_MS
    ) {
      return;
    }

    lastFetchTimeRef.current = now;

    const cacheKey = `${sortBy}-${pageRef.current}`;
    if (fetchedPagesRef.current.has(cacheKey)) return;
    fetchedPagesRef.current.add(cacheKey);
    setLoading(true);

    try {
      if (videoCacheRef.current[cacheKey]) {
        const cachedVideos = videoCacheRef.current[cacheKey];
        setVideos((prev) => [...prev, ...cachedVideos]);

        if (cachedVideos.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          pageRef.current += 1;
        }

        return;
      }

      const response = await chrome.runtime.sendMessage({
        type: "fetch-videos",
        page: pageRef.current,
        pageSize: PAGE_SIZE,
        sort: sortBy,
        filter,
      });

      if (!response?.success) {
        console.error("❌ Failed to fetch videos:", response?.error);
        setError(response?.error || "Failed to load videos");
        setHasMore(false);
        return;
      }

      const newVideos = response.videos || [];
      setVideos((prev) => [...prev, ...newVideos]);

      if (newVideos.length > 0) {
        videoCacheRef.current[cacheKey] = newVideos;
        chrome.storage.local.set({
          [VIDEO_CACHE_STORAGE_KEY]: videoCacheRef.current,
        });
      }

      if (newVideos.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        pageRef.current += 1;
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      setError("Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, contentState.isSubscribed, sortBy]);
