    const getElement = () => {
        if(props.task) {
            return (
                <TableContainer className="mythicElement" >
                    <Table stickyHeader size="small" style={{"tableLayout": "fixed", "maxWidth": "100%", "overflow": "scroll"}}>
                        <TableBody>
                            <TableRow hover>
                                <TableCell style={{width: "20%"}}>Element Type</TableCell>
                                <TableCell><b>Task</b></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell >Task / Callback</TableCell>
                                <TableCell>
                                    <Link href={"/new/task/" + props.task.display_id} color="textPrimary" target={"_blank"}>
                                        T-{props.task.display_id}
                                    </Link>
                                    {"  /  "}
                                    <Link href={"/new/callbacks/" + props.task.callback.display_id} color="textPrimary" target={"_blank"}>
                                        C-{props.task.callback.display_id}
                                    </Link>
                                    <div style={{border: props.task.callback.color === "" ? "" : `1px solid ${props.task.callback.color}`}}>
                                        {props.task.callback.user}{props.task.callback.integrity_level > 2 ? "*" : ""}@{props.task.callback.host}
                                        {" - "}{props.task.callback.description}
                                    </div>

                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Command</TableCell>
                                <TableCell>
                                    {props.task.command_name} {props.task.display_params}
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Comment</TableCell>
                                <TableCell>{props.task.comment}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Data</TableCell>
                                <TableCell>{JSON.stringify(props.data, null, 2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        } else if(props.credential) {
            return (
                <TableContainer className="mythicElement" >
                    <Table stickyHeader size="small" style={{"tableLayout": "fixed", "maxWidth": "100%", "overflow": "scroll"}}>
                        <TableBody>
                            <TableRow hover>
                                <TableCell style={{width: "20%"}}>Element Type</TableCell>
                                <TableCell><b>Credential</b></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Account</TableCell>
                                <TableCell>{props.credential.account}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Realm</TableCell>
                                <TableCell>{props.credential.realm}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Comment</TableCell>
                                <TableCell>{props.credential.comment}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Credential Type</TableCell>
                                <TableCell>{props.credential.type}</TableCell>
                            </TableRow>
                            <TableRow hover style={{whiteSpace: "pre"}}>
                                <TableCell>Credential</TableCell>
                                <TableCell>{props.credential.credential_text}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Data</TableCell>
                                <TableCell>{JSON.stringify(props.data, null, 2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        } else if(props.mythictree) {
            return (
                <TableContainer className="mythicElement" >
                    <Table stickyHeader size="small" style={{"tableLayout": "fixed", "maxWidth": "100%", "overflow": "scroll"}}>
                        <TableBody>
                            <TableRow hover>
                                <TableCell style={{width: "15%"}}>Element Type</TableCell>
                                <TableCell>{props.mythictree.tree_type === "file" ? <b>File Browser</b> : <b>Process Browser</b>}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell >Name</TableCell>
                                <TableCell>{props.mythictree.name_text}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>
                                    {props.mythictree.tree_type === "file" ? (
                                        "Path"
                                    ) : (
                                        "PID"
                                    )}
                                </TableCell>
                                <TableCell>{props.mythictree.full_path_text}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Host</TableCell>
                                <TableCell>{props.mythictree.host}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Comment</TableCell>
                                <TableCell>{props.mythictree.comment}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Metadata</TableCell>
                                <TableCell>
                                    <Button color="info"  onClick={() => setViewPermissionsDialogOpen(true)}>
                                        <PlaylistAddCheckIcon style={{marginRight: "5px"}}/> View
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Data</TableCell>
                                <TableCell>{JSON.stringify(props.data, null, 2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {viewPermissionsDialogOpen &&
                        <MythicDialog fullWidth={true} maxWidth="md" open={viewPermissionsDialogOpen}
                                      onClose={()=>{setViewPermissionsDialogOpen(false);}}
                                      innerDialog={<MythicViewJSONAsTableDialog title="View Permissions Data"
                                                                                leftColumn="Permission" rightColumn="Value"
                                                                                value={props.mythictree.metadata}
                                                                                onClose={()=>{setViewPermissionsDialogOpen(false);}} />}
                        />
                    }
                </TableContainer>
            )
        } else if(props.filemetum) {
            return (
                <TableContainer className="mythicElement" >
                    <Table stickyHeader size="small" style={{"tableLayout": "fixed", "maxWidth": "100%", "overflow": "scroll"}}>
                        <TableBody>
                            <TableRow hover>
                                <TableCell style={{width: "15%"}}>Element Type</TableCell>
                                <TableCell><b>{props.filemetum.is_screenshot ? "Screenshot" : props.filemetum.is_download_from_agent ? "File Download" : "File Upload"}</b></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell >Filename</TableCell>
                                <TableCell>
                                    <Link style={{wordBreak: "break-all"}}  color="textPrimary" download underline="always" target="_blank" href={"/direct/download/" + props.filemetum.agent_file_id}>{b64DecodeUnicode(props.filemetum.filename_text)}</Link>
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Hash</TableCell>
                                <TableCell>
                                    <Typography variant="body2" style={{wordBreak: "break-all"}}>MD5: {props.filemetum.md5}</Typography>
                                    <Typography variant="body2" style={{wordBreak: "break-all"}}>SHA1: {props.filemetum.sha1}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Comment</TableCell>
                                <TableCell>{props.filemetum.comment}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Full Remote Path</TableCell>
                                <TableCell>
                                    {props.filemetum.host}<br/>
                                    {b64DecodeUnicode(props.filemetum.full_remote_path_text)}
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>File Hosting</TableCell>
                                <TableCell>
                                    <MythicStyledTooltip title={"Host Payload Through C2"} >
                                        <PublicIcon color={"info"} style={{marginLeft: "20px", cursor: "pointer"}} onClick={()=>{setOpenHostDialog(true);}}  />
                                    </MythicStyledTooltip>
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Data</TableCell>
                                <TableCell>{JSON.stringify(props.data, null, 2)}</TableCell>
                            </TableRow>
                        </TableBody>

                        {openHostDialog &&
                            <MythicDialog fullWidth={true} maxWidth="md" open={openHostDialog}
                                          onClose={()=>{setOpenHostDialog(false);}}
                                          innerDialog={<HostFileDialog file_uuid={props.filemetum.agent_file_id}
                                                                       file_name={props.filemetum.full_remote_path_text === "" ? b64DecodeUnicode(props.filemetum.filename_text) : b64DecodeUnicode(props.filemetum.full_remote_path_text)}
                                                                       onClose={()=>{setOpenHostDialog(false);}} />}
                            />
                        }
                    </Table>
                </TableContainer>
            )
        }else if(props.keylog_id) {
            return <Typography ><b>Keylog: </b> {props.keylog_id}</Typography>
        }else if(props.payload){
            return (
                <TableContainer className="mythicElement" >
                    <Table stickyHeader size="small" style={{"tableLayout": "fixed", "maxWidth": "100%", "overflow": "scroll"}}>
                        <TableBody>
                            <TableRow hover>
                                <TableCell style={{width: "20%"}}>Element Type</TableCell>
                                <TableCell><b>Payload</b></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell >Filename</TableCell>
                                <TableCell>
                                    {b64DecodeUnicode(props.payload.filemetum.filename_text)}
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell >UUID</TableCell>
                                <TableCell>
                                    {props.payload.uuid}
                                    <IconButton color={"info"} onClick={()=>setOpenDetailedView(true)}>
                                        <InfoIconOutline />
                                    </IconButton>
                                    {openDetailedView &&
                                        <MythicDialog fullWidth={true} maxWidth="lg" open={openDetailedView}
                                                      onClose={()=>{setOpenDetailedView(false);}}
                                                      innerDialog={<DetailedPayloadTable {...props.payload} payload_id={props.payload.id} onClose={()=>{setOpenDetailedView(false);}} />}
                                        />}
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Description</TableCell>
                                <TableCell>{props.payload.description}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Data</TableCell>
                                <TableCell>{JSON.stringify(props.data, null, 2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }else if(props.taskartifact_id) {
            return <Typography><b>Artifact: </b> {props.taskartifact_id}</Typography>
        }else if(props.callback){
            return (
                <TableContainer className="mythicElement" >
                    <Table stickyHeader size="small" style={{"tableLayout": "fixed", "maxWidth": "100%", "overflow": "scroll"}}>
                        <TableBody>
                            <TableRow hover>
                                <TableCell style={{width: "20%"}}>Element Type</TableCell>
                                <TableCell><b>Callback</b></TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell >Callback</TableCell>
                                <TableCell>
                                    <Link href={"/new/callbacks/" + props.callback.display_id} color="textPrimary" target={"_blank"}>
                                        C-{props.callback.display_id}
                                    </Link>
                                    <div style={{border: props.callback.color === "" ? "" : `1px solid ${props.callback.color}`}}>
                                        {props.callback.user}{props.callback.integrity_level > 2 ? "*" : ""}@{props.callback.host}
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Description</TableCell>
                                <TableCell>{props.callback.description}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>IP</TableCell>
                                <TableCell>{props.callback.ip}</TableCell>
                            </TableRow>
                            <TableRow hover>
                                <TableCell>Data</TableCell>
                                <TableCell>{JSON.stringify(props.data, null, 2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )

        } else {
            console.log("unknown id for tag", props)
        }
    }
