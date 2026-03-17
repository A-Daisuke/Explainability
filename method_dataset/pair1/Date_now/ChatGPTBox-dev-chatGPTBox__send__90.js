function __method_wrapper__() {
  async send(prompt, conversationObj) {
    let conversation = {
      id: conversationObj.id || '',
      c: conversationObj.c || '',
      r: conversationObj.r || '',
      rc: conversationObj.rc || '',
      lastActive: Date.now(),
    }
    // eslint-disable-next-line
    try {
      let { at, bl } = await this.GetRequestParams()
      const response = await fetch(
        'https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?' +
          new URLSearchParams({
            bl: bl,
            rt: 'c',
            _reqid: 0,
          }),
        {
          method: 'POST',
          body: new URLSearchParams({
            at: at,
            'f.req': JSON.stringify([
              null,
              `[[${JSON.stringify(prompt)}],null,${JSON.stringify([
                conversation.c,
                conversation.r,
                conversation.rc,
              ])}]`,
            ]),
          }),
          headers: {
            Cookie: this.cookies,
          },
        },
      )
      const data = await response.text()
      let parsedResponse = this.ParseResponse(data)
      conversation.c = parsedResponse.c
      conversation.r = parsedResponse.r
      conversation.rc = parsedResponse.rc
      const conversationObj = { c: conversation.c, r: conversation.r, rc: conversation.rc }
      return { answer: parsedResponse.responses[3], conversationObj: conversationObj }
    } catch (e) {
      throw e
    }
  }

}
