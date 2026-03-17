class __C__ {
def_eval(AST_Binary, function (compressor, depth) {
    if (!non_converting_binary.has(this.operator))
        depth++;

    var left = this.left._eval(compressor, depth);
    if (left === this.left)
        return this;
    var right = this.right._eval(compressor, depth);
    if (right === this.right)
        return this;

    if (left != null
        && right != null
        && identity_comparison.has(this.operator)
        && has_identity(left)
        && has_identity(right)
        && typeof left === typeof right) {
        // Do not compare by reference
        return this;
    }

    // Do not mix BigInt and Number; Don't use `>>>` on BigInt or `/ 0n`
    if (
        (typeof left === "bigint") !== (typeof right === "bigint")
        || typeof left === "bigint"
            && (this.operator === ">>>"
                || this.operator === "/" && Number(right) === 0)
    ) {
        return this;
    }

    var result;
    switch (this.operator) {
        case "&&": result = left && right; break;
        case "||": result = left || right; break;
        case "??": result = left != null ? left : right; break;
        case "|": result = left | right; break;
        case "&": result = left & right; break;
        case "^": result = left ^ right; break;
        case "+": result = left + right; break;
        case "*": result = left * right; break;
        case "**": result = left ** right; break;
        case "/": result = left / right; break;
        case "%": result = left % right; break;
        case "-": result = left - right; break;
        case "<<": result = left << right; break;
        case ">>": result = left >> right; break;
        case ">>>": result = left >>> right; break;
        case "==": result = left == right; break;
        case "===": result = left === right; break;
        case "!=": result = left != right; break;
        case "!==": result = left !== right; break;
        case "<": result = left < right; break;
        case "<=": result = left <= right; break;
        case ">": result = left > right; break;
        case ">=": result = left >= right; break;
        default:
            return this;
    }
    if (typeof result === "number" && isNaN(result) && compressor.find_parent(AST_With)) {
        // leave original expression as is
        return this;
    }
    return result;
});

}
