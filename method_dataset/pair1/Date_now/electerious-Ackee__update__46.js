const update = async (id, data) => {
	const enhance = (entry) => {
		return entry == null ? entry : response(entry)
	}

	return enhance(
		await Event.findOneAndUpdate({
			id,
		}, {
			$set: {
				title: data.title,
				type: data.type,
				updated: Date.now(),
			},
		}, {
			new: true,
		}),
	)
}
