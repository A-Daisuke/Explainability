function __method_wrapper__() {
      setTimeout(() => {
        const pastedText = evt.target?.value || ''
        console.log('Pasted text=', pastedText)
        const pastedItems = [
          ...new Set(
            pastedText
              .split(';')
              .map((i) => i.trim())
              .filter((i) => i)
          )
        ]

        // Filter out items already selected
        const itemsToAdd = pastedItems.filter((i) => !this.selected.some((_i) => _i[this.textKey].toLowerCase() === i.toLowerCase()))
        if (pastedItems.length && !itemsToAdd.length) {
          this.textInput = null
          this.currentSearch = null
        } else {
          for (const [index, itemToAdd] of itemsToAdd.entries()) {
            this.insertNewItem({
              id: `new-${Date.now()}-${index}`,
              name: itemToAdd
            })
          }
        }
      }, 10)

}
