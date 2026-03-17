const __obj__ = {
            apply: function (target, thisArg, argumentsList) {
                let fetchReqUrl = '';
                let fetchReqOptions = {};
                if (typeof argumentsList[0] === 'string') {
                    fetchReqUrl = argumentsList[0];
                    fetchReqOptions = argumentsList[1];
                } else if (argumentsList[0] instanceof Request) {
                    fetchReqOptions = argumentsList[0];
                    fetchReqUrl = fetchReqOptions?.url;
                }
                const fetchReqMethod = fetchReqOptions?.method?.toUpperCase();
                let fetchRsp;
                try {
                    const block_url = 'gravatar\.com|browser-intake-datadoghq\.com|\.wp\.com|intercomcdn\.com|sentry\.io|sentry_key=|intercom\.io|featuregates\.org|/v1/initialize|/messenger/|statsigapi\.net|/rgstr|/v1/sdk_exception';
                    if (gv("k_closeModer", false) && fetchReqUrl.match('/backend-api/moderations(\\?|$)')) {
                        //取消审计1
                        fetchRsp = Promise.resolve({
                            json: () => {return {}}
                        });
                        return fetchRsp;
                    } else if (gv("k_closeModer", false) && fetchReqUrl.match('/backend-api/conversation(\\?|$)')) {
                        //取消审计2
                        const post_body = JSON.parse(argumentsList[1].body);
                        post_body.supports_modapi = false;
                        argumentsList[1].body = JSON.stringify(post_body);
                    } else if (gv("k_intercepttracking", false) && fetchReqUrl.match(block_url)) {
                        //拦截跟踪
                        console.log(`KeepChatGPT: ${tl("拦截跟踪")}: ${fetchReqUrl}`);
                        fetchRsp = Promise.resolve({
                        });
                        return fetchRsp;
                    } else if (fetchReqUrl.match('/backend-api/compliance')) {
                        //fix openai bug
                        fetchRsp = Promise.resolve({
                            json: () => {return {"registration_country":null,"require_cookie_consent":false,"terms_of_use":{"is_required":false,"display":null},"cookie_consent":null,"age_verification":null}}
                        });
                        return fetchRsp;
                    }
                } catch (e) {}
                fetchRsp = target.apply(thisArg, argumentsList);
                return fetchRsp.then(response => {
                    if (gv("k_everchanging", false) === true && fetchReqUrl.match('/backend-api/conversations\\?.*offset=')) {
                        //刷新侧边栏时，更新数据库：id、标题、更新时间。同时更新侧边栏
                        return response.text().then(async fetchRspBody => {
                            let fetchRspBodyNew = fetchRspBody;
                            const b = JSON.parse(fetchRspBody).items;
                            let kec_object = {};
                            b.forEach(async el => {
                                const update_time = new Date(el.update_time);
                                const ec_tmp = await global.st_ec.get(el.id) || {};
                                await global.st_ec.put({id: el.id, title: el.title, update_time: update_time, last: ec_tmp.last, model: ec_tmp.model});
                                kec_object[el.id] = {title: el.title, update_time: update_time, last: ec_tmp.last, model: ec_tmp.model};
                            });
                            setTimeout(function() {
                                attachDate(kec_object);
                            }, 1000);//有点bug
                            return Promise.resolve(new Response(fetchRspBodyNew, {status: response.status, statusText: response.statusText, headers: response.headers}));
                        });
                    } else if (gv("k_everchanging", false) === true && fetchReqUrl.match('/backend-api/conversation/(([^/]{4,}?){4}-[^/]{4,}?)(\\?|$)(\\?|$)')) {
                        //点击/编辑/删除侧边栏的历史对话时，更新数据库：当前id、当前标题、当前更新时间，当前last，当前model。同时更新侧边栏

                        return response.text().then(async fetchRspBody => {
                            let fetchRspBodyNew = fetchRspBody;
                            if (fetchReqMethod === 'GET') {
                                //点击/编辑历史对话
                                const f = JSON.parse(fetchRspBody);
                                const crt_con_id = f && f.conversation_id;
                                const crt_con_title = f && f.title;
                                let crt_con_update_time = f && f.update_time;
                                crt_con_update_time = crt_con_update_time < 10**10 ? crt_con_update_time * 1000 : crt_con_update_time;
                                crt_con_update_time = new Date(crt_con_update_time);
                                const crt_con_speak_last_keys = f && f.mapping && Object.keys(f.mapping);
                                const crt_con_speak_last_id = f.current_node;
                                const crt_con_speak_last = f.mapping[crt_con_speak_last_id].message;
                                const crt_con_last = crt_con_speak_last.content.parts[0].trim().replace(/[\r\n]/g, ``).substr(0, 100);
                                const crt_con_model = crt_con_speak_last.metadata.model_slug;
                                await global.st_ec.put({id: crt_con_id, title: crt_con_title, update_time: crt_con_update_time, last: crt_con_last, model: crt_con_model});
                                let kec_object = {};
                                kec_object[crt_con_id] = {title: crt_con_title, update_time: crt_con_update_time, last: crt_con_last, model: crt_con_model};
                                setTimeout(function() {
                                    attachDate(kec_object);
                                }, 300);
                            } else if (fetchReqMethod === 'PATCH') {
                                //删除历史对话
                                const f = JSON.parse(fetchRspBody);
                                const crt_con_id = fetchReqUrl.match('/backend-api/conversation/(([^/]{4,}?){4}-[^/]{4,}?)(\\?|$)')[1];
                                const crt_con_title = f && f.title;
                                const is_visible = f && f.is_visible;
                                if (is_visible) {
                                    await global.st_ec.delete({id: crt_con_id});
                                }
                            }
                            return Promise.resolve(new Response(fetchRspBodyNew, {status: response.status, statusText: response.statusText, headers: response.headers}));
                        });
                    }
                    return response;
                }).catch(error => {
                    //console.error(error);
                    return Promise.reject(error);
                });
            }

};
