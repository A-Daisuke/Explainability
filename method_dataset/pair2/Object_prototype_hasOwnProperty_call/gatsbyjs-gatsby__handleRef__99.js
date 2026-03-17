class __C__ {
  handleRef(ref) {
    if (
      this.props.innerRef &&
      Object.prototype.hasOwnProperty.call(this.props.innerRef, `current`)
    ) {
      this.props.innerRef.current = ref
    } else if (this.props.innerRef) {
      this.props.innerRef(ref)
    }

    if (this.state.IOSupported && ref) {
      // If IO supported and element reference found, setup Observer functionality
      this.io = createIntersectionObserver(ref, inViewPort => {
        if (inViewPort) {
          this.abortPrefetch = this._prefetch()
        } else {
          if (this.abortPrefetch) {
            this.abortPrefetch.abort()
          }
        }
      })
    }
  }

}
