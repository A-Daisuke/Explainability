            function foundImageMaskGroup(context, i) {
              var MIN_IMAGES_IN_MASKS_BLOCK = 10;
              var MAX_IMAGES_IN_MASKS_BLOCK = 100;
              var MAX_SAME_IMAGES_IN_MASKS_BLOCK = 1000;
              var fnArray = context.fnArray,
                argsArray = context.argsArray;
              var curr = context.iCurr;
              var iFirstSave = curr - 3;
              var iFirstTransform = curr - 2;
              var iFirstPIMXO = curr - 1;
              var count = Math.floor((i - iFirstSave) / 4);
              count = handlePaintSolidColorImageMask(
                iFirstSave,
                count,
                fnArray,
                argsArray
              );

              if (count < MIN_IMAGES_IN_MASKS_BLOCK) {
                return i - ((i - iFirstSave) % 4);
              }

              var q;
              var isSameImage = false;
              var iTransform, transformArgs;
              var firstPIMXOArg0 = argsArray[iFirstPIMXO][0];

              if (
                argsArray[iFirstTransform][1] === 0 &&
                argsArray[iFirstTransform][2] === 0
              ) {
                isSameImage = true;
                var firstTransformArg0 = argsArray[iFirstTransform][0];
                var firstTransformArg3 = argsArray[iFirstTransform][3];
                iTransform = iFirstTransform + 4;
                var iPIMXO = iFirstPIMXO + 4;

                for (q = 1; q < count; q++, iTransform += 4, iPIMXO += 4) {
                  transformArgs = argsArray[iTransform];

                  if (
                    argsArray[iPIMXO][0] !== firstPIMXOArg0 ||
                    transformArgs[0] !== firstTransformArg0 ||
                    transformArgs[1] !== 0 ||
                    transformArgs[2] !== 0 ||
                    transformArgs[3] !== firstTransformArg3
                  ) {
                    if (q < MIN_IMAGES_IN_MASKS_BLOCK) {
                      isSameImage = false;
                    } else {
                      count = q;
                    }

                    break;
                  }
                }
              }

              if (isSameImage) {
                count = Math.min(count, MAX_SAME_IMAGES_IN_MASKS_BLOCK);
                var positions = new Float32Array(count * 2);
                iTransform = iFirstTransform;

                for (q = 0; q < count; q++, iTransform += 4) {
                  transformArgs = argsArray[iTransform];
                  positions[q << 1] = transformArgs[4];
                  positions[(q << 1) + 1] = transformArgs[5];
                }

                fnArray.splice(
                  iFirstSave,
                  count * 4,
                  _util.OPS.paintImageMaskXObjectRepeat
                );
                argsArray.splice(iFirstSave, count * 4, [
                  firstPIMXOArg0,
                  firstTransformArg0,
                  firstTransformArg3,
                  positions
                ]);
              } else {
                count = Math.min(count, MAX_IMAGES_IN_MASKS_BLOCK);
                var images = [];

                for (q = 0; q < count; q++) {
                  transformArgs = argsArray[iFirstTransform + (q << 2)];
                  var maskParams = argsArray[iFirstPIMXO + (q << 2)][0];
                  images.push({
                    data: maskParams.data,
                    width: maskParams.width,
                    height: maskParams.height,
                    transform: transformArgs
                  });
                }

                fnArray.splice(
                  iFirstSave,
                  count * 4,
                  _util.OPS.paintImageMaskXObjectGroup
                );
                argsArray.splice(iFirstSave, count * 4, [images]);
              }

              return iFirstSave + 1;
            }
