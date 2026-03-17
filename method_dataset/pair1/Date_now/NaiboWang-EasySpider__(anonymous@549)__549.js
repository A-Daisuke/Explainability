function __method_wrapper__() {
    chrome.storage.local.get({parameterNum: 1}, function (items) {
        // let at = parseInt(new Date().getTime());
        n = items.parameterNum;
        let nd, ndText, ndPath, pname, ndAllXPaths;
        for (let num = 0; num < global.nodeList.length; num++) {
            let nd = global.nodeList[num]["node"];
            ndPath = global.nodeList[num]["xpath"];
            ndAllXPaths = global.nodeList[num]["allXPaths"];
            let unique_index = Math.random().toString(36).substring(2) + Date.now().toString(36);
            ;
            global.outputParameterNodes.push({
                "node": nd,
                "unique_index": unique_index,
                "boxShadow": nd.style.boxShadow == "" || global.boxShadowColor ? "none" : nd.style.boxShadow
            });
            nd.style.boxShadow = global.boxShadowColor;
            // ndText = $(nd).text();
            ndText = nd.textContent;
            if (nd.tagName == "IMG") { //如果元素是图片
                global.outputParameters.push({
                    "nodeType": 4, //节点类型
                    "contentType": 0, // 内容类型
                    "relative": false, //是否为相对xpath路径
                    "name": parameterName("参数") + (n++) + parameterName("_图片地址"),
                    "desc": "", //参数描述
                    "relativeXPath": ndPath,
                    "allXPaths": ndAllXPaths,
                    "exampleValues": [{
                        "num": 0,
                        "value": nd.getAttribute("src") == null ? "" : nd.getAttribute("src")
                    }],
                    "unique_index": unique_index,
                    "iframe": global.iframe,
                });
            } else if (nd.tagName == "A") { //如果元素是超链接
                global.outputParameters.push({
                    "nodeType": 1,
                    "contentType": 0, // 内容类型
                    "relative": false, //是否为相对xpath路径
                    "name": parameterName("参数") + (n++) + parameterName("_链接文本"),
                    "desc": "", //参数描述
                    "relativeXPath": ndPath,
                    "allXPaths": ndAllXPaths,
                    "exampleValues": [{"num": 0, "value": ndText}],
                    "unique_index": unique_index,
                    "iframe": global.iframe,
                });
                global.outputParameters.push({
                    "nodeType": 2,
                    "contentType": 0, // 内容类型
                    "relative": false, //是否为相对xpath路径
                    "name": parameterName("参数") + (n++) + parameterName("_链接地址"),
                    "desc": "", //参数描述
                    "relativeXPath": ndPath,
                    "allXPaths": ndAllXPaths,
                    "exampleValues": [{
                        "num": 0,
                        "value": nd.getAttribute("href") == null ? "" : nd.getAttribute("href")
                    }],
                    "unique_index": unique_index,
                    "iframe": global.iframe,
                });
            } else if (nd.tagName == "INPUT") { //如果元素是输入项
                global.outputParameters.push({
                    "nodeType": 3,
                    "contentType": 0, // 内容类型
                    "relative": false, //是否为相对xpath路径
                    "name": parameterName("参数") + (n++) + parameterName("_文本"),
                    "desc": "", //参数描述
                    "relativeXPath": ndPath,
                    "allXPaths": ndAllXPaths,
                    "exampleValues": [{
                        "num": 0,
                        "value": nd.getAttribute("value") == null ? "" : nd.getAttribute("value")
                    }],
                    "unique_index": unique_index,
                    "iframe": global.iframe,
                });
            } else { //其他所有情况
                global.outputParameters.push({
                    "nodeType": 0,
                    "contentType": 0, // 内容类型
                    "relative": false, //是否为相对xpath路径
                    "name": parameterName("参数") + (n++) + parameterName("_文本"),
                    "desc": "", //参数描述
                    "relativeXPath": ndPath,
                    "allXPaths": ndAllXPaths,
                    "exampleValues": [{"num": 0, "value": ndText}],
                    "unique_index": unique_index,
                    "iframe": global.iframe,
                });
            }
        }
        // console.log(global.outputParameters);
        // let at2 = parseInt(new Date().getTime());
        // console.log("generateMultiParameters", at2, at, at2 - at);
        generateValTable(false);
    });

}
