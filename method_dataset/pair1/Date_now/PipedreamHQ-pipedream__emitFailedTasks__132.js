function __method_wrapper__() {
    async emitFailedTasks({
      database, schemas, taskName,
    }) {
      // Get the timestamp of the last run, if available. Else set the start time to 1 day ago
      const lastRun = this._getLastMaxTimestamp() ?? +Date.now() - (1000 * 60 * 60 * 24);
      console.log(`Max ts of last run: ${lastRun}`);

      let results;
      const opts = {
        startTime: lastRun,
        taskName,
      };

      if (database && schemas) {
        results = await this.snowflake.getFailedTasksInDatabase({
          ...opts,
          database,
          schemas,
        });
      } else {
        throw new Error("Must provide a database and schema");
      }

      console.log(`Raw results: ${JSON.stringify(results, null, 2)}`);

      for (const result of results) {
        const {
          QUERY_ID: queryId,
          QUERY_TEXT: queryText,
          NAME: taskName,
          DATABASE_NAME: taskDatabase,
          SCHEMA_NAME: taskSchema,
          ERROR_CODE: errorCode,
          ERROR_MESSAGE: errorMessage,
          QUERY_START_TIME: queryStartTime,
          NEXT_SCHEDULE_TIME: nextScheduleTime,
          SCHEDULED_TIME: scheduledTime,
          COMPLETED_TIME: completedTime,
          RUN_ID: runId,
          SCHEDULED_FROM: scheduledFrom,
        } = result;

        this.$emit(
          {
            taskName,
            taskDatabase,
            taskSchema,
            queryId,
            queryText,
            errorCode,
            errorMessage,
            queryStartTime,
            nextScheduleTime,
            scheduledTime,
            completedTime,
            runId,
            scheduledFrom,
          },
          {
            id: runId,
            summary: `Failed task ${taskName}`,
            ts: +queryStartTime,
          },
        );
      }

      this._setLastMaxTimestamp(Date.now());
    },

}
