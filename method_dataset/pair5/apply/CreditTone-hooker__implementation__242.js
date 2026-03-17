function __method_wrapper__() {
cipher.init.overload('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec').implementation = function () {
    console.log("↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓");
    console.log("Cipher.init('int', 'java.security.Key', 'java.security.spec.AlgorithmParameterSpec') is called!");
    var algorithm = this.getAlgorithm();
    var tag = algorithm + " init Key";
    var keyBytes = arguments[1].getEncoded();
    toUtf8(tag, keyBytes);
    toHex(tag, keyBytes);
    toBase64(tag, keyBytes);
    var tags = algorithm + " init iv";
    var iv = Java.cast(arguments[2], Java.use("javax.crypto.spec.IvParameterSpec"));
    var ivBytes = iv.getIV();
    toUtf8(tags, ivBytes);
    toHex(tags, ivBytes);
    toBase64(tags, ivBytes);
    showStacks();
    console.log("↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑");
    return this.init.apply(this, arguments);
}

}
