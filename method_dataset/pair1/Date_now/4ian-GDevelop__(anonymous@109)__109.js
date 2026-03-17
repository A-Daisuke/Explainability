const fakeGameMetrics = new Array(7).fill(0).map((_, index) => {
  const date = new Date(Date.now() - (7 - index) * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  const sessions = Math.round(Math.random() * 50); // between 0 and 50 sessions.
  const duration = Math.random() * 300 + 20; // Between 20 and 320 seconds per session.
  const playersPercentage = (90 + (Math.random() - 0.5) * 5) / 100; // There are slightly less players than sessions (around 85%-95% of sessions).
  const players = Math.round(sessions * playersPercentage);
  const newPlayers = random(0, players); // A random number of players are new players.

  let remainingPlayers = players;
  const sessionsDurations = sessionDurations.map((duration, index) => {
    if (index === sessionDurations.length - 1) return remainingPlayers;
    const playersForThatDuration = random(0, remainingPlayers);
    remainingPlayers = remainingPlayers - playersForThatDuration;
    return playersForThatDuration;
  });
  return {
    gameId: game1.id,
    date,
    sessions: {
      d0Sessions: sessions,
      d0SessionsDurationTotal: duration,
    },
    players: {
      d0Players: players,
      d0NewPlayers: newPlayers,
      d0PlayersBelow60s: sessionsDurations[0],
      d0PlayersBelow180s: sessionsDurations[1],
      d0PlayersBelow300s: sessionsDurations[2],
      d0PlayersBelow600s: sessionsDurations[3],
      d0PlayersBelow900s: sessionsDurations[4],
    },
    retention: null,
  };
});
