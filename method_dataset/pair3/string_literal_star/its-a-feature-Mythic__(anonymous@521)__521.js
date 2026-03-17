function __method_wrapper__() {
        data?.task?.reduce( (prev, cur) => {
            // get counts per tasked user
            for(let i = 0; i < callbackData[cur.callback_id].mythictree_groups.length; i++){
                let curGroup = callbackData[cur.callback_id].mythictree_groups[i];
                let currentTaskedUser = callbackData[cur.callback_id].user;
                if(callbackData[cur.callback_id].integrity_level > 2){
                    currentTaskedUser = "*" + currentTaskedUser;
                }
                if( taskedUserCounts[ "[" + curGroup + "] " + currentTaskedUser] ){
                    taskedUserCounts[ "[" + curGroup + "] " + currentTaskedUser] += 1;
                } else {
                    taskedUserCounts[ "[" + curGroup + "] " + currentTaskedUser] = 1;
                }
            }
            if(callbackData[cur.callback_id].mythictree_groups.length === 0){
                let currentTaskedUser = callbackData[cur.callback_id].user;
                if(callbackData[cur.callback_id].integrity_level > 2){
                    currentTaskedUser = "*" + currentTaskedUser;
                }
                if( taskedUserCounts[ currentTaskedUser] ){
                    taskedUserCounts[ currentTaskedUser] += 1;
                } else {
                    taskedUserCounts[ currentTaskedUser] = 1;
                }
            }
            return prev;
        }, []);

}
