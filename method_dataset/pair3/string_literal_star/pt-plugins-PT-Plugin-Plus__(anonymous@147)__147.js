function __method_wrapper__() {
        site.categories.find((item: SiteCategories) => {
          if (
            item.category &&
            (item.entry == "*" ||
              (this.data.entry && this.data.entry.indexOf(item.entry) > -1))
          ) {
            this.categoryConfig = item;
            let key = item.result + "";
            item.category.forEach((category: SiteCategory) => {
              result.push(
                Object.assign(
                  {
                    key: key.replace(/\$id\$/gi, category.id + "")
                  },
                  category
                )
              );
            });
            return true;
          }
          return false;
        });

}
