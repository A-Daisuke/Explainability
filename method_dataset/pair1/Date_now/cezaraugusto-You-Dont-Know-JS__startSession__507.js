function startSession(userID) {
	var sess_id;

	// find a new session-ID
	do {
		sess_id = Util.guid();
	} while (sess_id in sessions);

	// assign the user to the session
	sessions[sess_id] = {
		user_id: userID,
		timestamp: Date.now()
	};

	return sess_id;
}
