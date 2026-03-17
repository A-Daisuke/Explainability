class __C__ {
    async mapCoop({ gradeBefore , groupInfo , detail  }) {
        const { dangerRate , resultWave , bossResult , myResult , memberResults , scale , playedTime , enemyResults , smellMeter , waveResults  } = detail;
        const startedAt = Math.floor(new Date(playedTime).getTime() / 1000);
        const golden_eggs = waveResults.reduce((prev, i)=>prev + i.teamDeliverCount, 0);
        const power_eggs = myResult.deliverCount + memberResults.reduce((p, i)=>p + i.deliverCount, 0);
        const bosses = Object.fromEntries(enemyResults.map((i)=>[
                b64Number(i.enemy.id),
                {
                    appearances: i.popCount,
                    defeated: i.teamDefeatCount,
                    defeated_by_me: i.defeatCount
                }
            ]));
        const title_after = detail.afterGrade ? b64Number(detail.afterGrade.id).toString() : undefined;
        const title_exp_after = detail.afterGradePoint;
        const maxWaves = detail.rule === "TEAM_CONTEST" ? 5 : 3;
        let clear_waves;
        if (waveResults.length > 0) {
            clear_waves = waveResults.filter((i)=>i.waveNumber < maxWaves + 1).length - 1 + (resultWave === 0 ? 1 : 0);
        } else {
            clear_waves = 0;
        }
        let title_before = undefined;
        let title_exp_before = undefined;
        if (gradeBefore) {
            title_before = b64Number(gradeBefore.grade.id).toString();
            title_exp_before = gradeBefore.gradePoint;
        } else {
            const expDiff = COOP_POINT_MAP[clear_waves];
            if (nonNullable(title_after) && nonNullable(title_exp_after) && nonNullable(expDiff)) {
                if (title_exp_after === 40 && expDiff === 20) {} else if (title_exp_after === 40 && expDiff < 0 && title_after !== "8") {} else if (title_exp_after === 999 && expDiff !== 0) {
                    title_before = title_after;
                } else {
                    if (title_exp_after - expDiff >= 0) {
                        title_before = title_after;
                        title_exp_before = title_exp_after - expDiff;
                    } else {
                        title_before = (parseInt(title_after) - 1).toString();
                    }
                }
            }
        }
        let fail_reason = null;
        if (clear_waves !== maxWaves && waveResults.length > 0) {
            const lastWave = waveResults[waveResults.length - 1];
            if (lastWave.teamDeliverCount >= lastWave.deliverNorm) {
                fail_reason = "wipe_out";
            }
        }
        const result = {
            uuid: await gameId(detail.id),
            private: groupInfo?.mode === "PRIVATE_CUSTOM" ? "yes" : "no",
            big_run: detail.rule === "BIG_RUN" ? "yes" : "no",
            eggstra_work: detail.rule === "TEAM_CONTEST" ? "yes" : "no",
            stage: b64Number(detail.coopStage.id).toString(),
            danger_rate: detail.rule === "TEAM_CONTEST" ? null : dangerRate * 100,
            clear_waves,
            fail_reason,
            king_smell: smellMeter,
            king_salmonid: this.mapKing(detail.bossResult?.boss.id),
            clear_extra: bossResult?.hasDefeatBoss ? "yes" : "no",
            title_before,
            title_exp_before,
            title_after,
            title_exp_after,
            golden_eggs,
            power_eggs,
            gold_scale: scale?.gold,
            silver_scale: scale?.silver,
            bronze_scale: scale?.bronze,
            job_point: detail.jobPoint,
            job_score: detail.jobScore,
            job_rate: detail.jobRate,
            job_bonus: detail.jobBonus,
            waves: await Promise.all(waveResults.map((w)=>this.mapWave(w))),
            players: await Promise.all([
                this.mapCoopPlayer(true, myResult),
                ...memberResults.map((p)=>this.mapCoopPlayer(false, p))
            ]),
            bosses,
            agent: AGENT_NAME,
            agent_version: S3SI_VERSION,
            agent_variables: {
                "Upload Mode": this.uploadMode
            },
            automated: "yes",
            start_at: startedAt
        };
        if (detail.rule === "TEAM_CONTEST") {
            let lastWave;
            for (const [wave] of result.waves.map((p, i)=>[
                    p,
                    i
                ])){
                let haz_level;
                if (!lastWave) {
                    haz_level = 60;
                } else {
                    const num_players = result.players.length;
                    const quota = lastWave.golden_quota;
                    const delivered = lastWave.golden_delivered;
                    let added_percent = 0;
                    if (num_players == 4) {
                        if (delivered >= quota * 2) {
                            added_percent = 60;
                        } else if (delivered >= quota * 1.5) {
                            added_percent = 30;
                        }
                    } else if (num_players == 3) {
                        if (delivered >= quota * 2) {
                            added_percent = 40;
                        } else if (delivered >= quota * 1.5) {
                            added_percent = 20;
                        }
                    } else if (num_players == 2) {
                        if (delivered >= quota * 2) {
                            added_percent = 20;
                        } else if (delivered >= quota * 1.5) {
                            added_percent = 10;
                            added_percent = 5;
                        }
                    } else if (num_players == 1) {
                        if (delivered >= quota * 2) {
                            added_percent = 10;
                        } else if (delivered >= quota * 1.5) {
                            added_percent = 5;
                        }
                    }
                    const prev_percent = lastWave.danger_rate;
                    haz_level = prev_percent + added_percent;
                }
                wave.danger_rate = haz_level;
                lastWave = wave;
            }
        }
        return result;
    }

}
