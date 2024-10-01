import { db } from '../db/db.mjs';
import { User } from '../models/User.mjs'
import crypto from 'crypto';

//get the user for the autentication
export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.get(sql, [username], (err, row) => {
            if (err) {
                return reject(err)
            } else if (row === undefined) {
                return resolve(false);
            } else {    //Confronto se la password è corretta
                const user = new User(row.id, row.username, row.name, row.surname);
                const hashedPassword = crypto.scryptSync(password, row.salt, 16)
                const passwordHex = Buffer.from(row.password, "hex")
                if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) return resolve(false)
                return resolve(user)
            }
        })
    })
}