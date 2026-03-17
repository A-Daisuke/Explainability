const __obj__ = {
            executeCommand: function executeCommand(
              howManyArgs,
              command,
              keepStack
            ) {
              var stackLength = this.stack.length;

              if (howManyArgs > stackLength) {
                return true;
              }

              var start = stackLength - howManyArgs;

              for (var i = start; i < stackLength; i++) {
                var value = this.stack[i];

                if (Number.isInteger(value)) {
                  this.output.push(28, (value >> 8) & 0xff, value & 0xff);
                } else {
                  value = (65536 * value) | 0;
                  this.output.push(
                    255,
                    (value >> 24) & 0xff,
                    (value >> 16) & 0xff,
                    (value >> 8) & 0xff,
                    value & 0xff
                  );
                }
              }

              this.output.push.apply(this.output, command);

              if (keepStack) {
                this.stack.splice(start, howManyArgs);
              } else {
                this.stack.length = 0;
              }

              return false;
            }

};
