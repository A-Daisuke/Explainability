function __method_wrapper__() {
      .then(function (response) {
        if (!angular.isObject(response.data)) {
          return $q.reject(response.data);
        }
        if (response.data.hasOwnProperty('next_href')) {
          // call itself to get all repost ids
          return that.getRepostsIds(response.data.next_href)
            .then(function (next_href_response) {
              // sums all ids
              return response.data.collection.concat(next_href_response.collection);
            });
        }
        return response.data.collection;

      })

}
