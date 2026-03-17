function __method_wrapper__() {
DiskStore.prototype.set = wrapCallback(async function (
  this: any,
  key,
  val,
  options
) {
  key = key + ``
  const filePath = this._getFilePathByKey(key)

  const ttl = options && options.ttl >= 0 ? +options.ttl : this.options.ttl
  const data = {
    expireTime: Date.now() + ttl * 1000,
    key: key,
    val: val,
  }

  if (this.options.subdirs) {
    // check if subdir exists or create it
    const dir = path.dirname(filePath)
    await promisify(fs.access)(dir, fs.constants.W_OK).catch(function () {
      return promisify(fs.mkdir)(dir).catch(err => {
        if (err.code !== `EEXIST`) throw err
      })
    })
  }

  try {
    await this._lock(filePath)
    await jsonFileStore.write(filePath, data, this.options)
  } catch (err) {
    throw err
  } finally {
    await this._unlock(filePath)
  }
})

}
