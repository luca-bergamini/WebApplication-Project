import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../allCss.css'
import LogoComponent from './LogoComponent';
import PropTypes from 'prop-types';

function PresentationPage({ loggedIn, user }) {
    return (
        <Container className="presentation-container">
            <Row>
                <Col>
                    <LogoComponent />
                </Col>
            </Row>
            {!loggedIn && <Row className='mb-5'>
                <h6>Benvenuto in what do you meme, avrai la possibilità di giocare 3 round se effettui il login, soltanto uno se invece decidi di giocare come ospite!</h6>
            </Row>}
            <Row>
                {!loggedIn && <Col>
                    <Link to='/login' className='custom-button primary'>Login</Link>
                    <Link to='/matches/guest' className='custom-button secondary'>Ospite</Link>
                </Col>}
                {loggedIn && <Col>
                    <Link to={`/play`} className='custom-button primary'>Nuova partita</Link>
                    <Link to={`/users/${user.username}`} className='custom-button secondary'>Statistiche</Link>
                </Col>}
            </Row>
        </Container>
    );
}

export default PresentationPage;

PresentationPage.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.shape({
        username: PropTypes.string,
        name: PropTypes.string,
        surname: PropTypes.string
    }),
}