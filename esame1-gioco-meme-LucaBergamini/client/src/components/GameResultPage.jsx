import PropTypes from 'prop-types';
import { Row, Col, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import GameComponent from "./GameComponent";

function GameResultPage({ user, handlePlayAgain, game, loggedIn }) {
    const navigate = useNavigate();

    const handleStatistics = (e) => {
        e.preventDefault();
        navigate(`/users/${user.username}`);
    }

    return (<>
        {
            <Container>
                <Row>
                    <Col>
                        <h2 className="text-center mb-2 mt-4">Riepilogo partita</h2>
                        <Col xs="auto" className="d-flex justify-content-center mb-4">
                            <Button size="lg" variant="info" onClick={() => { handlePlayAgain(); }}>
                                Gioca
                            </Button>
                            {loggedIn ? <Button size="lg" variant="warning" className="but-lr" onClick={handleStatistics}>
                                Statistiche
                            </Button> : <Link to={`/`} className='custom-button secondary'>Home</Link>
                            }
                        </Col>
                    </Col>
                    {loggedIn ? <GameComponent isProfile={false} game={game} /> : <h4>Punteggio ottenuto: {game.totalScore}</h4>}
                </Row>
            </Container>}
    </>
    )
}

export default GameResultPage;

GameResultPage.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        name: PropTypes.string,
        surname: PropTypes.string
    }),
    handlePlayAgain: PropTypes.func,
    game: PropTypes.object,
}