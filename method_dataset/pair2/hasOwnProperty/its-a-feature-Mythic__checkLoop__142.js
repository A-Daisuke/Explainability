    const checkLoop = (nodes, visited) => {
        let found = false;
        let checkingKey = visited[visited.length-1]; // the latest thing we've seen
        for(const [testKey, testNodes] of Object.entries(nodes)){
            if(testNodes.hasOwnProperty(checkingKey)){
                // we found a new node that has the last node we saw as a child
                found = true;
                //console.log("found", testNodes, "has", checkingKey, "visited", visited, "testKey", testKey)
                if(visited.includes(testKey)){
                    // we found a loop
                    //console.log("found loop", visited, testKey)
                    return true;
                }
                visited.push(testKey);
                if(checkLoop(nodes, visited)){
                    return visited.pop()
                }
            }
        }
        if(!found){
            //console.log("didn't find", checkingKey, "in any edges")
        } else {
            //console.log("found nested, but no loop with", checkingKey)
        }
        return false;
    }
