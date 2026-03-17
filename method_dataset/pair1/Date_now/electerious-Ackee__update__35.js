const update = async (id, data) => {
	const enhance = (entry) => {
		return entry == null ? entry : response(entry)
	}

	return enhance(
		await Action.findOneAndUpdate({
			id,
		}, {
			$set: {
				key: data.key,
				value: data.value,
				details: data.details,
				updated: Date.now(),
			},
		}, {
			new: true,
		}),
	)
}
