class __C__ {
    async startEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      let count = 0;
      let tempDate = lastDate;

      const { data: dismissedEmployees } = await this.convenia.getEmployeesTerminated({
        params: {
          from_date: lastDate,
        },
      });

      for (const employee of dismissedEmployees) {
        if (maxResults && (++count >= maxResults)) break;

        if (Date.parse(employee.dismissal.date) > Date.parse(tempDate)) {
          tempDate = employee.dismissal.date;
        }

        this.$emit(employee, {
          id: employee.dismissal.id,
          summary: `New Dismissal with ID: ${employee.dismissal.id}`,
          ts: Date.now(employee.dismissal.date),
        });
      }
      this._setLastDate(tempDate);
    },

}
