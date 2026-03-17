function startLoading(
  element: HTMLElement,
  cacheKey: string,
  imageCache: Set<string>,
  onStartLoad: GatsbyImageProps["onStartLoad"],
  onLoad: GatsbyImageProps["onLoad"],
  onError: GatsbyImageProps["onError"]
): () => void {
  const mainImage = element.querySelector(
    `[data-main-image]`
  ) as HTMLImageElement
  const placeholderImage = element.querySelector<HTMLElement>(
    `[data-placeholder-image]`
  )
  const isCached = imageCache.has(cacheKey)

  function onImageLoaded(e): void {
    // eslint-disable-next-line @babel/no-invalid-this
    this.removeEventListener(`load`, onImageLoaded)

    const target = e.currentTarget
    const img = new Image()
    img.src = target.currentSrc

    if (img.decode) {
      // Decode the image through javascript to support our transition
      img
        .decode()
        .then(() => {
          // eslint-disable-next-line @babel/no-invalid-this
          toggleLoaded(this, placeholderImage)
          onLoad?.({
            wasCached: isCached,
          })
        })
        .catch(e => {
          // eslint-disable-next-line @babel/no-invalid-this
          toggleLoaded(this, placeholderImage)
          onError?.(e)
        })
    } else {
      // eslint-disable-next-line @babel/no-invalid-this
      toggleLoaded(this, placeholderImage)
      onLoad?.({
        wasCached: isCached,
      })
    }
  }

  mainImage.addEventListener(`load`, onImageLoaded)

  onStartLoad?.({
    wasCached: isCached,
  })
  Array.from(mainImage.parentElement.children).forEach(child => {
    const src = child.getAttribute(`data-src`)
    const srcSet = child.getAttribute(`data-srcset`)
    if (src) {
      child.removeAttribute(`data-src`)
      child.setAttribute(`src`, src)
    }
    if (srcSet) {
      child.removeAttribute(`data-srcset`)
      child.setAttribute(`srcset`, srcSet)
    }
  })

  imageCache.add(cacheKey)

  // Load times not always fires - mostly when it's a 304
  // We check if the image is already completed and if so we trigger onload.
  if (mainImage.complete) {
    onImageLoaded.call(mainImage, {
      currentTarget: mainImage,
    })
  }

  return (): void => {
    if (mainImage) {
      mainImage.removeEventListener(`load`, onImageLoaded)
    }
  }
}
