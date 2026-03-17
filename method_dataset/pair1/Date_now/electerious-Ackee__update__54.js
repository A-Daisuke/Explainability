const update = async (id) => {
	const enhance = (entry) => {
		return entry == null ? entry : response(entry)
	}

	return enhance(
		await Record.findOneAndUpdate({
			id,
		}, {
			$set: {
				updated: Date.now(),
			},
		}, {
			new: true,
		}),
	)
}
