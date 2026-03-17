class __C__ {
  async uploadFile(file) {
    const { content, isText } = await readAsText(file)
    if (isText) {
      console.log(`Extracted ${content.length} characters from ${file.name}`)
      return {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        extracted_content: content,
      }
    }
    const fd = new FormData()
    fd.append('file', file, file.name)
    fd.append('orgUuid', this.organizationId)
    const response = await this.request('/api/convert_document', {
      headers: {
        cookie: `sessionKey=${this.sessionKey}`,
      },
      method: 'POST',
      body: fd,
    })
    let json
    try {
      json = await response.json()
    } catch (e) {
      console.log("Couldn't parse JSON", response.status)
      throw new Error('Invalid response when uploading ' + file.name)
    }
    if (response.status !== 200) {
      console.log('Status not 200')
      throw new Error('Invalid response when uploading ' + file.name)
    }
    if (!json.hasOwnProperty('extracted_content')) {
      console.log(json)
      throw new Error('Invalid response when uploading ' + file.name)
    }
    console.log(`Extracted ${json.extracted_content.length} characters from ${file.name}`)
    return json
  }

}
