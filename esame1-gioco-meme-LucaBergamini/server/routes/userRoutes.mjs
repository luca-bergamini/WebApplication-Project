import passport from "passport";
import express from 'express';

const userRouter = express.Router();

// POST /api/users/sessions -- NEW -- Per fare il login
userRouter.post('/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).send(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            return res.status(201).json(req.user);
        });
    })(req, res, next);
});

// DELETE /api/users/session/current -- NEW -- Per fare il logout
userRouter.delete('/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});

export default userRouter;