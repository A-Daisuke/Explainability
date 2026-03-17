function __method_wrapper__() {
      it('getPageInfo', (done) => {
        win.parentIFrame.getPageInfo((pageInfo) => {
          expect(pageInfo.iframeHeight).toBe(500)

          expect(pageInfo.iframeWidth).toBe(300)

          expect(pageInfo.offsetLeft).toBe(20)

          expect(pageInfo.offsetTop).toBe(85)

          expect(pageInfo.scrollTop).toBe(0)

          expect(pageInfo.scrollLeft).toBe(0)

          expect(pageInfo.documentHeight).toBe(645)

          expect(pageInfo.documentWidth).toBe(1295)

          expect(pageInfo.windowHeight).toBe(645)

          expect(pageInfo.windowWidth).toBe(1295)

          expect(pageInfo.clientHeight).toBe(645)

          expect(pageInfo.clientWidth).toBe(1295)
          done()
        })

        expect(msgObject.source.postMessage).toHaveBeenCalledWith(
          '[iFrameSizer]parentIFrameTests:0:0:pageInfo',
          '*',
        )
        mockMsgListener(
          createMsg(
            'pageInfo:{"iframeHeight":500,"iframeWidth":300,"clientHeight":645,' +
              '"clientWidth":1295,"offsetLeft":20,"offsetTop":85,"scrollLeft":0,' +
              '"scrollTop":0,"documentHeight":645,"documentWidth":1295,' +
              '"windowHeight":645,"windowWidth":1295}',
          ),
        )
      })

}
