function __method_wrapper__() {
    openShare() {
      if (!this.newShareSlug) {
        this.$toast.error(this.$strings.ToastSlugRequired)
        return
      }
      const payload = {
        slug: this.newShareSlug,
        mediaItemType: 'book',
        mediaItemId: this.libraryItem.media.id,
        expiresAt: this.expireDurationSeconds ? Date.now() + this.expireDurationSeconds * 1000 : 0,
        isDownloadable: this.isDownloadable
      }
      this.processing = true
      this.$axios
        .$post(`/api/share/mediaitem`, payload)
        .then((data) => {
          this.currentShare = data
          this.$emit('opened', data)
        })
        .catch((error) => {
          console.error('openShare', error)
          let errorMsg = error.response?.data || 'Failed to share item'
          this.$toast.error(errorMsg)
        })
        .finally(() => {
          this.processing = false
        })
    },

}
