function __method_wrapper__() {
  load({ state, commit, rootState }) {
    if (!rootState.user || !rootState.user.user) {
      console.error('libraries/load - User not set')
      return false
    }

    // Don't load again if already loaded in the last 5 minutes
    var lastLoadDiff = Date.now() - state.lastLoad
    if (lastLoadDiff < 5 * 60 * 1000) {
      // Already up to date
      return false
    }

    this.$axios
      .$get(`/api/libraries`)
      .then((data) => {
        commit('set', data.libraries)
        commit('setLastLoad', new Date())
      })
      .catch((error) => {
        console.error('Failed', error)
        commit('set', [])
      })
    return true
  }

}
