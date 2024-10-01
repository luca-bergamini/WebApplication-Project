import React from "react";
import PropTypes from 'prop-types';
import { Card, ListGroup, ListGroupItem, Row, Col, Image, Badge } from "react-bootstrap";

function GameComponent({ game, isProfile }) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    <Col style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Punteggio Totale: {game.totalScore}</span>
                    </Col>
                </Card.Title>
            </Card.Body>
            <ListGroup variant="flush">
                {
                    game.rounds.map((round, i) => {
                        if (round.score !== 0 && !isProfile) {
                            return (
                                <ListGroupItem key={i}>
                                    <Row className="align-items-center">
                                        <Col xs={2}>
                                            <Image
                                                src={round.meme.url}
                                                rounded
                                                fluid
                                                style={{ maxHeight: '50%', width: 'auto' }}
                                            />
                                        </Col>
                                        <Col xs={8} className="but-lr">
                                            <Row>
                                                <h6>{round.caption.text}</h6>
                                            </Row>
                                            <Row className="mt-1">
                                                <h5>
                                                    <Badge pill bg="info">
                                                        Risposta corretta!
                                                    </Badge>
                                                </h5>
                                            </Row>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            );
                        } else if (isProfile) {
                            return (
                                <ListGroupItem key={i}>
                                    <Row className="align-items-center">
                                        <Col xs={2}>
                                            <Image
                                                src={round.meme.url}
                                                rounded
                                                fluid
                                                style={{ maxHeight: '50%', width: 'auto' }}
                                            />
                                        </Col>
                                        <Col xs={8} className="but-lr">
                                            <h5>
                                                <Badge pill bg={round.score === 5 ? "info" : "danger"}>
                                                    Punteggio: {round.score}
                                                </Badge>
                                            </h5>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            );
                        } else {
                            return null;
                        }

                    })
                }
            </ListGroup>
        </Card>
    )
}

export default GameComponent;

GameComponent.propTypes = {
    data: PropTypes.string,
    game: PropTypes.object.isRequired,
}