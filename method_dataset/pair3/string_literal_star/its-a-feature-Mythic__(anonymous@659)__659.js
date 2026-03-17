function __method_wrapper__() {
    return label_components.map( (name) => {
        if(name === "ip"){
            try{
                let parts = JSON.parse(edge[name]);
                //console.log("ip parts", parts)
                if(parts.length > 0 && parts[0].length > 0){
                    return parts[0]
                }
                //console.log("no ip parts for the following",edge[name])
                return "127.0.0.1";
            }catch(error){
                console.log(error)
                if(!edge[name] || edge[name].length === 0){
                    return "127.0.0.1"
                }
                return edge[name];
            }
        } else if(name === "user") {
            if(edge["integrity_level"] > 2){
                return edge[name] + "*";
            }else{
                return edge[name];
            }
        } else {
            return edge[name]
        }

    }).join(", ");

}
