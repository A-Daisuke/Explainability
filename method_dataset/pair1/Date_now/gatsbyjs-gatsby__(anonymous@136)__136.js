function __method_wrapper__() {
DiskStore.prototype.get = wrapCallback(async function (this: any, key) {
  key = key + ``
  const filePath = this._getFilePathByKey(key)

  try {
    const data = await jsonFileStore
      .read(filePath, this.options)
      .catch(async err => {
        if (err.code === `ENOENT`) {
          throw err
        }
        // maybe the file is currently written to, lets lock it and read again
        try {
          await this._lock(filePath)
          return await jsonFileStore.read(filePath, this.options)
        } catch (err2) {
          throw err2
        } finally {
          await this._unlock(filePath)
        }
      })
    if (data.expireTime <= Date.now()) {
      // cache expired
      this.del(key).catch(() => 0 /* ignore */)
      return undefined
    }
    if (data.key !== key) {
      // hash collision
      return undefined
    }
    return data.val
  } catch (err) {
    // file does not exist lets return a cache miss
    if (err.code === `ENOENT`) {
      return undefined
    } else {
      throw err
    }
  }
})

}
