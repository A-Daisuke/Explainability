const update = async (id, data) => {
	const enhance = (entry) => {
		return entry == null ? entry : response(entry)
	}

	return enhance(
		await PermanentToken.findOneAndUpdate({
			id,
		}, {
			$set: {
				title: data.title,
				updated: Date.now(),
			},
		}, {
			new: true,
		}),
	)
}
