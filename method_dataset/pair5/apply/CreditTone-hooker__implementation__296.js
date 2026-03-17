function __method_wrapper__() {
cipher.doFinal.overload('[B').implementation = function () {
    console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
    console.log("Cipher.doFinal('[B') is called!");
    var algorithm = this.getAlgorithm();
    var tag = algorithm + " doFinal data";
    var data = arguments[0];
    //修改一次
    toBase64(tag, data);
    toHex(tag, data);
    toBase64(tag, data);
    var result = this.doFinal.apply(this, arguments);
    var tags = algorithm + " doFinal result";
    toHex(tags, result);
    toBase64(tags, result);
    showStacks();
    console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
    return result;
}

}
