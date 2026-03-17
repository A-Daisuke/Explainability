function __method_wrapper__() {
  async run({ $ }) {
    if ((!this.url && !this.html) || (this.url && this.html)) {
      throw new ConfigurationError("You must provide either URL or HTML.");
    }
    const response = await this.html2Pdf.createPdf({
      $,
      responseType: "arraybuffer",
      params: {
        url: this.url,
        html: this.html,
        header: this.header,
        footer: this.footer,
        page_offset: this.pageOffset,
        page_size: this.pageSize,
        orientation: this.orientation,
        width: this.width,
        height: this.height,
        top: this.top,
        bottom: this.bottom,
        left: this.left,
        right: this.right,
        unit: this.unit,
        css_media_type: this.cssMediaType,
        optimize_layout: this.optimizeLayout,
        lazy_load: this.lazyLoad,
        wait_time: this.waitTime,
        css: this.css,
      },
    });

    const filePath = `/tmp/${Date.now()}.pdf`;
    fs.writeFileSync(filePath, response);

    $.export("$summary", "Generated PDF is saved at");
    $.export("file_path", filePath);
    return filePath;
  },

}
