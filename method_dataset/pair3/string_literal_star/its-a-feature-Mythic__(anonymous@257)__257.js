function __method_wrapper__() {
        {tasks.map( (task) => (
            task.type === "task" ? (
                    <div key={"taskdisplay:" + task.display_id} style={{marginRight: "5px"}}>
                        <div style={{width: removing ? "95%" : "100%", display: "inline-block"}}>
                            <TaskDisplay me={me} task={task} command_id={task.command === null ? 0 : task.command.id} />
                        </div>
                        {removing ? (
                            <Switch
                                checked={task.checked}
                                onChange={toggleTaskToRemove}
                                name={"task" + task.display_id}
                                inputProps={{ 'aria-label': 'checkbox', 'color': theme.palette.error.main }}
                        />
                        ) : null}
                    </div>
                    
            ) : (
                <Paper key={"taskdisplayforcallback:" + task.id} elevation={5} style={{ marginBottom: "5px", marginTop: "10px"}} variant={"elevation"}>
                    <Typography variant="h4" style={{textAlign: "left", display: "inline-block", marginLeft: "20px"}}>
                        {task.domain === "" ? null : (task.domain + "\\")}{task.user}{task.integrity_level > 2 ? ("*") : null}@{task.host} (
                        <Link style={{wordBreak: "break-all"}} color={"textPrimary"} underline="always" target="_blank" href={"/new/callbacks/" + task.display_id}>{task.display_id}</Link>
                        )
                    </Typography>
                    <Button variant="contained" size="small" style={{display: "inline-block", float: "right", marginTop:"5px", marginRight:"10px", backgroundColor: theme.palette.info.main}} 
                        onClick={() => {setTaskSearchInfo(task.display_id)}}>Include More Tasks</Button>
                </Paper>
            ))

}
