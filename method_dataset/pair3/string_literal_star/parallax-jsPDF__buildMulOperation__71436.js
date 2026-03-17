          function buildMulOperation(num1, num2) {
            if (num2.type === "literal") {
              if (num2.number === 0) {
                return new AstLiteral(0);
              } else if (num2.number === 1) {
                return num1;
              } else if (num1.type === "literal") {
                return new AstLiteral(num1.number * num2.number);
              }
            }

            if (num1.type === "literal") {
              if (num1.number === 0) {
                return new AstLiteral(0);
              } else if (num1.number === 1) {
                return num2;
              }
            }

            var min = Math.min(
              num1.min * num2.min,
              num1.min * num2.max,
              num1.max * num2.min,
              num1.max * num2.max
            );
            var max = Math.max(
              num1.min * num2.min,
              num1.min * num2.max,
              num1.max * num2.min,
              num1.max * num2.max
            );
            return new AstBinaryOperation("*", num1, num2, min, max);
          }
