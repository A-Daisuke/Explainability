class __C__ {
  async run({ $ }) {
    const {
      app,
      type,
      parcels,
      paperSize,
      header,
    } = this;

    const response = await app.listParcelDocuments({
      $,
      type,
      params: {
        parcels,
        paper_size: paperSize,
      },
      headers: {
        Accept: header || "application/pdf",
      },
    });

    const filePath = path.join("/tmp", `${type}-${Date.now()}.pdf`);
    fs.writeFileSync(filePath, response);

    $.export("$summary", "Successfully listed parcel documents");

    return {
      filePath,
    };
  },

}
