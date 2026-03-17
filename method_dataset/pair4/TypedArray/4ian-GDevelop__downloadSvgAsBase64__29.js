const downloadSvgAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const image = btoa(
      new Uint8Array(response.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    if (image.length > 100 * 1024) {
      throw new Error(
        `Icon is too big (size after base64 conversion: ${image.length})`
      );
    }

    const contentType = response.headers
      ? response.headers['content-type'].toLowerCase()
      : '';
    if (contentType !== 'image/svg+xml')
      throw new Error(
        `Wrong content type. Got: "${contentType}", expected "image/svg+xml"`
      );

    return `data:${contentType};base64,${image}`;
  } catch (err) {
    console.error('Unable to import the icon.', err);
    throw err;
  }
};
