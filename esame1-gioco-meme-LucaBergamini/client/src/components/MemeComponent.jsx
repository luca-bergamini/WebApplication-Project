import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Image } from "react-bootstrap";

function MemeComponent({ meme, round, handleCaptionClick }) {
    return (
        <Container className="cont">
            <Row className="align-items-center">
                <Col xs={12} md={6}>
                    <Image
                        src={meme.meme.url}
                        rounded
                        fluid
                        style={{
                            height: 'auto',
                            objectFit: 'cover',
                            maxHeight: '400px'
                        }}
                    />
                </Col>

                <Col xs={12} md={6}>
                    <Row className="justify-content-center">
                        {meme.captions.map((caption, i) => (
                            <Col xs={6} md={6} key={i} className="mb-3">
                                <Button
                                    variant="info"
                                    onClick={() => {
                                        if(round > 2) return;
                                        handleCaptionClick(caption)
                                    }}
                                >
                                    {caption.text}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default MemeComponent;

MemeComponent.propTypes = {
    meme: PropTypes.shape({
        meme: PropTypes.shape({
            id: PropTypes.number,
            url: PropTypes.string.isRequired
        }),
        captions: PropTypes.array
    }),
    round: PropTypes.number,
    handleCaptionClick: PropTypes.func.isRequired
}