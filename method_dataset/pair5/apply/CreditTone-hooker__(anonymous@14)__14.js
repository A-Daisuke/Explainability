function __method_wrapper__() {
        Overloads.forEach(function (args) {
            var overload = WebView.$init.overload.apply(WebView.$init, args);
            overload.implementation = function () {
                var result = overload.apply(this, arguments);

                console.log('\n[+] WebView constructor called with args: ' + JSON.stringify(args));
                console.log('[+] WebView instance: ' + this);

                try {
                    var Log = Java.use("android.util.Log");
                    var Throwable = Java.use("java.lang.Throwable");
                    console.log('[*] Stack trace:\n' + Log.getStackTraceString(Throwable.$new()));
                } catch (e) {
                    console.log("[-] Failed to get stack trace: " + e);
                }

                this.setWebContentsDebuggingEnabled(true);
                console.log('[+] WebContents debugging enabled.\n');

                return result;
            };
        });

}
