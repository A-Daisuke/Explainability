function __method_wrapper__() {
        .then((clientOptions: any) => {
          clientOptions.client
            .call(EAction.testClientConnectivity, options)
            .then((result: boolean) => {
              dataResult.success = result;
              if (result) {
                dataResult.type = EDataResultType.success;
              }
              resolve(dataResult);
            })
            .catch((result: any) => {
              dataResult.data = result;
              dataResult.type = EDataResultType.error;
              reject(dataResult);
            });
        })

}
