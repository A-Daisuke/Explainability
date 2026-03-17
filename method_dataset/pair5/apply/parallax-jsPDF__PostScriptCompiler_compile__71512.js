const __obj__ = {
            compile: function PostScriptCompiler_compile(code, domain, range) {
              var stack = [];
              var i, ii;
              var instructions = [];
              var inputSize = domain.length >> 1,
                outputSize = range.length >> 1;
              var lastRegister = 0;
              var n, j;
              var num1, num2, ast1, ast2, tmpVar, item;

              for (i = 0; i < inputSize; i++) {
                stack.push(
                  new AstArgument(i, domain[i * 2], domain[i * 2 + 1])
                );
              }

              for (i = 0, ii = code.length; i < ii; i++) {
                item = code[i];

                if (typeof item === "number") {
                  stack.push(new AstLiteral(item));
                  continue;
                }

                switch (item) {
                  case "add":
                    if (stack.length < 2) {
                      return null;
                    }

                    num2 = stack.pop();
                    num1 = stack.pop();
                    stack.push(buildAddOperation(num1, num2));
                    break;

                  case "cvr":
                    if (stack.length < 1) {
                      return null;
                    }

                    break;

                  case "mul":
                    if (stack.length < 2) {
                      return null;
                    }

                    num2 = stack.pop();
                    num1 = stack.pop();
                    stack.push(buildMulOperation(num1, num2));
                    break;

                  case "sub":
                    if (stack.length < 2) {
                      return null;
                    }

                    num2 = stack.pop();
                    num1 = stack.pop();
                    stack.push(buildSubOperation(num1, num2));
                    break;

                  case "exch":
                    if (stack.length < 2) {
                      return null;
                    }

                    ast1 = stack.pop();
                    ast2 = stack.pop();
                    stack.push(ast1, ast2);
                    break;

                  case "pop":
                    if (stack.length < 1) {
                      return null;
                    }

                    stack.pop();
                    break;

                  case "index":
                    if (stack.length < 1) {
                      return null;
                    }

                    num1 = stack.pop();

                    if (num1.type !== "literal") {
                      return null;
                    }

                    n = num1.number;

                    if (n < 0 || !Number.isInteger(n) || stack.length < n) {
                      return null;
                    }

                    ast1 = stack[stack.length - n - 1];

                    if (ast1.type === "literal" || ast1.type === "var") {
                      stack.push(ast1);
                      break;
                    }

                    tmpVar = new AstVariable(
                      lastRegister++,
                      ast1.min,
                      ast1.max
                    );
                    stack[stack.length - n - 1] = tmpVar;
                    stack.push(tmpVar);
                    instructions.push(new AstVariableDefinition(tmpVar, ast1));
                    break;

                  case "dup":
                    if (stack.length < 1) {
                      return null;
                    }

                    if (
                      typeof code[i + 1] === "number" &&
                      code[i + 2] === "gt" &&
                      code[i + 3] === i + 7 &&
                      code[i + 4] === "jz" &&
                      code[i + 5] === "pop" &&
                      code[i + 6] === code[i + 1]
                    ) {
                      num1 = stack.pop();
                      stack.push(buildMinOperation(num1, code[i + 1]));
                      i += 6;
                      break;
                    }

                    ast1 = stack[stack.length - 1];

                    if (ast1.type === "literal" || ast1.type === "var") {
                      stack.push(ast1);
                      break;
                    }

                    tmpVar = new AstVariable(
                      lastRegister++,
                      ast1.min,
                      ast1.max
                    );
                    stack[stack.length - 1] = tmpVar;
                    stack.push(tmpVar);
                    instructions.push(new AstVariableDefinition(tmpVar, ast1));
                    break;

                  case "roll":
                    if (stack.length < 2) {
                      return null;
                    }

                    num2 = stack.pop();
                    num1 = stack.pop();

                    if (num2.type !== "literal" || num1.type !== "literal") {
                      return null;
                    }

                    j = num2.number;
                    n = num1.number;

                    if (
                      n <= 0 ||
                      !Number.isInteger(n) ||
                      !Number.isInteger(j) ||
                      stack.length < n
                    ) {
                      return null;
                    }

                    j = ((j % n) + n) % n;

                    if (j === 0) {
                      break;
                    }

                    Array.prototype.push.apply(
                      stack,
                      stack.splice(stack.length - n, n - j)
                    );
                    break;

                  default:
                    return null;
                }
              }

              if (stack.length !== outputSize) {
                return null;
              }

              var result = [];
              instructions.forEach(function(instruction) {
                var statementBuilder = new ExpressionBuilderVisitor();
                instruction.visit(statementBuilder);
                result.push(statementBuilder.toString());
              });
              stack.forEach(function(expr, i) {
                var statementBuilder = new ExpressionBuilderVisitor();
                expr.visit(statementBuilder);
                var min = range[i * 2],
                  max = range[i * 2 + 1];
                var out = [statementBuilder.toString()];

                if (min > expr.min) {
                  out.unshift("Math.max(", min, ", ");
                  out.push(")");
                }

                if (max < expr.max) {
                  out.unshift("Math.min(", max, ", ");
                  out.push(")");
                }

                out.unshift("dest[destOffset + ", i, "] = ");
                out.push(";");
                result.push(out.join(""));
              });
              return result.join("\n");
            }

};
