function __method_wrapper__() {
      .then(function (response) {
        if (typeof response.data === 'object') {
          if (response.data.hasOwnProperty('next_href')) {
            // next_href exists
            // run loop till no next_href
            return that.getFavoritesIds(response.data.next_href)
              .then(function (next_href_response) {
                // sums all likes ids from loops
                return response.data.collection.concat(next_href_response.collection);
              })
          } else {
            return response.data.collection;
          }
        } else {
          // invalid response
          return $q.reject(response.data);
        }

      }, function (response) {

}
