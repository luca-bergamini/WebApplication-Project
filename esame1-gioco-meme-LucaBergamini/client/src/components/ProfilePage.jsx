import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import API from "../API.mjs";
import GameComponent from "./GameComponent";

function ProfilePage({ user }) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noGames, setNoGames] = useState(false);
    const [totGames, setTotGames] = useState(0);
    const [totScores, setTotScores] = useState(0);

    useEffect(() => {
        const getGamesHistory = async () => {
            try {
                const obj = await API.getGames(user.id);
                if (obj === null) {
                    setNoGames(true);
                }
                setGames(obj);
                setLoading(false);
            } catch (e) {
                console.log("Error while getting the game history: ", e);
            }
        }
        setLoading(true);
        getGamesHistory();
    }, []);

    useEffect(() => {
        const setTot = () => {
            if (games === null) return;
            games.map((g, i) => {
                setTotGames(oldTot => oldTot + 1);
                setTotScores(oldScore => oldScore + g.totalScore);
            })
        }
        if (loading) return;
        setTot();
    }, [loading])

    return (
        <>
            {!loading && <Container className="mt-5">
                <Row >
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <h1 className="mb-4">Profilo</h1>
                        <Row className="mb-2">
                            <Col className="text-right"><h5>Username:</h5></Col>
                            <Col><p>{user.username}</p></Col>
                        </Row>
                        <Row className="mb-2">
                            <Col className="text-right"><h5>Nome:</h5></Col>
                            <Col><p>{user.name}</p></Col>
                        </Row>
                        <Row>
                            <Col className="text-right"><h5>Cognome:</h5></Col>
                            <Col><p>{user.surname}</p></Col>
                        </Row>
                        <Row className="mt-3 mb-3">
                            <Col className="text-right"><h5>Partite giocate:</h5></Col>
                            <Col><p>{totGames}</p></Col>
                        </Row>
                        <Row>
                            <Col className="text-right "><h5>Punti effettuati:</h5></Col>
                            <Col><p>{totScores}/{15 * totGames}</p></Col>
                        </Row>
                        <h1 className="mt-4 mb-4">Statistiche partite</h1>
                    </Col>
                </Row>
                {!noGames && games.map((g, i) => (
                    <Col key={i} className="mb-4">
                        <GameComponent isProfile={true} game={g} />
                    </Col>
                ))}
                {noGames && <Col className="mb-4">
                    <h5>Non ci sono partite giocate..</h5>
                </Col>}

            </Container>}
        </>
    )
}

export default ProfilePage;

ProfilePage.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired
    }),
    loggedIn: PropTypes.bool
}