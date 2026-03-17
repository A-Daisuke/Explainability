function __method_wrapper__() {
      return this.then(function setPageSize_main() {
        // Retrieve page-size based on jsPDF settings, if not explicitly provided.
        pageSize = pageSize || jsPDF.getPageSize(this.opt.jsPDF);

        // Add 'inner' field if not present.
        if (!pageSize.hasOwnProperty("inner")) {
          pageSize.inner = {
            width: pageSize.width - this.opt.margin[1] - this.opt.margin[3],
            height: pageSize.height - this.opt.margin[0] - this.opt.margin[2]
          };
          pageSize.inner.px = {
            width: toPx(pageSize.inner.width, pageSize.k),
            height: toPx(pageSize.inner.height, pageSize.k)
          };
          pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
        }

        // Attach pageSize to this.
        this.prop.pageSize = pageSize;
      });

}
