function __method_wrapper__() {
    React.useEffect( () => {
        // need to update the matrix in case there are nodes that don't trace back to root
        let adjustedMatrix = {};
        // check for cycles
        let tempMatrix = {...treeAdjMatrix};
        for(const[group, groupMatrix] of Object.entries(tempMatrix)){
            for(const[host, hostMatrix] of Object.entries(tempMatrix[group])){
                for(const[key, val] of Object.entries(tempMatrix[group][host])){
                    for(const[key2, val2] of Object.entries(tempMatrix[group][host])){
                        if(val2[key] !== undefined && val[key2] !== undefined){
                            let tmp = {...val2};
                            delete tmp[key];
                            tempMatrix[group][host][key2] = tmp;
                        }
                    }
                }
            }
        }
        //console.log("treeAdjMatrix updated", treeAdjMatrix)
        for(const [group, hosts] of Object.entries(tempMatrix)){
            if(adjustedMatrix[group] === undefined){adjustedMatrix[group] = {}}
            for(const [host, matrix] of Object.entries(hosts)){
                // looping through the hosts to adjust their entries
                if( adjustedMatrix[group][host] === undefined){adjustedMatrix[group][host] = {}}
                for(const [key, children] of Object.entries(matrix)){
                    // if key !== "", if key is in another entry, leave it. if it's not anywhere else, add it to ""
                    // key is the parent and children are all the child processes
                    if(adjustedMatrix[group][host][key] === undefined){adjustedMatrix[group][host][key] = children}
                    if(key === ""){
                        // add all the children automatically
                        for(const [i, v] of Object.entries(children)){
                            adjustedMatrix[group][host][key][i] = v
                        }
                    } else {
                        // check if key  is in children anywhere, if not, add it to adjustedMatrix[host][""][key] = 1
                        let found = false;
                        for(const [keySearch, childrenSearch] of Object.entries(matrix)){
                            if(childrenSearch.hasOwnProperty(key)){
                                found=true;
                            }
                            //for(const [i, v] of Object.entries(childrenSearch)){
                            //    if(i === key){found=true}
                            //}
                        }
                        if(!found){
                            if(adjustedMatrix[group][host][""] === undefined){adjustedMatrix[group][host][""] = {}}
                            adjustedMatrix[group][host][""][key] = 1;
                        }
                    }
                }
                // check for loops in our adjusted matrix
                for(const [key, _] of Object.entries(adjustedMatrix[group][host])){
                    // key == 540
                    // does anything have 540 has a child? 760 does - 760 is visited
                    // does anything have 760 as a child? 676 does
                    // does anything have 676 as a child? 540 does - X loop detected
                    // let badKey = checkLoop(540, adjustedMatrix[group][host], [540]);
                    let removeKey = checkLoop(adjustedMatrix[group][host], [key]);
                    if(adjustedMatrix[group][host][removeKey]){
                        delete adjustedMatrix[group][host][removeKey][key];
                        adjustedMatrix[group][host][""][key] = 1;
                    }
                }
            }
        }

        console.log("adjustedMatrix", adjustedMatrix, "realMatrix", treeAdjMatrix)
        setUpdatedTreeAdjMatrix(adjustedMatrix);
    }, [treeAdjMatrix]);

}
