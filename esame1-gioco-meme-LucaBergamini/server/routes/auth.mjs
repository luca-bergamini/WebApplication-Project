import passport from "passport";
import LocalStrategy from 'passport-local'
import { getUser } from "../dao/userDAO.mjs";

//Passport: set up local strategy to do the login
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await getUser(username, password);
    if (!user)
        return callback(null, false, 'Incorrect username or password');
    return callback(null, user);
}))

passport.serializeUser(function (user, callback) {
    callback(null, user);
});

passport.deserializeUser(function (user, callback) {
    return callback(null, user);
});

//Per autenticare una route
export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authorized' });
}