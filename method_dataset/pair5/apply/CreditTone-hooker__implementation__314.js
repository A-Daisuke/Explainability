function __method_wrapper__() {
cipher.doFinal.overload('[B', 'int', 'int').implementation = function () {
    console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
    console.log("Cipher.doFinal('[B', 'int', 'int') is called!");
    var algorithm = this.getAlgorithm();
    var tag = algorithm + " doFinal data";
    var data = arguments[0];
    toUtf8(tag, data);
    toHex(tag, data);
    toBase64(tag, data);
    var result = this.doFinal.apply(this, arguments);
    var tags = algorithm + " doFinal result";
    toHex(tags, result);
    toBase64(tags, result);
    console.log("arguments[1]:", arguments[1],);
    console.log("arguments[2]:", arguments[2]);
    showStacks();
    console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
    return result;
}

}
