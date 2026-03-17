export const decodeBase64LayerData = (pako: any, tiledLayer: TiledLayer) => {
  const { data, compression } = tiledLayer;
  const dataBase64 = data as string;
  if (!dataBase64) {
    // The layer data is not encoded.
    return data as number[];
  }
  let index = 4;
  const decodedData: integer[] = [];
  let step1 = atob(dataBase64)
    .split("")
    .map(function (x) {
      return x.charCodeAt(0);
    });
  try {
    const decodeArray = (arr: integer[] | Uint8Array, index: integer) =>
      (arr[index] +
        (arr[index + 1] << 8) +
        (arr[index + 2] << 16) +
        (arr[index + 3] << 24)) >>>
      0;

    if (compression === "zlib") {
      const binData = new Uint8Array(step1);
      const decompressedData = pako.inflate(binData);
      while (index <= decompressedData.length) {
        decodedData.push(decodeArray(decompressedData, index - 4));
        index += 4;
      }
    } else if (compression === "zstd") {
      console.error(
        "Zstandard compression is not supported for layers in a Tilemap. Use instead zlib compression or no compression."
      );
      return null;
    } else {
      while (index <= step1.length) {
        decodedData.push(decodeArray(step1, index - 4));
        index += 4;
      }
    }
    return decodedData;
  } catch (error) {
    console.error(
      "Failed to decompress and unzip base64 layer.data string",
      error
    );
    return null;
  }
};
