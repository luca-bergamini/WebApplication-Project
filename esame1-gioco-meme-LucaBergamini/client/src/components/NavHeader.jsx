import React from 'react';
import PropTypes from 'prop-types';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { LogoutButton } from './AuthComponent';
import { Link } from 'react-router-dom';

function NavHeader({ loggedIn, handleLogout }) {

    return (
        <Navbar bg="info" data-bs-theme="dark" expand="lg" >
            <Container>
                <Navbar.Brand>What do you meme?</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={`/`}>Home</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                {loggedIn &&
                    <Navbar.Collapse className="justify-content-end">
                        <LogoutButton logout={handleLogout}/>
                    </Navbar.Collapse>}
            </Container>
        </Navbar >
    );
}

export default NavHeader;

NavHeader.propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    handleLogout: PropTypes.func.isRequired,
}