function __method_wrapper__() {
  dequeue() {
    if (this.checkEmpty()) {
      // UNDERFLOW
      return
    }
    const y = this.queue[this.front]
    this.queue[this.front] = '*'
    if (!this.checkSingleelement()) {
      if (this.front === this.maxLength) this.front = 1
      else {
        this.front += 1
      }
    }

    return y // Returns the removed element and replaces it with a star
  }

}
