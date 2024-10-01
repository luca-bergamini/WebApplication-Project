import express from 'express';
import { isLoggedIn } from '../routes/auth.mjs'
import { check, validationResult } from 'express-validator';
import { addMatch, addRound, getMatchWithRounds } from '../dao/matchDAO.mjs';

const matchRouter = express.Router();

// GET /api/matches/<userId>
matchRouter.get('/:userId', isLoggedIn, async (req, res) => {
    try {
        const matches = await getMatchWithRounds(req.params.userId);
        res.json(matches);
    } catch(e) {
        console.error("Error while getting the matches");
        res.status(500).end();
    }
});

// POST /api/matches/<userId>/match
matchRouter.post('/:userId/match', isLoggedIn, [
    check('date').isDate({format: 'YYYY-MM-DD', strictMode: true}),
    check('totalScore').isNumeric().custom(value => {
        if (value != 0 && value != 5 && value != 10 && value != 15) {
            throw new Error('Value need to be 0 or 5');
        }
        return true;
    }),
    check('rounds').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    const newMatch = {date: req.body.date, totalScore: req.body.totalScore};
    const rounds = req.body.rounds;
    const userId = req.params.userId;

    try {
        const id = await addMatch(newMatch, userId);

        for(const round of rounds) {
            await addRound(round, id);
        }
        res.status(201).json({id: id});
    } catch(e) {
        console.error("Error while adding the match: ", e);
        res.status(503).json({error: 'Impossible to add the match'})
    }
});

export default matchRouter;