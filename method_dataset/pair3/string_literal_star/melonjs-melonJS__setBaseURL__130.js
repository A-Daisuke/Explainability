export function setBaseURL(type, url = "./") {
	if (type !== "*") {
		baseURL[type] = url;
	} else {
		// "wildcards"
		baseURL["audio"] = url;
		baseURL["video"] = url;
		baseURL["binary"] = url;
		baseURL["image"] = url;
		baseURL["json"] = url;
		baseURL["js"] = url;
		baseURL["tmx"] = url;
		baseURL["tsx"] = url;
		// XXX ?
		//baseURL["fontface"] = url;
	}
}
