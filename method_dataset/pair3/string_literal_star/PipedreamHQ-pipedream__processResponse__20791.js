class __C__ {
        processResponse (response) {
          // 1.
          if (response.type === 'error' || response.status === 206 || response.status < 200 || response.status > 299) {
            responsePromise.reject(webidl.errors.exception({
              header: 'Cache.addAll',
              message: 'Received an invalid status code or the request failed.'
            }))
          } else if (response.headersList.contains('vary')) { // 2.
            // 2.1
            const fieldValues = getFieldValues(response.headersList.get('vary'))

            // 2.2
            for (const fieldValue of fieldValues) {
              // 2.2.1
              if (fieldValue === '*') {
                responsePromise.reject(webidl.errors.exception({
                  header: 'Cache.addAll',
                  message: 'invalid vary field value'
                }))

                for (const controller of fetchControllers) {
                  controller.abort()
                }

                return
              }
            }
          }
        },

}
