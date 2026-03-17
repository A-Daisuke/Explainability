class __C__ {
  async run({ $ }) {
    const {
      region,
      workgroupName,
      database,
      columns: columnStrings,
      from,
      where,
      sqlParameters,
      orderBy,
      limit,
    } = this;

    const columns = parseArray(columnStrings);

    const effectiveColumns =
      columns?.length > 0
        ? columns.join(", ")
        : "*";

    let sql = `SELECT ${effectiveColumns} FROM ${from}`;

    if (where) {
      sql += ` WHERE ${where}`;
    }
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }
    if (limit) {
      sql += " LIMIT :limit";
    }
    const parameters = Object.entries({
      ...parseJson(sqlParameters),
      limit,
    })
      .map(([
        name,
        value,
      ]) => ({
        name,
        value: String(value),
      }));

    const response = await this.app.executeStatement({
      region,
      workgroupName,
      database,
      sql,
      parameters,
    });
    $.export("$summary", `Successfully found \`${response.TotalNumRows}\` row(s).`);
    return response;
  },

}
