              function nextEntry() {
                while (true) {
                  if (!entries.length) {
                    parsedRawLinesCallback();
                    return;
                  }

                  var line = entries.shift();
                  if (reComment.test(line)) continue;

                  if (extendedSyntax) {
                    match = reSection.exec(line);

                    if (match) {
                      currentLang = match[1].toLowerCase();
                      skipLang =
                        currentLang !== "*" &&
                        currentLang !== lang &&
                        currentLang !== genericLang;
                      continue;
                    } else if (skipLang) {
                      continue;
                    }

                    match = reImport.exec(line);

                    if (match) {
                      loadImport(baseURL + match[1], nextEntry);
                      return;
                    }
                  }

                  var tmp = line.match(reSplit);

                  if (tmp && tmp.length == 3) {
                    dictionary[tmp[1]] = evalString(tmp[2]);
                  }
                }
              }
