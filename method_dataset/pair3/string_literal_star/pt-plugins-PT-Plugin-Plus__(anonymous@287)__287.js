function __method_wrapper__() {
        site.categories.forEach((item: SiteCategories) => {
          if (
            item.category &&
            (item.entry == "*" ||
              (entry.entry as string).indexOf(item.entry as string))
          ) {
            item.category.forEach((c: SiteCategory) => {
              if (
                entry.categories &&
                entry.categories.includes(c.id as string)
              ) {
                result.push(c.name as string);
              }
            });
          }
        });

}
