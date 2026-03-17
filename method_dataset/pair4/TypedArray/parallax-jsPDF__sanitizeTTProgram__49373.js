              function sanitizeTTProgram(table, ttContext) {
                var data = table.data;
                var i = 0,
                  j,
                  n,
                  b,
                  funcId,
                  pc,
                  lastEndf = 0,
                  lastDeff = 0;
                var stack = [];
                var callstack = [];
                var functionsCalled = [];
                var tooComplexToFollowFunctions =
                  ttContext.tooComplexToFollowFunctions;
                var inFDEF = false,
                  ifLevel = 0,
                  inELSE = 0;

                for (var ii = data.length; i < ii; ) {
                  var op = data[i++];

                  if (op === 0x40) {
                    n = data[i++];

                    if (inFDEF || inELSE) {
                      i += n;
                    } else {
                      for (j = 0; j < n; j++) {
                        stack.push(data[i++]);
                      }
                    }
                  } else if (op === 0x41) {
                    n = data[i++];

                    if (inFDEF || inELSE) {
                      i += n * 2;
                    } else {
                      for (j = 0; j < n; j++) {
                        b = data[i++];
                        stack.push((b << 8) | data[i++]);
                      }
                    }
                  } else if ((op & 0xf8) === 0xb0) {
                    n = op - 0xb0 + 1;

                    if (inFDEF || inELSE) {
                      i += n;
                    } else {
                      for (j = 0; j < n; j++) {
                        stack.push(data[i++]);
                      }
                    }
                  } else if ((op & 0xf8) === 0xb8) {
                    n = op - 0xb8 + 1;

                    if (inFDEF || inELSE) {
                      i += n * 2;
                    } else {
                      for (j = 0; j < n; j++) {
                        b = data[i++];
                        stack.push((b << 8) | data[i++]);
                      }
                    }
                  } else if (op === 0x2b && !tooComplexToFollowFunctions) {
                    if (!inFDEF && !inELSE) {
                      funcId = stack[stack.length - 1];

                      if (isNaN(funcId)) {
                        (0, _util.info)(
                          "TT: CALL empty stack (or invalid entry)."
                        );
                      } else {
                        ttContext.functionsUsed[funcId] = true;

                        if (funcId in ttContext.functionsStackDeltas) {
                          var newStackLength =
                            stack.length +
                            ttContext.functionsStackDeltas[funcId];

                          if (newStackLength < 0) {
                            (0, _util.warn)(
                              "TT: CALL invalid functions stack delta."
                            );
                            ttContext.hintsValid = false;
                            return;
                          }

                          stack.length = newStackLength;
                        } else if (
                          funcId in ttContext.functionsDefined &&
                          !functionsCalled.includes(funcId)
                        ) {
                          callstack.push({
                            data: data,
                            i: i,
                            stackTop: stack.length - 1
                          });
                          functionsCalled.push(funcId);
                          pc = ttContext.functionsDefined[funcId];

                          if (!pc) {
                            (0, _util.warn)("TT: CALL non-existent function");
                            ttContext.hintsValid = false;
                            return;
                          }

                          data = pc.data;
                          i = pc.i;
                        }
                      }
                    }
                  } else if (op === 0x2c && !tooComplexToFollowFunctions) {
                    if (inFDEF || inELSE) {
                      (0, _util.warn)("TT: nested FDEFs not allowed");
                      tooComplexToFollowFunctions = true;
                    }

                    inFDEF = true;
                    lastDeff = i;
                    funcId = stack.pop();
                    ttContext.functionsDefined[funcId] = {
                      data: data,
                      i: i
                    };
                  } else if (op === 0x2d) {
                    if (inFDEF) {
                      inFDEF = false;
                      lastEndf = i;
                    } else {
                      pc = callstack.pop();

                      if (!pc) {
                        (0, _util.warn)("TT: ENDF bad stack");
                        ttContext.hintsValid = false;
                        return;
                      }

                      funcId = functionsCalled.pop();
                      data = pc.data;
                      i = pc.i;
                      ttContext.functionsStackDeltas[funcId] =
                        stack.length - pc.stackTop;
                    }
                  } else if (op === 0x89) {
                    if (inFDEF || inELSE) {
                      (0, _util.warn)("TT: nested IDEFs not allowed");
                      tooComplexToFollowFunctions = true;
                    }

                    inFDEF = true;
                    lastDeff = i;
                  } else if (op === 0x58) {
                    ++ifLevel;
                  } else if (op === 0x1b) {
                    inELSE = ifLevel;
                  } else if (op === 0x59) {
                    if (inELSE === ifLevel) {
                      inELSE = 0;
                    }

                    --ifLevel;
                  } else if (op === 0x1c) {
                    if (!inFDEF && !inELSE) {
                      var offset = stack[stack.length - 1];

                      if (offset > 0) {
                        i += offset - 1;
                      }
                    }
                  }

                  if (!inFDEF && !inELSE) {
                    var stackDelta =
                      op <= 0x8e
                        ? TTOpsStackDeltas[op]
                        : op >= 0xc0 && op <= 0xdf
                        ? -1
                        : op >= 0xe0
                        ? -2
                        : 0;

                    if (op >= 0x71 && op <= 0x75) {
                      n = stack.pop();

                      if (!isNaN(n)) {
                        stackDelta = -n * 2;
                      }
                    }

                    while (stackDelta < 0 && stack.length > 0) {
                      stack.pop();
                      stackDelta++;
                    }

                    while (stackDelta > 0) {
                      stack.push(NaN);
                      stackDelta--;
                    }
                  }
                }

                ttContext.tooComplexToFollowFunctions = tooComplexToFollowFunctions;
                var content = [data];

                if (i > data.length) {
                  content.push(new Uint8Array(i - data.length));
                }

                if (lastDeff > lastEndf) {
                  (0, _util.warn)("TT: complementing a missing function tail");
                  content.push(new Uint8Array([0x22, 0x2d]));
                }

                foldTTTable(table, content);
              }
