function __method_wrapper__() {
              return new Promise(function promiseBody(resolve, reject) {
                var next = function next(promise) {
                  promise.then(function() {
                    try {
                      promiseBody(resolve, reject);
                    } catch (ex) {
                      reject(ex);
                    }
                  }, reject);
                };

                task.ensureNotTerminated();
                timeSlotManager.reset();
                var stop,
                  operation = {},
                  i,
                  ii,
                  cs;

                while (!(stop = timeSlotManager.check())) {
                  operation.args = null;

                  if (!preprocessor.read(operation)) {
                    break;
                  }

                  var args = operation.args;
                  var fn = operation.fn;

                  switch (fn | 0) {
                    case _util.OPS.paintXObject:
                      var name = args[0].name;

                      if (name && imageCache[name] !== undefined) {
                        operatorList.addOp(
                          imageCache[name].fn,
                          imageCache[name].args
                        );
                        args = null;
                        continue;
                      }

                      next(
                        new Promise(function(resolveXObject, rejectXObject) {
                          if (!name) {
                            throw new _util.FormatError(
                              "XObject must be referred to by name."
                            );
                          }

                          var xobj = xobjs.get(name);

                          if (!xobj) {
                            operatorList.addOp(fn, args);
                            resolveXObject();
                            return;
                          }

                          if (!(0, _primitives.isStream)(xobj)) {
                            throw new _util.FormatError(
                              "XObject should be a stream"
                            );
                          }

                          var type = xobj.dict.get("Subtype");

                          if (!(0, _primitives.isName)(type)) {
                            throw new _util.FormatError(
                              "XObject should have a Name subtype"
                            );
                          }

                          if (type.name === "Form") {
                            stateManager.save();
                            self
                              .buildFormXObject(
                                resources,
                                xobj,
                                null,
                                operatorList,
                                task,
                                stateManager.state.clone()
                              )
                              .then(function() {
                                stateManager.restore();
                                resolveXObject();
                              }, rejectXObject);
                            return;
                          } else if (type.name === "Image") {
                            self
                              .buildPaintImageXObject({
                                resources: resources,
                                image: xobj,
                                operatorList: operatorList,
                                cacheKey: name,
                                imageCache: imageCache
                              })
                              .then(resolveXObject, rejectXObject);
                            return;
                          } else if (type.name === "PS") {
                            (0, _util.info)("Ignored XObject subtype PS");
                          } else {
                            throw new _util.FormatError(
                              "Unhandled XObject subtype ".concat(type.name)
                            );
                          }

                          resolveXObject();
                        }).catch(function(reason) {
                          if (self.options.ignoreErrors) {
                            self.handler.send("UnsupportedFeature", {
                              featureId: _util.UNSUPPORTED_FEATURES.unknown
                            });
                            (0, _util.warn)(
                              'getOperatorList - ignoring XObject: "'.concat(
                                reason,
                                '".'
                              )
                            );
                            return;
                          }

                          throw reason;
                        })
                      );
                      return;

                    case _util.OPS.setFont:
                      var fontSize = args[1];
                      next(
                        self
                          .handleSetFont(
                            resources,
                            args,
                            null,
                            operatorList,
                            task,
                            stateManager.state
                          )
                          .then(function(loadedName) {
                            operatorList.addDependency(loadedName);
                            operatorList.addOp(_util.OPS.setFont, [
                              loadedName,
                              fontSize
                            ]);
                          })
                      );
                      return;

                    case _util.OPS.endInlineImage:
                      var cacheKey = args[0].cacheKey;

                      if (cacheKey) {
                        var cacheEntry = imageCache[cacheKey];

                        if (cacheEntry !== undefined) {
                          operatorList.addOp(cacheEntry.fn, cacheEntry.args);
                          args = null;
                          continue;
                        }
                      }

                      next(
                        self.buildPaintImageXObject({
                          resources: resources,
                          image: args[0],
                          isInline: true,
                          operatorList: operatorList,
                          cacheKey: cacheKey,
                          imageCache: imageCache
                        })
                      );
                      return;

                    case _util.OPS.showText:
                      args[0] = self.handleText(args[0], stateManager.state);
                      break;

                    case _util.OPS.showSpacedText:
                      var arr = args[0];
                      var combinedGlyphs = [];
                      var arrLength = arr.length;
                      var state = stateManager.state;

                      for (i = 0; i < arrLength; ++i) {
                        var arrItem = arr[i];

                        if ((0, _util.isString)(arrItem)) {
                          Array.prototype.push.apply(
                            combinedGlyphs,
                            self.handleText(arrItem, state)
                          );
                        } else if ((0, _util.isNum)(arrItem)) {
                          combinedGlyphs.push(arrItem);
                        }
                      }

                      args[0] = combinedGlyphs;
                      fn = _util.OPS.showText;
                      break;

                    case _util.OPS.nextLineShowText:
                      operatorList.addOp(_util.OPS.nextLine);
                      args[0] = self.handleText(args[0], stateManager.state);
                      fn = _util.OPS.showText;
                      break;

                    case _util.OPS.nextLineSetSpacingShowText:
                      operatorList.addOp(_util.OPS.nextLine);
                      operatorList.addOp(_util.OPS.setWordSpacing, [
                        args.shift()
                      ]);
                      operatorList.addOp(_util.OPS.setCharSpacing, [
                        args.shift()
                      ]);
                      args[0] = self.handleText(args[0], stateManager.state);
                      fn = _util.OPS.showText;
                      break;

                    case _util.OPS.setTextRenderingMode:
                      stateManager.state.textRenderingMode = args[0];
                      break;

                    case _util.OPS.setFillColorSpace:
                      stateManager.state.fillColorSpace = _colorspace.ColorSpace.parse(
                        args[0],
                        xref,
                        resources,
                        self.pdfFunctionFactory
                      );
                      continue;

                    case _util.OPS.setStrokeColorSpace:
                      stateManager.state.strokeColorSpace = _colorspace.ColorSpace.parse(
                        args[0],
                        xref,
                        resources,
                        self.pdfFunctionFactory
                      );
                      continue;

                    case _util.OPS.setFillColor:
                      cs = stateManager.state.fillColorSpace;
                      args = cs.getRgb(args, 0);
                      fn = _util.OPS.setFillRGBColor;
                      break;

                    case _util.OPS.setStrokeColor:
                      cs = stateManager.state.strokeColorSpace;
                      args = cs.getRgb(args, 0);
                      fn = _util.OPS.setStrokeRGBColor;
                      break;

                    case _util.OPS.setFillGray:
                      stateManager.state.fillColorSpace =
                        _colorspace.ColorSpace.singletons.gray;
                      args = _colorspace.ColorSpace.singletons.gray.getRgb(
                        args,
                        0
                      );
                      fn = _util.OPS.setFillRGBColor;
                      break;

                    case _util.OPS.setStrokeGray:
                      stateManager.state.strokeColorSpace =
                        _colorspace.ColorSpace.singletons.gray;
                      args = _colorspace.ColorSpace.singletons.gray.getRgb(
                        args,
                        0
                      );
                      fn = _util.OPS.setStrokeRGBColor;
                      break;

                    case _util.OPS.setFillCMYKColor:
                      stateManager.state.fillColorSpace =
                        _colorspace.ColorSpace.singletons.cmyk;
                      args = _colorspace.ColorSpace.singletons.cmyk.getRgb(
                        args,
                        0
                      );
                      fn = _util.OPS.setFillRGBColor;
                      break;

                    case _util.OPS.setStrokeCMYKColor:
                      stateManager.state.strokeColorSpace =
                        _colorspace.ColorSpace.singletons.cmyk;
                      args = _colorspace.ColorSpace.singletons.cmyk.getRgb(
                        args,
                        0
                      );
                      fn = _util.OPS.setStrokeRGBColor;
                      break;

                    case _util.OPS.setFillRGBColor:
                      stateManager.state.fillColorSpace =
                        _colorspace.ColorSpace.singletons.rgb;
                      args = _colorspace.ColorSpace.singletons.rgb.getRgb(
                        args,
                        0
                      );
                      break;

                    case _util.OPS.setStrokeRGBColor:
                      stateManager.state.strokeColorSpace =
                        _colorspace.ColorSpace.singletons.rgb;
                      args = _colorspace.ColorSpace.singletons.rgb.getRgb(
                        args,
                        0
                      );
                      break;

                    case _util.OPS.setFillColorN:
                      cs = stateManager.state.fillColorSpace;

                      if (cs.name === "Pattern") {
                        next(
                          self.handleColorN(
                            operatorList,
                            _util.OPS.setFillColorN,
                            args,
                            cs,
                            patterns,
                            resources,
                            task
                          )
                        );
                        return;
                      }

                      args = cs.getRgb(args, 0);
                      fn = _util.OPS.setFillRGBColor;
                      break;

                    case _util.OPS.setStrokeColorN:
                      cs = stateManager.state.strokeColorSpace;

                      if (cs.name === "Pattern") {
                        next(
                          self.handleColorN(
                            operatorList,
                            _util.OPS.setStrokeColorN,
                            args,
                            cs,
                            patterns,
                            resources,
                            task
                          )
                        );
                        return;
                      }

                      args = cs.getRgb(args, 0);
                      fn = _util.OPS.setStrokeRGBColor;
                      break;

                    case _util.OPS.shadingFill:
                      var shadingRes = resources.get("Shading");

                      if (!shadingRes) {
                        throw new _util.FormatError(
                          "No shading resource found"
                        );
                      }

                      var shading = shadingRes.get(args[0].name);

                      if (!shading) {
                        throw new _util.FormatError("No shading object found");
                      }

                      var shadingFill = _pattern.Pattern.parseShading(
                        shading,
                        null,
                        xref,
                        resources,
                        self.handler,
                        self.pdfFunctionFactory
                      );

                      var patternIR = shadingFill.getIR();
                      args = [patternIR];
                      fn = _util.OPS.shadingFill;
                      break;

                    case _util.OPS.setGState:
                      var dictName = args[0];
                      var extGState = resources.get("ExtGState");

                      if (
                        !(0, _primitives.isDict)(extGState) ||
                        !extGState.has(dictName.name)
                      ) {
                        break;
                      }

                      var gState = extGState.get(dictName.name);
                      next(
                        self.setGState(
                          resources,
                          gState,
                          operatorList,
                          task,
                          stateManager
                        )
                      );
                      return;

                    case _util.OPS.moveTo:
                    case _util.OPS.lineTo:
                    case _util.OPS.curveTo:
                    case _util.OPS.curveTo2:
                    case _util.OPS.curveTo3:
                    case _util.OPS.closePath:
                      self.buildPath(operatorList, fn, args);
                      continue;

                    case _util.OPS.rectangle:
                      self.buildPath(operatorList, fn, args);
                      continue;

                    case _util.OPS.markPoint:
                    case _util.OPS.markPointProps:
                    case _util.OPS.beginMarkedContent:
                    case _util.OPS.beginMarkedContentProps:
                    case _util.OPS.endMarkedContent:
                    case _util.OPS.beginCompat:
                    case _util.OPS.endCompat:
                      continue;

                    default:
                      if (args !== null) {
                        for (i = 0, ii = args.length; i < ii; i++) {
                          if (args[i] instanceof _primitives.Dict) {
                            break;
                          }
                        }

                        if (i < ii) {
                          (0, _util.warn)(
                            "getOperatorList - ignoring operator: " + fn
                          );
                          continue;
                        }
                      }
                  }

                  operatorList.addOp(fn, args);
                }

                if (stop) {
                  next(deferred);
                  return;
                }

                closePendingRestoreOPS();
                resolve();
              }).catch(function(reason) {

}
