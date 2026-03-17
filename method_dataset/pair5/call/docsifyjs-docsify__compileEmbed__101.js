function __method_wrapper__() {
  compileEmbed(href, title) {
    const { str, config } = getAndRemoveConfig(title);
    let embed;
    title = str;

    if (config.include) {
      if (!isAbsolutePath(href)) {
        href = getPath(
          this.contentBase,
          getParentPath(this.router.getCurrentPath()),
          href,
        );
      }

      let media;
      if (config.type && (media = compileMedia[config.type])) {
        embed = media.call(this, href, title);
        embed.type = config.type;
      } else {
        let type = 'code';
        if (/\.(md|markdown)/.test(href)) {
          type = 'markdown';
        } else if (/\.mmd/.test(href)) {
          type = 'mermaid';
        } else if (/\.html?/.test(href)) {
          type = 'iframe';
        } else if (/\.(mp4|ogg)/.test(href)) {
          type = 'video';
        } else if (/\.mp3/.test(href)) {
          type = 'audio';
        }

        embed = compileMedia[type](href, title);
        embed.type = type;
      }

      embed.fragment = config.fragment;

      return embed;
    }
  }

}
