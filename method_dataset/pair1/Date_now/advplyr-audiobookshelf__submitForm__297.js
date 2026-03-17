class __C__ {
    submitForm() {
      if (!this.textInput || !this.textInput.trim?.()) return

      this.textInput = this.textInput.trim()

      const matchesItem = this.items.find((i) => {
        return i.name === this.textInput
      })

      if (matchesItem) {
        this.clickedOption(null, matchesItem)
      } else {
        this.insertNewItem({
          id: `new-${Date.now()}`,
          name: this.textInput
        })
      }
      if (this.$refs.input) this.$refs.input.style.width = '24px'
    },

}
