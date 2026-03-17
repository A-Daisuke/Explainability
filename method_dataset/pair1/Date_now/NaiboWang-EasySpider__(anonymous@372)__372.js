function __method_wrapper__() {
    chrome.storage.local.get('parameterNum', function (items) {
        // let at = parseInt(new Date().getTime());
        n = items.parameterNum;
        let ndPath = "";
        let ndAllXPaths = [];
        clearParameters(false);
        for (let num = 0; num < global.nodeList.length; num++) {
            let nd = global.nodeList[num]["node"];
            ndPath = global.nodeList[num]["xpath"];
            ndAllXPaths = global.nodeList[num]["allXPaths"];
            let unique_index = Math.random().toString(36).substring(2) + Date.now().toString(36);
            ; //唯一标识符
            global.outputParameterNodes.push({
                "node": nd,
                "unique_index": unique_index,
                "boxShadow": nd.style.boxShadow == "" || global.boxShadowColor ? "none" : nd.style.boxShadow
            });
            nd.style.boxShadow = global.boxShadowColor;
            let pname = parameterName("文本");
            let ndText = "";
            if (type == 0) {
                // ndText = $(nd).text();
                ndText = nd.textContent;
                pname = parameterName("文本");
                if (nd.tagName == "IMG") {
                    ndText = nd.getAttribute("src") == null ? "" : nd.getAttribute("src");
                    pname = parameterName("地址");
                } else if (nd.tagName == "INPUT") {
                    ndText = nd.getAttribute("value") == null ? "" : nd.getAttribute("value");
                }
            } else if (type == 1) {
                // ndText = $(nd).contents().filter(function() { return this.nodeType === 3; }).text().replace(/\s+/g, '');
                ndText = "";
                let ndContents = nd.childNodes;
                for (let i = 0; i < ndContents.length; i++) {
                    if (ndContents[i].nodeType === 3) { // if it's a text node
                        ndText += ndContents[i].textContent.trim(); // add its content to the string
                    }
                }
                ndText = ndText.replace(/\s+/g, ''); // remove any whitespace characters
                pname = parameterName("文本");
                if (nd.tagName == "IMG") {
                    ndText = nd.getAttribute("src") == null ? "" : nd.getAttribute("src");
                    pname = parameterName("地址");
                } else if (nd.tagName == "INPUT") {
                    ndText = nd.getAttribute("value") == null ? "" : nd.getAttribute("value");
                }
            } else if (type == 2) {
                // ndText = $(nd).html();
                ndText = nd.innerHTML;
                pname = "Innerhtml";
            } else if (type == 3) {
                // ndText = $(nd).prop("outerHTML");
                ndText = nd.outerHTML;
                pname = "outerHTML";
            } else if (type == 4) {
                ndText = nd.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0];
                pname = parameterName("背景图片地址");
            } else if (type == 5) {
                ndText = window.location.href;
                pname = parameterName("页面网址");
            } else if (type == 6) {
                ndText = document.title;
                pname = parameterName("页面标题");
            } else if (type == 10) {
                ndText = nd.value;
                pname = parameterName("选择的选项值");
            } else if (type == 11) {
                ndText = nd.options[nd.selectedIndex].text;
                pname = parameterName("选择的选项文本");
            }
            if (num == 0) { //第一个节点新建，后面的增加即可
                if (nd.tagName == "IMG") { //如果元素是图片
                    global.outputParameters.push({
                        "nodeType": 4, //节点类型
                        "contentType": type, // 内容类型
                        "relative": global.nodeList.length > 1 ? true : false, //是否为相对xpath路径
                        "name": parameterName("参数") + (n++) + parameterName("_图片") + pname,
                        "desc": "", //参数描述
                        "extractType": 0, //提取方式 0 普通 1 OCR
                        "relativeXPath": global.nodeList.length > 1 ? "" : ndPath,
                        "allXPaths": global.nodeList.length > 1 ? "" : ndAllXPaths,
                        "exampleValues": [{"num": num, "value": ndText}],
                        "unique_index": unique_index,
                        "iframe": global.iframe,
                    });
                } else if (nd.tagName == "A") { //如果元素是超链接
                    if (linktext) {
                        global.outputParameters.push({
                            "nodeType": 1,
                            "contentType": type, // 内容类型
                            "relative": global.nodeList.length > 1 ? true : false, //是否为相对xpath路径
                            "name": parameterName("参数") + (n++) + parameterName("_链接") + pname,
                            "desc": "", //参数描述
                            "extractType": 0, //提取方式 0 普通 1 OCR
                            "relativeXPath": global.nodeList.length > 1 ? "" : ndPath,
                            "allXPaths": global.nodeList.length > 1 ? "" : ndAllXPaths,
                            "exampleValues": [{"num": num, "value": ndText}],
                            "unique_index": unique_index,
                            "iframe": global.iframe,
                        });
                    }
                    if (linkhref) {
                        global.outputParameters.push({
                            "nodeType": 2,
                            "contentType": type, // 内容类型
                            "relative": global.nodeList.length > 1 ? true : false, //是否为相对xpath路径
                            "name": parameterName("参数") + (n++) + parameterName("_链接地址"),
                            "desc": "", //参数描述
                            "relativeXPath": global.nodeList.length > 1 ? "" : ndPath,
                            "allXPaths": global.nodeList.length > 1 ? "" : ndAllXPaths,
                            "exampleValues": [{
                                "num": num,
                                "value": nd.getAttribute("href") == null ? "" : nd.getAttribute("href")
                            }],
                            "unique_index": unique_index,
                            "iframe": global.iframe,
                        });
                    }
                } else if (nd.tagName == "INPUT") { //如果元素是输入项
                    global.outputParameters.push({
                        "nodeType": 3,
                        "contentType": type, // 内容类型
                        "relative": global.nodeList.length > 1 ? true : false, //是否为相对xpath路径
                        "name": parameterName("参数") + (n++) + "_" + pname,
                        "desc": "", //参数描述
                        "extractType": 0, //提取方式 0 普通 1 OCR
                        "relativeXPath": global.nodeList.length > 1 ? "" : ndPath,
                        "allXPaths": global.nodeList.length > 1 ? "" : ndAllXPaths,
                        "exampleValues": [{"num": num, "value": ndText}],
                        "unique_index": unique_index,
                        "iframe": global.iframe,
                    });
                } else { //其他所有情况
                    global.outputParameters.push({
                        "nodeType": 0,
                        "contentType": type, // 内容类型
                        "relative": global.nodeList.length > 1 ? true : false, //是否为相对xpath路径
                        "name": parameterName("参数") + (n++) + "_" + pname,
                        "desc": "", //参数描述
                        "extractType": 0, //提取方式 0 普通 1 OCR
                        "relativeXPath": global.nodeList.length > 1 ? "" : ndPath,
                        "allXPaths": global.nodeList.length > 1 ? "" : ndAllXPaths,
                        "exampleValues": [{"num": num, "value": ndText}],
                        "unique_index": unique_index,
                        "iframe": global.iframe,
                    });
                }
            } else { //如果元素节点已经存在，则只需要插入值就可以了
                if (nd.tagName == "IMG") { //如果元素是图片
                    global.outputParameters[0]["exampleValues"].push({"num": num, "value": ndText});
                } else if (nd.tagName == "A") { //如果元素是超链接
                    global.outputParameters[0]["exampleValues"].push({"num": num, "value": ndText});
                    global.outputParameters[1]["exampleValues"].push({
                        "num": num,
                        "value": nd.getAttribute("href") == null ? "" : nd.getAttribute("href")
                    });
                } else if (nd.tagName == "INPUT") { //如果元素是输入项
                    global.outputParameters[0]["exampleValues"].push({"num": num, "value": ndText});
                } else { //其他所有情况
                    global.outputParameters[0]["exampleValues"].push({"num": num, "value": ndText});
                }
            }
        }
        // let at2 = parseInt(new Date().getTime());
        // console.log("generateParameters:", at2, at, at2 - at);
        generateValTable();
        console.log(global.outputParameters);
    });

}
