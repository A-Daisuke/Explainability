function __method_wrapper__() {
  this.extract = function (entry, outPath, callback) {
    let entryName = entry || '';
    if (typeof entry === 'string') {
      entry = this.entry(entry);
      if (entry) {
        entryName = entry.name;
      } else {
        if (entryName.length && entryName[entryName.length - 1] !== '/') {
          entryName += '/';
        }
      }
    }
    if (!entry || entry.isDirectory) {
      const files = [],
        dirs = [],
        allDirs = {};
      for (const e in entries) {
        if (
          Object.prototype.hasOwnProperty.call(entries, e) &&
          e.lastIndexOf(entryName, 0) === 0
        ) {
          let relPath = e.replace(entryName, '');
          const childEntry = entries[e];
          if (childEntry.isFile) {
            files.push(childEntry);
            relPath = path.dirname(relPath);
          }
          if (relPath && !allDirs[relPath] && relPath !== '.') {
            allDirs[relPath] = true;
            let parts = relPath.split('/').filter((f) => {
              return f;
            });
            if (parts.length) {
              dirs.push(parts);
            }
            while (parts.length > 1) {
              parts = parts.slice(0, parts.length - 1);
              const partsPath = parts.join('/');
              if (allDirs[partsPath] || partsPath === '.') {
                break;
              }
              allDirs[partsPath] = true;
              dirs.push(parts);
            }
          }
        }
      }
      dirs.sort((x, y) => {
        return x.length - y.length;
      });
      if (dirs.length) {
        createDirectories(outPath, dirs, (err) => {
          if (err) {
            callback(err);
          } else {
            extractFiles(outPath, entryName, files, callback, 0);
          }
        });
      } else {
        extractFiles(outPath, entryName, files, callback, 0);
      }
    } else {
      fs.stat(outPath, (err, stat) => {
        if (stat && stat.isDirectory()) {
          extract(entry, path.join(outPath, path.basename(entry.name)), callback);
        } else {
          extract(entry, outPath, callback);
        }
      });
    }
  };

}
