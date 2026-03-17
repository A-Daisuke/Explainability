function __method_wrapper__() {
        User.getCookie(options.site, "mam_id").then(mamId => {
          $.getJSON("https://cdn.myanonamouse.net/json/loadUserDetailsTorrents.php", {
            uid: options.userInfo.id,
            iteration: 0,
            type: type,
            cacheTime: Math.round(Date.now() / 1000),
            mam_id: decodeURIComponent(mamId)
          }).done(data => {
            doneCount++
            data.rows.forEach(item => {
              this.result.seeding += 1;
              this.result.seedingSize += item.size.sizeToNumber()
            })

            if (doneCount === types.length-1) {
              this.done();
            }
          }).fail(error => {
            console.log(error);
            this.done();
          })
        }).catch(err => {

}
