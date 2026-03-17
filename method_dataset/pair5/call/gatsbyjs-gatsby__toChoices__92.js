class __C__ {
  async toChoices(value, parent) {
    const footer = [
      {
        role: `separator`,
      },
      {
        message: this.styles.bold(`Done`),
        name: `___done`,
      },
    ]

    if (typeof value === `function`) {
      value = await value.call(this)
    }
    if (value instanceof Promise) {
      value = await value
    }

    return super.toChoices([...value, ...footer], parent)
  }

}
