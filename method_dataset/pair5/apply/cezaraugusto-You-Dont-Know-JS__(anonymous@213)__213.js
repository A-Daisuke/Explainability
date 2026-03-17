function __method_wrapper__() {
	.seq(function(rewardLevels){
		var steps = [];

		Object.keys(rewardLevels).forEach(function(level){
			steps = steps.concat(
				rewardLevels[level].map(function(record){
					setRewardLevelFlags(level,record);
					record["Email"] = record["Email"].toLowerCase().substr(0,100);
					record["Pledge Amount"] = record["Pledge Amount"].replace(/^\$(\d+\.\d+).*$/,"$1");

					return function __step__(done){
						generateUser(record)
						.pipe(done);
					};
				})
			);
		});

		return ASQ()
		.waterfall.apply(ø,steps);
	})

}
