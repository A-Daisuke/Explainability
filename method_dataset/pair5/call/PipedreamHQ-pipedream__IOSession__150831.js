            function IOSession() {
                var _this = this;
                var event = function (body, eventName) {
                    if (_this.constructed) {
                        _this.event(body, eventName);
                    }
                    else {
                        // It is unsafe to dereference `this` before initialization completes,
                        // so we defer until the next tick.
                        //
                        // Construction should finish before the next tick fires, so we do not need to do this recursively.
                        // eslint-disable-next-line no-restricted-globals
                        setImmediate(function () { return _this.event(body, eventName); });
                    }
                };
                var host = sys;
                var typingsInstaller = disableAutomaticTypingAcquisition
                    ? undefined
                    : new NodeTypingsInstaller(telemetryEnabled, logger, host, getGlobalTypingsCacheLocation(), typingSafeListLocation, typesMapLocation, npmLocation, validateDefaultNpmLocation, event);
                _this = _super.call(this, {
                    host: host,
                    cancellationToken: cancellationToken,
                    useSingleInferredProject: useSingleInferredProject,
                    useInferredProjectPerProjectRoot: useInferredProjectPerProjectRoot,
                    typingsInstaller: typingsInstaller || server.nullTypingsInstaller,
                    byteLength: Buffer.byteLength,
                    hrtime: process.hrtime,
                    logger: logger,
                    canUseEvents: true,
                    suppressDiagnosticEvents: suppressDiagnosticEvents,
                    syntaxOnly: syntaxOnly,
                    noGetErrOnBackgroundUpdate: noGetErrOnBackgroundUpdate,
                    globalPlugins: globalPlugins,
                    pluginProbeLocations: pluginProbeLocations,
                    allowLocalPluginLoads: allowLocalPluginLoads,
                    typesMapLocation: typesMapLocation,
                }) || this;
                _this.eventPort = eventPort;
                if (_this.canUseEvents && _this.eventPort) {
                    var s_1 = net.connect({ port: _this.eventPort }, function () {
                        _this.eventSocket = s_1;
                        if (_this.socketEventQueue) {
                            // flush queue.
                            for (var _i = 0, _a = _this.socketEventQueue; _i < _a.length; _i++) {
                                var event_1 = _a[_i];
                                _this.writeToEventSocket(event_1.body, event_1.eventName);
                            }
                            _this.socketEventQueue = undefined;
                        }
                    });
                }
                _this.constructed = true;
                return _this;
            }
