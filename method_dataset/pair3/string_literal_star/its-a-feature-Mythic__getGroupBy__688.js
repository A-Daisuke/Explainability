const getGroupBy = (node, view_config) => {
    if(!node){return ""}
    if(view_config.group_by === "None"){
        return "";
    }
    if(node[view_config.group_by].length === 0){
        return " ";
    } else if(view_config.group_by === "ip") {
        try{
            let parts = JSON.parse(node[view_config.group_by]);
            if(parts.length > 0 && parts[0].length > 0){
                return parts[0]
            }
            return "127.0.0.1";
        }catch(error){
            if(!node[view_config.group_by] || node[view_config.group_by].length === 0){
                return "127.0.0.1"
            }
            return node[view_config.group_by];
        }
    } else if(view_config.group_by === "user"){
        if(node["integrity_level"] > 2){
            return node[view_config.group_by] + "*";
        }else{
            return node[view_config.group_by];
        }
    } else{
        return node[view_config.group_by];
    }
}
