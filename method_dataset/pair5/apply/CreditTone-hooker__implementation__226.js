function __method_wrapper__() {
cipher.init.overload('int', 'java.security.Key').implementation = function () {
    console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
    console.log("Cipher.init('int', 'java.security.Key') is called!");
    var algorithm = this.getAlgorithm();
    var tag = algorithm + " init Key";
    var className = JSON.stringify(arguments[1]);
    if (className.indexOf("OpenSSLRSAPrivateKey") === -1) {
        var keyBytes = arguments[1].getEncoded();
        toUtf8(tag, keyBytes);
        toHex(tag, keyBytes);
        toBase64(tag, keyBytes);
    }
    showStacks();
    console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
    return this.init.apply(this, arguments);
}

}
