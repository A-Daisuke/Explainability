function getCSVRecords(dir) {

	function getFileData(filename) {
		return ASQ(function(done){
			var st = fs.statSync(filename), records = [],
				field_names
			;

			if (st.isFile()) {
				csv()
				.from.stream(fs.createReadStream(filename))
				.on("record",function(row) {
					if (!field_names) {
						field_names = row;
					}
					else {
						records.push(
							row.reduce(function(record,val,idx){
								record[field_names[idx]] = val;
								return record;
							},{})
						);
					}
				})
				.on("end",function(){
					done(filename,records);
				})
				.on("error",done.fail);
			}
			else {
				done();
			}
		});
	}

	return ASQ()
	.gate.apply(ø,
		fs.readdirSync(dir)
		.map(function(file){
			return function __segment__(done) {
				getFileData(path.join(__dirname,"csv",file))
				.pipe(done);
			};
		})
	)
	.val(function(){
		return Array.prototype.slice.call(arguments)
		.reduce(function(records,fileData){
			records[
				fileData[0]
				.replace(/^.*\/\$(\d+)\.00(.*)?\.csv$/,"reward=$1$2")
			] = fileData[1];
			return records;
		},{});
	});
}
