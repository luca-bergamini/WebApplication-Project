import express from 'express';
import { getCorrectAnswer, getNRandomMemes } from "../dao/memeDAO.mjs";
import { getMatchedCaptions, getMemeAndCaptions } from "../dao/matchDAO.mjs";
import { check } from 'express-validator';

const memeRouter = express.Router();

// GET /api/memes
memeRouter.get('/', async (req, res) => {
    try {
        let memes;

        if (req.isAuthenticated())
            memes = await getNRandomMemes(3);
        else
            memes = await getNRandomMemes(1);

        const memeWithCaptions = [];

        for (const meme of memes) {
            const details = await getMemeAndCaptions(meme);
            memeWithCaptions.push(details);
        }

        res.json(memeWithCaptions);
    } catch (e) {
        console.error("Error while getting memes infos: ", e);
        res.status(500).end();
    }
});

// POST /api/memes/caption
memeRouter.post('/caption', [
  check('memeId').isNumeric()
], async (req, res) => {
  try {
    let result = false;
    const memeId = req.body.memeId;

    const captions = await getMatchedCaptions(memeId);

    res.json(captions);
  } catch (e) {
    console.log("Error while getting the right caption: ", e);
    res.status(500).end();
  }
})

export default memeRouter;