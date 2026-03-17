function __method_wrapper__() {
    async mapBattle({ groupInfo , challengeProgress , bankaraMatchChallenge , listNode , detail: vsDetail , rankBeforeState , rankState  }) {
        const { knockout , vsRule: { rule  } , myTeam , otherTeams , bankaraMatch , leagueMatch , festMatch , playedTime  } = vsDetail;
        const self = vsDetail.myTeam.players.find((i)=>i.isMyself);
        if (!self) {
            throw new Error("Self not found");
        }
        const startedAt = Math.floor(new Date(playedTime).getTime() / 1000);
        if (otherTeams.length === 0) {
            throw new Error(`Other teams is empty`);
        }
        const result = {
            uuid: await gameId(vsDetail.id),
            lobby: this.mapLobby(vsDetail),
            rule: SPLATNET3_STATINK_MAP.RULE[vsDetail.vsRule.rule],
            stage: await this.mapStage(vsDetail),
            result: SPLATNET3_STATINK_MAP.RESULT[vsDetail.judgement],
            weapon: b64Number(self.weapon.id).toString(),
            inked: self.paint,
            rank_in_team: vsDetail.myTeam.players.indexOf(self) + 1,
            medals: vsDetail.awards.map((i)=>i.name),
            our_team_players: await Promise.all(myTeam.players.map(this.mapPlayer)),
            their_team_players: await Promise.all(otherTeams[0].players.map(this.mapPlayer)),
            agent: AGENT_NAME,
            agent_version: S3SI_VERSION,
            agent_variables: {
                "Upload Mode": this.uploadMode
            },
            automated: "yes",
            start_at: startedAt,
            end_at: startedAt + vsDetail.duration
        };
        if (self.result) {
            result.kill_or_assist = self.result.kill;
            result.assist = self.result.assist;
            result.kill = result.kill_or_assist - result.assist;
            result.death = self.result.death;
            result.signal = self.result.noroshiTry ?? undefined;
            result.special = self.result.special;
        }
        result.our_team_color = this.mapColor(myTeam.color);
        result.their_team_color = this.mapColor(otherTeams[0].color);
        if (otherTeams.length === 2) {
            result.third_team_color = this.mapColor(otherTeams[1].color);
        }
        if (festMatch) {
            result.fest_dragon = SPLATNET3_STATINK_MAP.DRAGON[festMatch.dragonMatchType];
            result.clout_change = festMatch.contribution;
            result.fest_power = festMatch.myFestPower ?? undefined;
        }
        if (rule === "TURF_WAR" || rule === "TRI_COLOR") {
            result.our_team_percent = (myTeam?.result?.paintRatio ?? 0) * 100;
            result.their_team_percent = (otherTeams?.[0]?.result?.paintRatio ?? 0) * 100;
            result.our_team_inked = myTeam.players.reduce((acc, i)=>acc + i.paint, 0);
            result.their_team_inked = otherTeams?.[0].players.reduce((acc, i)=>acc + i.paint, 0);
            if (myTeam.festTeamName) {
                result.our_team_theme = myTeam.festTeamName;
            }
            if (myTeam.tricolorRole) {
                result.our_team_role = myTeam.tricolorRole === "DEFENSE" ? "defender" : "attacker";
            }
            if (otherTeams[0].festTeamName) {
                result.their_team_theme = otherTeams[0].festTeamName;
            }
            if (otherTeams[0].tricolorRole) {
                result.their_team_role = otherTeams[0].tricolorRole === "DEFENSE" ? "defender" : "attacker";
            }
            if (otherTeams.length === 2) {
                result.third_team_players = await Promise.all(otherTeams[1].players.map(this.mapPlayer));
                result.third_team_percent = (otherTeams[1]?.result?.paintRatio ?? 0) * 100;
                result.third_team_inked = otherTeams[1].players.reduce((acc, i)=>acc + i.paint, 0);
                if (otherTeams[1].festTeamName) {
                    result.third_team_theme = otherTeams[1].festTeamName;
                }
                if (otherTeams[1].tricolorRole) {
                    result.third_team_role = otherTeams[1].tricolorRole === "DEFENSE" ? "defender" : "attacker";
                }
            }
        }
        if (knockout) {
            result.knockout = knockout === "NEITHER" ? "no" : "yes";
        }
        result.our_team_count = myTeam?.result?.score ?? undefined;
        result.their_team_count = otherTeams?.[0]?.result?.score ?? undefined;
        result.rank_exp_change = bankaraMatch?.earnedUdemaePoint ?? undefined;
        if (listNode?.udemae) {
            [result.rank_before, result.rank_before_s_plus] = parseUdemae(listNode.udemae);
        }
        if (bankaraMatchChallenge && challengeProgress) {
            result.rank_up_battle = bankaraMatchChallenge.isPromo ? "yes" : "no";
            if (challengeProgress.index === 0 && bankaraMatchChallenge.udemaeAfter) {
                [result.rank_after, result.rank_after_s_plus] = parseUdemae(bankaraMatchChallenge.udemaeAfter);
                result.rank_exp_change = bankaraMatchChallenge.earnedUdemaePoint ?? undefined;
            } else {
                result.rank_after = result.rank_before;
                result.rank_after_s_plus = result.rank_before_s_plus;
            }
        }
        if (leagueMatch) {
            result.event = leagueMatch.leagueMatchEvent?.id;
            result.event_power = leagueMatch.myLeaguePower;
        }
        if (challengeProgress) {
            result.challenge_win = challengeProgress.winCount;
            result.challenge_lose = challengeProgress.loseCount;
        }
        if (vsDetail.xMatch) {
            result.x_power_before = result.x_power_after = vsDetail.xMatch.lastXPower;
            if (groupInfo?.xMatchMeasurement && groupInfo?.xMatchMeasurement.state === "COMPLETED" && challengeProgress?.index === 0) {
                result.x_power_after = groupInfo.xMatchMeasurement.xPowerAfter;
            }
        }
        result.bankara_power_after = vsDetail.bankaraMatch?.bankaraPower?.power;
        if (rankBeforeState && rankState) {
            result.rank_before_exp = rankBeforeState.rankPoint;
            result.rank_after_exp = rankState.rankPoint;
            if (!bankaraMatchChallenge?.isUdemaeUp && result.rank_exp_change === undefined) {
                result.rank_exp_change = result.rank_after_exp - result.rank_before_exp;
            }
            if (!result.rank_after) {
                [result.rank_after, result.rank_after_s_plus] = parseUdemae(rankState.rank);
            }
        }
        return result;
    }

}
