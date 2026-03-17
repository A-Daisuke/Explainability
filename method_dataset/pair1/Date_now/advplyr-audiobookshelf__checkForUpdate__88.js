function __method_wrapper__() {
  checkForUpdate({ commit }) {
    const VERSION_CHECK_BUFF = 1000 * 60 * 5 // 5 minutes
    var lastVerCheck = localStorage.getItem('lastVerCheck') || 0
    var savedVersionData = localStorage.getItem('versionData')
    if (savedVersionData) {
      try {
        savedVersionData = JSON.parse(localStorage.getItem('versionData'))
      } catch (error) {
        console.error('Failed to parse version data', error)
        savedVersionData = null
        localStorage.removeItem('versionData')
      }
    }

    var shouldCheckForUpdate = Date.now() - Number(lastVerCheck) > VERSION_CHECK_BUFF
    if (!shouldCheckForUpdate && savedVersionData && (savedVersionData.version !== currentVersion || !savedVersionData.releasesToShow)) {
      // Version mismatch between saved data so check for update anyway
      shouldCheckForUpdate = true
    }

    if (shouldCheckForUpdate) {
      return checkForUpdate()
        .then((res) => {
          if (res) {
            localStorage.setItem('lastVerCheck', Date.now())
            localStorage.setItem('versionData', JSON.stringify(res))

            commit('setVersionData', res)
          }
          return res && res.hasUpdate
        })
        .catch((error) => {
          console.error('Update check failed', error)
          return false
        })
    } else if (savedVersionData) {
      commit('setVersionData', savedVersionData)
    }
    return null
  }

}
