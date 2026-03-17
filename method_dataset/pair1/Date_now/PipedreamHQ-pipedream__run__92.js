function __method_wrapper__() {
  async run({ $ }) {
    const {
      path,
      requirePassword,
      linkPassword,
      expires,
      access,
      audience,
    } = this;

    const accountType = await this.getCurrentAccount();
    const allowDownload = accountType === "basic"
      ? true
      : this.allowDownload;

    if (requirePassword && !linkPassword) {
      throw new Error("Since the password is required, please add a linkPassword");
    }

    if (expires && Date.parse(expires) < Date.now()) {
      throw new Error("Expire date must be later than the current datetime");
    }

    const res = await this.dropbox.createSharedLink({
      path: this.dropbox.getPath(path),
      settings: {
        require_password: requirePassword,
        link_password: linkPassword,
        expires,
        access,
        allow_download: allowDownload,
        audience,
      },
    });
    $.export("$summary", `Shared link for "${path?.label || path}" successfully created`);
    return res;
  },

}
