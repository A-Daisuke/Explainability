async function getSourcemapSizes(
  filePath: FilePath,
  fs: FileSystem,
  projectRoot: FilePath,
): Promise<?Map<string, number>> {
  let bundleContents = await fs.readFile(filePath, 'utf-8');
  let mapUrlData = await loadSourceMapUrl(fs, filePath, bundleContents);
  if (!mapUrlData) {
    return null;
  }

  let rawMap = mapUrlData.map;
  let sourceMap = new SourceMap(projectRoot);
  sourceMap.addVLQMap(rawMap);
  let parsedMapData = sourceMap.getMap();

  if (parsedMapData.mappings.length > 2) {
    let sources = parsedMapData.sources.map(s =>
      path.normalize(path.join(projectRoot, s)),
    );
    let currLine = 1;
    let currColumn = 0;
    let currMappingIndex = 0;
    let currMapping = parsedMapData.mappings[currMappingIndex];
    let nextMapping = parsedMapData.mappings[currMappingIndex + 1];
    let sourceSizes = new Array(sources.length).fill(0);
    let unknownOrigin: number = 0;
    for (let i = 0; i < bundleContents.length; i++) {
      let character = bundleContents[i];

      while (
        nextMapping &&
        nextMapping.generated.line === currLine &&
        nextMapping.generated.column <= currColumn
      ) {
        currMappingIndex++;
        currMapping = parsedMapData.mappings[currMappingIndex];
        nextMapping = parsedMapData.mappings[currMappingIndex + 1];
      }

      let currentSource = currMapping.source;
      let charSize = Buffer.byteLength(character, 'utf8');
      if (
        currentSource != null &&
        currMapping.generated.line === currLine &&
        currMapping.generated.column <= currColumn
      ) {
        sourceSizes[currentSource] += charSize;
      } else {
        unknownOrigin += charSize;
      }

      if (character === '\n') {
        currColumn = 0;
        currLine++;
      } else {
        currColumn++;
      }
    }

    let sizeMap = new Map();
    for (let i = 0; i < sourceSizes.length; i++) {
      sizeMap.set(sources[i], sourceSizes[i]);
    }

    sizeMap.set('', unknownOrigin);

    return sizeMap;
  }
}
