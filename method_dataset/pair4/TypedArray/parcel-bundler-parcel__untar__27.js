export default function untar(raw: ArrayBuffer): Map<string, Uint8Array> {
  let decompressed = gunzip(raw);

  let files = new Map<string, Uint8Array>();

  let view = new Uint8Array(decompressed);
  let currentHeaderStart = 0;
  while (currentHeaderStart <= view.length) {
    let filename = Array.from(
      bufferSliceNull(
        view,
        currentHeaderStart + TAR_HEADER_OFFSETS.filename[0],
        TAR_HEADER_OFFSETS.filename[1],
      ),
    )
      .map(c => String.fromCharCode(c))
      .join('');

    if (!filename) break;

    let filesize = parseInt(
      Array.from(
        bufferSliceNull(
          view,
          currentHeaderStart + TAR_HEADER_OFFSETS.filesize[0],
          TAR_HEADER_OFFSETS.filesize[1],
        ),
      )
        .map(c => String.fromCharCode(c))
        .join(''),
      8,
    );
    if (isNaN(filesize)) {
      throw new Error(`untarring failed: ${currentHeaderStart}@${filename}`);
    }

    let data = view.slice(
      currentHeaderStart + 512,
      currentHeaderStart + 512 + filesize,
    );
    files.set(filename.slice('package/'.length), data);

    currentHeaderStart = roundUpToMultipleOf512(
      currentHeaderStart + 512 + filesize,
    );
  }

  return files;
}
