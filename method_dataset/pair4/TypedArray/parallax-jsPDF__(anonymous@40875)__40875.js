class __C__ {
            function(context, i) {
              var MIN_IMAGES_IN_BLOCK = 3;
              var MAX_IMAGES_IN_BLOCK = 1000;
              var fnArray = context.fnArray,
                argsArray = context.argsArray;
              var curr = context.iCurr;
              var iFirstSave = curr - 3;
              var iFirstTransform = curr - 2;
              var iFirstPIXO = curr - 1;
              var firstPIXOArg0 = argsArray[iFirstPIXO][0];
              var firstTransformArg0 = argsArray[iFirstTransform][0];
              var firstTransformArg3 = argsArray[iFirstTransform][3];
              var count = Math.min(
                Math.floor((i - iFirstSave) / 4),
                MAX_IMAGES_IN_BLOCK
              );

              if (count < MIN_IMAGES_IN_BLOCK) {
                return i - ((i - iFirstSave) % 4);
              }

              var positions = new Float32Array(count * 2);
              var iTransform = iFirstTransform;

              for (var q = 0; q < count; q++, iTransform += 4) {
                var transformArgs = argsArray[iTransform];
                positions[q << 1] = transformArgs[4];
                positions[(q << 1) + 1] = transformArgs[5];
              }

              var args = [
                firstPIXOArg0,
                firstTransformArg0,
                firstTransformArg3,
                positions
              ];
              fnArray.splice(
                iFirstSave,
                count * 4,
                _util.OPS.paintImageXObjectRepeat
              );
              argsArray.splice(iFirstSave, count * 4, args);
              return iFirstSave + 1;
            }

}
