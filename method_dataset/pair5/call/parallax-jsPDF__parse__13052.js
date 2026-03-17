          function parse(input, stateOverride, base) {
            function err(message) {
              errors.push(message);
            }

            var state = stateOverride || "scheme start",
              cursor = 0,
              buffer = "",
              seenAt = false,
              seenBracket = false,
              errors = [];

            loop: while (
              (input[cursor - 1] !== EOF || cursor === 0) &&
              !this._isInvalid
            ) {
              var c = input[cursor];

              switch (state) {
                case "scheme start":
                  if (c && ALPHA.test(c)) {
                    buffer += c.toLowerCase();
                    state = "scheme";
                  } else if (!stateOverride) {
                    buffer = "";
                    state = "no scheme";
                    continue;
                  } else {
                    err("Invalid scheme.");
                    break loop;
                  }

                  break;

                case "scheme":
                  if (c && ALPHANUMERIC.test(c)) {
                    buffer += c.toLowerCase();
                  } else if (c === ":") {
                    this._scheme = buffer;
                    buffer = "";

                    if (stateOverride) {
                      break loop;
                    }

                    if (isRelativeScheme(this._scheme)) {
                      this._isRelative = true;
                    }

                    if (this._scheme === "file") {
                      state = "relative";
                    } else if (
                      this._isRelative &&
                      base &&
                      base._scheme === this._scheme
                    ) {
                      state = "relative or authority";
                    } else if (this._isRelative) {
                      state = "authority first slash";
                    } else {
                      state = "scheme data";
                    }
                  } else if (!stateOverride) {
                    buffer = "";
                    cursor = 0;
                    state = "no scheme";
                    continue;
                  } else if (c === EOF) {
                    break loop;
                  } else {
                    err("Code point not allowed in scheme: " + c);
                    break loop;
                  }

                  break;

                case "scheme data":
                  if (c === "?") {
                    this._query = "?";
                    state = "query";
                  } else if (c === "#") {
                    this._fragment = "#";
                    state = "fragment";
                  } else {
                    if (c !== EOF && c !== "\t" && c !== "\n" && c !== "\r") {
                      this._schemeData += percentEscape(c);
                    }
                  }

                  break;

                case "no scheme":
                  if (!base || !isRelativeScheme(base._scheme)) {
                    err("Missing scheme.");
                    invalid.call(this);
                  } else {
                    state = "relative";
                    continue;
                  }

                  break;

                case "relative or authority":
                  if (c === "/" && input[cursor + 1] === "/") {
                    state = "authority ignore slashes";
                  } else {
                    err("Expected /, got: " + c);
                    state = "relative";
                    continue;
                  }

                  break;

                case "relative":
                  this._isRelative = true;

                  if (this._scheme !== "file") {
                    this._scheme = base._scheme;
                  }

                  if (c === EOF) {
                    this._host = base._host;
                    this._port = base._port;
                    this._path = base._path.slice();
                    this._query = base._query;
                    this._username = base._username;
                    this._password = base._password;
                    break loop;
                  } else if (c === "/" || c === "\\") {
                    if (c === "\\") {
                      err("\\ is an invalid code point.");
                    }

                    state = "relative slash";
                  } else if (c === "?") {
                    this._host = base._host;
                    this._port = base._port;
                    this._path = base._path.slice();
                    this._query = "?";
                    this._username = base._username;
                    this._password = base._password;
                    state = "query";
                  } else if (c === "#") {
                    this._host = base._host;
                    this._port = base._port;
                    this._path = base._path.slice();
                    this._query = base._query;
                    this._fragment = "#";
                    this._username = base._username;
                    this._password = base._password;
                    state = "fragment";
                  } else {
                    var nextC = input[cursor + 1];
                    var nextNextC = input[cursor + 2];

                    if (
                      this._scheme !== "file" ||
                      !ALPHA.test(c) ||
                      (nextC !== ":" && nextC !== "|") ||
                      (nextNextC !== EOF &&
                        nextNextC !== "/" &&
                        nextNextC !== "\\" &&
                        nextNextC !== "?" &&
                        nextNextC !== "#")
                    ) {
                      this._host = base._host;
                      this._port = base._port;
                      this._username = base._username;
                      this._password = base._password;
                      this._path = base._path.slice();

                      this._path.pop();
                    }

                    state = "relative path";
                    continue;
                  }

                  break;

                case "relative slash":
                  if (c === "/" || c === "\\") {
                    if (c === "\\") {
                      err("\\ is an invalid code point.");
                    }

                    if (this._scheme === "file") {
                      state = "file host";
                    } else {
                      state = "authority ignore slashes";
                    }
                  } else {
                    if (this._scheme !== "file") {
                      this._host = base._host;
                      this._port = base._port;
                      this._username = base._username;
                      this._password = base._password;
                    }

                    state = "relative path";
                    continue;
                  }

                  break;

                case "authority first slash":
                  if (c === "/") {
                    state = "authority second slash";
                  } else {
                    err("Expected '/', got: " + c);
                    state = "authority ignore slashes";
                    continue;
                  }

                  break;

                case "authority second slash":
                  state = "authority ignore slashes";

                  if (c !== "/") {
                    err("Expected '/', got: " + c);
                    continue;
                  }

                  break;

                case "authority ignore slashes":
                  if (c !== "/" && c !== "\\") {
                    state = "authority";
                    continue;
                  } else {
                    err("Expected authority, got: " + c);
                  }

                  break;

                case "authority":
                  if (c === "@") {
                    if (seenAt) {
                      err("@ already seen.");
                      buffer += "%40";
                    }

                    seenAt = true;

                    for (var i = 0; i < buffer.length; i++) {
                      var cp = buffer[i];

                      if (cp === "\t" || cp === "\n" || cp === "\r") {
                        err("Invalid whitespace in authority.");
                        continue;
                      }

                      if (cp === ":" && this._password === null) {
                        this._password = "";
                        continue;
                      }

                      var tempC = percentEscape(cp);

                      if (this._password !== null) {
                        this._password += tempC;
                      } else {
                        this._username += tempC;
                      }
                    }

                    buffer = "";
                  } else if (
                    c === EOF ||
                    c === "/" ||
                    c === "\\" ||
                    c === "?" ||
                    c === "#"
                  ) {
                    cursor -= buffer.length;
                    buffer = "";
                    state = "host";
                    continue;
                  } else {
                    buffer += c;
                  }

                  break;

                case "file host":
                  if (
                    c === EOF ||
                    c === "/" ||
                    c === "\\" ||
                    c === "?" ||
                    c === "#"
                  ) {
                    if (
                      buffer.length === 2 &&
                      ALPHA.test(buffer[0]) &&
                      (buffer[1] === ":" || buffer[1] === "|")
                    ) {
                      state = "relative path";
                    } else if (buffer.length === 0) {
                      state = "relative path start";
                    } else {
                      this._host = IDNAToASCII.call(this, buffer);
                      buffer = "";
                      state = "relative path start";
                    }

                    continue;
                  } else if (c === "\t" || c === "\n" || c === "\r") {
                    err("Invalid whitespace in file host.");
                  } else {
                    buffer += c;
                  }

                  break;

                case "host":
                case "hostname":
                  if (c === ":" && !seenBracket) {
                    this._host = IDNAToASCII.call(this, buffer);
                    buffer = "";
                    state = "port";

                    if (stateOverride === "hostname") {
                      break loop;
                    }
                  } else if (
                    c === EOF ||
                    c === "/" ||
                    c === "\\" ||
                    c === "?" ||
                    c === "#"
                  ) {
                    this._host = IDNAToASCII.call(this, buffer);
                    buffer = "";
                    state = "relative path start";

                    if (stateOverride) {
                      break loop;
                    }

                    continue;
                  } else if (c !== "\t" && c !== "\n" && c !== "\r") {
                    if (c === "[") {
                      seenBracket = true;
                    } else if (c === "]") {
                      seenBracket = false;
                    }

                    buffer += c;
                  } else {
                    err("Invalid code point in host/hostname: " + c);
                  }

                  break;

                case "port":
                  if (/[0-9]/.test(c)) {
                    buffer += c;
                  } else if (
                    c === EOF ||
                    c === "/" ||
                    c === "\\" ||
                    c === "?" ||
                    c === "#" ||
                    stateOverride
                  ) {
                    if (buffer !== "") {
                      var temp = parseInt(buffer, 10);

                      if (temp !== relative[this._scheme]) {
                        this._port = temp + "";
                      }

                      buffer = "";
                    }

                    if (stateOverride) {
                      break loop;
                    }

                    state = "relative path start";
                    continue;
                  } else if (c === "\t" || c === "\n" || c === "\r") {
                    err("Invalid code point in port: " + c);
                  } else {
                    invalid.call(this);
                  }

                  break;

                case "relative path start":
                  if (c === "\\") {
                    err("'\\' not allowed in path.");
                  }

                  state = "relative path";

                  if (c !== "/" && c !== "\\") {
                    continue;
                  }

                  break;

                case "relative path":
                  if (
                    c === EOF ||
                    c === "/" ||
                    c === "\\" ||
                    (!stateOverride && (c === "?" || c === "#"))
                  ) {
                    if (c === "\\") {
                      err("\\ not allowed in relative path.");
                    }

                    var tmp;

                    if ((tmp = relativePathDotMapping[buffer.toLowerCase()])) {
                      buffer = tmp;
                    }

                    if (buffer === "..") {
                      this._path.pop();

                      if (c !== "/" && c !== "\\") {
                        this._path.push("");
                      }
                    } else if (buffer === "." && c !== "/" && c !== "\\") {
                      this._path.push("");
                    } else if (buffer !== ".") {
                      if (
                        this._scheme === "file" &&
                        this._path.length === 0 &&
                        buffer.length === 2 &&
                        ALPHA.test(buffer[0]) &&
                        buffer[1] === "|"
                      ) {
                        buffer = buffer[0] + ":";
                      }

                      this._path.push(buffer);
                    }

                    buffer = "";

                    if (c === "?") {
                      this._query = "?";
                      state = "query";
                    } else if (c === "#") {
                      this._fragment = "#";
                      state = "fragment";
                    }
                  } else if (c !== "\t" && c !== "\n" && c !== "\r") {
                    buffer += percentEscape(c);
                  }

                  break;

                case "query":
                  if (!stateOverride && c === "#") {
                    this._fragment = "#";
                    state = "fragment";
                  } else if (
                    c !== EOF &&
                    c !== "\t" &&
                    c !== "\n" &&
                    c !== "\r"
                  ) {
                    this._query += percentEscapeQuery(c);
                  }

                  break;

                case "fragment":
                  if (c !== EOF && c !== "\t" && c !== "\n" && c !== "\r") {
                    this._fragment += c;
                  }

                  break;
              }

              cursor++;
            }
          }
