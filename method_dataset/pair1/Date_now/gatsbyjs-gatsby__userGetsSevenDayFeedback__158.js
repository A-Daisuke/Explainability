export async function userGetsSevenDayFeedback(): Promise<boolean> {
  if (isFeedbackDisabled()) return false

  if (getConfigStore().get(sevenDayKey)) return false

  const firstDateValue = getConfigStore().get(firstDateKey)

  if (!firstDateValue) {
    getConfigStore().set(firstDateKey, Date.now()) // set this for the first time
    return false
  } else {
    const lastDate = new Date(firstDateValue)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    if (lastDate > sevenDaysAgo) {
      return false
    }
  }
  return true
}
