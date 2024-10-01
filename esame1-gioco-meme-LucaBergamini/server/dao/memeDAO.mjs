import { Meme } from '../models/Meme.mjs'
import { db } from '../db/db.mjs'

//get all memes
export const getNRandomMemes = (num) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM memes"
        db.all(sql, [], (err, rows) => {
            if(err)
                return reject(err);
            else {
                const memes = rows.map((row) => new Meme(row.id, row.url));
                const sortedMemes = memes.sort(() => Math.random() - 0.5);
                const nMemes = sortedMemes.slice(0, num);
                return resolve(nMemes);
            }
        })
    })
}

export const getCorrectAnswer = (memeId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM captionMatchesMeme WHERE memeId = ?";
        db.all(sql, [memeId], (err, rows) => {
            if(err)
                return reject(err);
            else {
                
            }
        })
    })
}