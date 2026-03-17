function __method_wrapper__() {
  define("ace/lib/useragent", ["require", "exports", "module"], function(
    e,
    t,
    n
  ) {
    "use strict";
    (t.OS = { LINUX: "LINUX", MAC: "MAC", WINDOWS: "WINDOWS" }),
      (t.getOS = function() {
        return t.isMac ? t.OS.MAC : t.isLinux ? t.OS.LINUX : t.OS.WINDOWS;
      });
    if (typeof navigator != "object") return;
    var r = (navigator.platform.match(/mac|win|linux/i) || [
        "other"
      ])[0].toLowerCase(),
      i = navigator.userAgent;
    (t.isWin = r == "win"),
      (t.isMac = r == "mac"),
      (t.isLinux = r == "linux"),
      (t.isGecko = t.isMozilla =
        (window.Controllers || window.controllers) &&
        window.navigator.product === "Gecko"),
      (t.isOldGecko =
        t.isGecko && parseInt((i.match(/rv:(\d+)/) || [])[1], 10) < 4),
      (t.isOpera =
        window.opera &&
        Object.prototype.toString.call(window.opera) == "[object Opera]"),
      (t.isWebKit = parseFloat(i.split("WebKit/")[1]) || undefined),
      (t.isChrome = parseFloat(i.split(" Chrome/")[1]) || undefined),
      (t.isAIR = i.indexOf("AdobeAIR") >= 0),
      (t.isIPad = i.indexOf("iPad") >= 0),
      (t.isTouchPad = i.indexOf("TouchPad") >= 0),
      (t.isChromeOS = i.indexOf(" CrOS ") >= 0);
  }),

}
