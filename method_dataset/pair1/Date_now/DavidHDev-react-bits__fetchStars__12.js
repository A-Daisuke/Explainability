    const fetchStars = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
          const { count, timestamp } = JSON.parse(cachedData);
          const now = Date.now();

          if (now - timestamp < CACHE_DURATION) {
            setStars(count);
            return;
          }
        }

        const count = await getStarsCount();

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            count,
            timestamp: Date.now()
          })
        );

        setStars(count);
      } catch (error) {
        console.error('Error fetching stars:', error);

        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { count } = JSON.parse(cachedData);
          setStars(count);
        }
      }
    };
