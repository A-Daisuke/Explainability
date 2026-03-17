    function processFileList(e, files, opts) {

        var filesLeft = files.length;
        var group = {
            groupID: getGroupID(),
            files: files,
            started: new Date()
        };

        function groupEnd() {
            group.ended = new Date();
            opts.on.groupend(group);
        }

        function groupFileDone() {
            if (--filesLeft === 0) {
                groupEnd();
            }
        }

        FileReaderJS.output.push(group);
        setupCustomFileProperties(files, group.groupID);

        opts.on.groupstart(group);

        // No files in group - end immediately
        if (!files.length) {
            groupEnd();
            return;
        }

        var supportsSync = sync && FileReaderSyncSupport;
        var syncWorker;

        // Only initialize the synchronous worker if the option is enabled - to prevent the overhead
        if (supportsSync) {
            syncWorker = makeWorker(workerScript);
            syncWorker.onmessage = function(e) {
                var file = e.data.file;
                var result = e.data.result;

                // Workers seem to lose the custom property on the file object.
                if (!file.extra) {
                    file.extra = e.data.extra;
                }

                file.extra.ended = new Date();

                // Call error or load event depending on success of the read from the worker.
                opts.on[result === "error" ? "error" : "load"]({ target: { result: result } }, file);
                groupFileDone();
            };
        }

        Array.prototype.forEach.call(files, function(file) {

            file.extra.started = new Date();

            if (opts.accept && !file.type.match(new RegExp(opts.accept))) {
                opts.on.skip(file);
                groupFileDone();
                return;
            }

            if (opts.on.beforestart(file) === false) {
                opts.on.skip(file);
                groupFileDone();
                return;
            }

            var readAs = getReadAsMethod(file.type, opts.readAsMap, opts.readAsDefault);

            if (syncWorker) {
                syncWorker.postMessage({
                    file: file,
                    extra: file.extra,
                    readAs: readAs
                });
            }
            else {

                var reader = new FileReader();
                reader.originalEvent = e;

                fileReaderEvents.forEach(function(eventName) {
                    reader['on' + eventName] = function(e) {
                        if (eventName == 'load' || eventName == 'error') {
                            file.extra.ended = new Date();
                        }
                        opts.on[eventName](e, file);
                        if (eventName == 'loadend') {
                            groupFileDone();
                        }
                    };
                });
                reader[readAs](file);
            }
        });
    }
