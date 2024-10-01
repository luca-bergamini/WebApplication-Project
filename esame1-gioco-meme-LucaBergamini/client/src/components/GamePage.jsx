import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import API from "../API.mjs";
import { Container, Col, ProgressBar } from "react-bootstrap";
import { Round } from "../../../server/models/Round.mjs";
import MemeComponent from "./MemeComponent";
import { MatchHistory } from "../../../server/models/MatchHistory.mjs";
import PopUpComponent from "./PopUpComponent";
import GameResultPage from "./GameResultPage";
import { Meme } from "../../../server/models/Meme.mjs";
import { Caption } from "../../../server/models/Caption.mjs";

function GamePage({ user, loggedIn }) {
    const timeToPlay = 30;
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState(timeToPlay);
    const [round, setRound] = useState(0);
    const [game, setGame] = useState([]);
    const [viewRes, setViewRes] = useState(false);
    const [popup, setPopUp] = useState({ res: [], show: false });

    useEffect(() => {
        startGame();

        const timer1 = setInterval(() => {
            setTime(oldTime => oldTime - 1);
        }, 1000);
        return () => clearInterval(timer1);
    }, []);

    useEffect(() => {
        if (round >= memes.length && !loading)
            handleFinishGame();
    }, [round, loading]);

    useEffect(() => {
        if (time <= 0 && !loading && !viewRes) {
            checkCapiton(null);
        }
    }, [time, loading]);

    const getMemes = async () => {
        try {
            const memes = await API.getMemes();
            setMemes(memes);
            setLoading(false);
        } catch (e) {
            console.log("Error while getting memes (fe): ", e);
        }
    }

    const startGame = () => {
        setLoading(true);
        getMemes();
        setTime(timeToPlay);
        setGame({totalScore: 0, rounds: []});
        setRound(0);
        setViewRes(false);
    }

    const handleNextRound = () => {
        setTime(timeToPlay);
        setRound(oldRound => oldRound + 1);
    }

    const checkCapiton = async (selectedCaption) => {
        setLoading(true);
        const meme = memes[round].meme;
        const newRound = new Round(null, new Meme(meme.id, meme.url), new Caption(null, null), 0);

        try {
            const correctCaptions = await API.checkCaption(meme.id);
            let isCorrect = false;

            if(selectedCaption) {
                isCorrect = correctCaptions.some(c => c.id === selectedCaption.id);
                newRound.caption = new Caption(selectedCaption.id, selectedCaption.text);
                newRound.score = isCorrect ? 5 : 0;

                if(isCorrect) {
                    setGame(oldGame => ({
                        ...oldGame,
                        totalScore: oldGame.totalScore + 5
                    }));
                }
            }

            setGame(oldGame => ({
                ...oldGame,
                rounds: [...oldGame.rounds, newRound]
            }));

            const popUpRes = isCorrect ? true : correctCaptions;
            setPopUp({ res: popUpRes, show: true});

            handleNextRound();
        } catch (e) {
            console.log("Error while checking the correct caption (fe): ", e);
        }
        setLoading(false);
    }

    const saveGame = async () => {
        try {
            const currDate = new Date();
            const formattedDate = currDate.toISOString().slice(0, 10); //Lo slice per prendere YYYY-MM-DD
            const currMatch = new MatchHistory(null, user.id, formattedDate, game.totalScore);
            const id = await API.addMatch(currMatch, game.rounds);
            return id;
        } catch (e) {
            console.log("Error while saving the game on db (fe): ", e);
        }
    }

    const handleFinishGame = async () => {
        try {
            if(user !== null) {
                await saveGame(game);
            }
            setViewRes(true);
        } catch(e) {
            console.log("Error while finishing the game");
        }
    }

    const handlePlayAgain = () => {
        startGame();
    }

    return (<>
        <Container className="text-center">
            <PopUpComponent setPopUp={setPopUp} popup={popup} />
            {!loading && !viewRes &&  (
                <>
                    <h4 className="mt-3">Punteggio totale: {game.totalScore}</h4>
                    {memes.map((meme, i) => (
                        (i === round || (round === 3 && i === round - 1)) && (
                            <MemeComponent round={round} key={i} meme={meme} handleCaptionClick={checkCapiton} />
                        )
                    ))}
                    <TimerComponent timer={time} round={round}/>
                </>
            )}
            {viewRes && (
                <GameResultPage loggedIn={loggedIn} user={user} handlePlayAgain={handlePlayAgain} game={game} />
            )}
        </Container>
        </>
    )
}

export default GamePage;

GamePage.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        name: PropTypes.string,
        surname: PropTypes.string
    }),
    handleLogout: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired
}

function TimerComponent({ timer }) {
    return (
        <Col className="mb-5 ">
            <h5>Tempo rimanente: {timer}s</h5>
            <ProgressBar now={(timer / 30) * 100} animated variant='info' />
        </Col>
    )
}

TimerComponent.propTypes = {
    timer: PropTypes.number.isRequired,
}