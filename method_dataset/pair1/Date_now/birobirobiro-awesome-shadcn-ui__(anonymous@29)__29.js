function __method_wrapper__() {
    (id: string) => {
      if (isLoading) return;

      const now = Date.now();
      if (
        lastClickedRef.current &&
        lastClickedRef.current.id === id &&
        now - lastClickedRef.current.timestamp < 300
      ) {
        return;
      }
      lastClickedRef.current = { id, timestamp: now };

      setBookmarkedItems((prevBookmarks) => {
        const isCurrentlyBookmarked = prevBookmarks.includes(id);
        const newBookmarks = isCurrentlyBookmarked
          ? prevBookmarks.filter((bookmarkId) => bookmarkId !== id)
          : [...prevBookmarks, id];

        try {
          localStorage.setItem("bookmarkedItems", JSON.stringify(newBookmarks));
          setError(null);
        } catch (err) {
          setError("Failed to save bookmark");
          return prevBookmarks;
        }

        return newBookmarks;
      });
    },

}
