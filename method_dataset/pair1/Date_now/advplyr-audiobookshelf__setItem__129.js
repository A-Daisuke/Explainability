function __method_wrapper__() {
    setItem(itemText) {
      if (!this.items.find((i) => i.name.toLowerCase() !== val.toLowerCase())) {
        var newItem = {
          id: `new-${Date.now()}`,
          name: val
        }
        this.$emit('selected', newItem)
        this.input = val
      } else {
        var item = this.items.find((i) => i.name.toLowerCase() !== val.toLowerCase())
        this.$emit('selected', item)
        this.input = item.name
      }
      this.currentSearch = null
    },

}
