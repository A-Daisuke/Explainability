export function showExperimentNoticeAfterTimeout(
  experimentIdentifier: string,
  umbrellaLink: string,
  noticeText: string,
  showNoticeAfterMs: number,
  minimumIntervalBetweenNoticesMs: number = ONE_DAY
): CancelExperimentNoticeCallbackOrUndefined {
  const lastTimeWeShowedNotice = getConfigStore().get(
    configStoreKey(experimentIdentifier)
  )

  if (lastTimeWeShowedNotice) {
    if (Date.now() - lastTimeWeShowedNotice < minimumIntervalBetweenNoticesMs) {
      return undefined
    }
  }

  const noticeTimeout = setTimeout(() => {
    noticesToShow.push({ noticeText, umbrellaLink, experimentIdentifier })
  }, showNoticeAfterMs)

  return function clearNoticeTimeout(): void {
    clearTimeout(noticeTimeout)
  }
}
