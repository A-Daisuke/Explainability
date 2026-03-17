function recursiveAddFields(ent, newEnt) {
  for (const k of Object.keys(ent)) {
    if (!newEnt.hasOwnProperty(k)) {
      const key = getValidKey(k)
      newEnt[key] = ent[k]
      // Nested Objects & Arrays of Objects
      if (typeof ent[key] === `object`) {
        if (!Array.isArray(ent[key]) && ent[key] != null) {
          newEnt[key] = recursiveAddFields(ent[key], {})
        } else if (Array.isArray(ent[key])) {
          if (ent[key].length > 0 && typeof ent[key][0] === `object`) {
            ent[k].map((el, i) => {
              newEnt[key][i] = recursiveAddFields(el, {})
            })
          }
        }
      }
    }
  }
  return newEnt
}
