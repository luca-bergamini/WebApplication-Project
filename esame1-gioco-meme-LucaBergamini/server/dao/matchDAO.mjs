import { Caption } from '../models/Caption.mjs'
import { Round } from '../models/Round.mjs';
import { db } from "../db/db.mjs";
import { Meme } from '../models/Meme.mjs';

//CAPTIONS
//get the two captions that match the meme by memeId
export const getMatchedCaptions = (memeId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM captions c JOIN captionMatchesMeme cmm ON c.id = cmm.captionId WHERE cmm.memeId = ?"
        db.all(sql, [memeId], (err, rows) => {
            if(err)
                return reject(err)
            else {
                const captions = rows.map((row) => new Caption(row.id, row.text));
                return resolve(captions);
            }
        })
    })
}

//get non matched caption for a memeId
const getNonMatchedCaptions = (memeId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM captions c JOIN captionMatchesMeme cmm ON c.id = cmm.captionId WHERE cmm.memeId != ?";
        db.all(sql, [memeId], (err, rows) => {
            if(err)
                return reject(err);
            else {
                const captions = rows.map((row) => new Caption(row.id, row.text));
                //Only need 5 random captions for the game
                const random5Cap = captions.sort(() => 0.5 - Math.random()).slice(0, 5);
                return resolve(random5Cap);
            }
        })
    })
}

export const getMemeAndCaptions = async (meme) => {
    const matchedCaptions = await getMatchedCaptions(meme.id);
    const nonMatchedCaptions = await getNonMatchedCaptions(meme.id);
    const allCaptions = [...matchedCaptions, ...nonMatchedCaptions].sort(() => 0.5 - Math.random());
    return { meme, captions: allCaptions };
}

//MATCHHISTORIES
//add user matchHistory
export const addMatch = (newMatch, userId) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO matchHistories(userId, date, totalScore) VALUES(?, DATE(?), ?)";
        db.run(sql, [userId, newMatch.date, newMatch.totalScore], function (err) {
            if(err)
                return reject(err);
            else
                return resolve(this.lastID);
        })
    })
}

//add round
export const addRound = (newRound, matchId) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO rounds(matchId, memeId, captionId, score) VALUES(?, ?, ?, ?)";
        db.run(sql, [matchId, newRound.meme.id, newRound.caption.id, newRound.score], function (err) {
            if(err)
                return reject(err);
            else
                return resolve(this.lastID);
        })
    })
}

//get match and it's rounds 
export const getMatchWithRounds = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM matchHistories WHERE userId = ?";
        db.all(sql, [userId], (err, rows) => {
            if(err) {
                return reject(err);
            } else if(rows.length === 0) {
                return resolve(null);
            } else {
                let matches = [];
                let remaining = rows.length;
                rows.forEach(match => {
                    const sql = "SELECT * FROM rounds r LEFT JOIN captions c ON c.id = r.captionId INNER JOIN memes m ON m.id = r.memeId WHERE matchId = ?";
                    db.all(sql, [match.id], (err, rows) => {
                        if(err){
                            return reject(err);
                        }
                        else {
                            matches.push({
                                matchId: match.id,
                                date: match.date,
                                totalScore: match.totalScore,
                                rounds: rows.map(row => new Round(match.id, new Meme(row.memeId, row.url), new Caption(row.captionId, row.text), row.score))
                            });

                            remaining -= 1;

                            if(remaining === 0) {
                                return resolve(matches);
                            }
                        }
                    })
                })
            }
        })
    })
}