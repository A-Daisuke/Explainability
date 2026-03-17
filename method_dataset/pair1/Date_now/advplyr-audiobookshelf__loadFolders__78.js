class __C__ {
  loadFolders({ state, commit }) {
    if (state.folders.length) {
      const lastCheck = Date.now() - state.folderLastUpdate
      if (lastCheck < 1000 * 5) {
        // 5 seconds
        // Folders up to date
        return state.folders
      }
    }
    commit('setFoldersLastUpdate')

    return this.$axios
      .$get('/api/filesystem')
      .then((res) => {
        commit('setFolders', res.directories)
        return res.directories
      })
      .catch((error) => {
        console.error('Failed to load dirs', error)
        commit('setFolders', [])
        return []
      })
  },

}
