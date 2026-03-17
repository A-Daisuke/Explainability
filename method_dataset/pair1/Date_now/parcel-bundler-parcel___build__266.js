function __method_wrapper__() {
  async _build({
    signal,
    startTime = Date.now(),
  }: {|
    signal?: AbortSignal,
    startTime?: number,
  |} = {
    /*::...null*/
  }): Promise<BuildEvent> {
    this.#requestTracker.setSignal(signal);
    let options = nullthrows(this.#resolvedOptions);
    try {
      if (options.shouldProfile) {
        await this.startProfiling();
      }
      if (options.shouldTrace) {
        tracer.enable();
      }
      await this.#reporterRunner.report({
        type: 'buildStart',
      });

      this.#requestTracker.graph.invalidateOnBuildNodes();

      let request = createParcelBuildRequest({
        optionsRef: this.#optionsRef,
        requestedAssetIds: this.#requestedAssetIds,
        signal,
      });

      let {bundleGraph, bundleInfo, changedAssets, assetRequests} =
        await this.#requestTracker.runRequest(request, {force: true});

      this.#requestedAssetIds.clear();

      await dumpGraphToGraphViz(
        // $FlowFixMe
        this.#requestTracker.graph,
        'RequestGraph',
        requestGraphEdgeTypes,
      );

      let event = {
        type: 'buildSuccess',
        changedAssets: new Map(
          Array.from(changedAssets).map(([id, asset]) => [
            id,
            assetFromValue(asset, options),
          ]),
        ),
        bundleGraph: new BundleGraph<IPackagedBundle>(
          bundleGraph,
          (bundle, bundleGraph, options) =>
            PackagedBundle.getWithInfo(
              bundle,
              bundleGraph,
              options,
              bundleInfo.get(bundle.id),
            ),
          options,
        ),
        buildTime: Date.now() - startTime,
        requestBundle: async bundle => {
          let bundleNode = bundleGraph._graph.getNodeByContentKey(bundle.id);
          invariant(bundleNode?.type === 'bundle', 'Bundle does not exist');

          if (!bundleNode.value.isPlaceholder) {
            // Nothing to do.
            return {
              type: 'buildSuccess',
              changedAssets: new Map(),
              bundleGraph: event.bundleGraph,
              buildTime: 0,
              requestBundle: event.requestBundle,
              unstable_requestStats: {},
            };
          }

          for (let assetId of bundleNode.value.entryAssetIds) {
            this.#requestedAssetIds.add(assetId);
          }

          if (this.#watchQueue.getNumWaiting() === 0) {
            if (this.#watchAbortController) {
              this.#watchAbortController.abort();
            }

            this.#watchQueue.add(() => this._startNextBuild());
          }

          let results = await this.#watchQueue.run();
          let result = results.filter(Boolean).pop();
          if (result.type === 'buildFailure') {
            throw new BuildError(result.diagnostics);
          }

          return result;
        },
        unstable_requestStats: this.#requestTracker.flushStats(),
      };

      await this.#reporterRunner.report(event);
      await this.#requestTracker.runRequest(
        createValidationRequest({optionsRef: this.#optionsRef, assetRequests}),
        {force: assetRequests.length > 0},
      );

      if (this.#reporterRunner.errors.length) {
        throw this.#reporterRunner.errors;
      }

      return event;
    } catch (e) {
      if (e instanceof BuildAbortError) {
        throw e;
      }

      let diagnostic = anyToDiagnostic(e);
      let event = {
        type: 'buildFailure',
        diagnostics: Array.isArray(diagnostic) ? diagnostic : [diagnostic],
        unstable_requestStats: this.#requestTracker.flushStats(),
      };

      await this.#reporterRunner.report(event);
      return event;
    } finally {
      if (this.isProfiling) {
        await this.stopProfiling();
      }

      await this.#farm.callAllWorkers('clearConfigCache', []);
    }
  }

}
