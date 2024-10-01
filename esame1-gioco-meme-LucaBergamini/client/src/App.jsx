import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import './App.css'
import NavHeader from './components/NavHeader';
import PresentationPage from './components/PresentationPage';
import { LoginForm } from './components/AuthComponent';
import API from './API.mjs'
import ProfilePage from './components/ProfilePage';
import GamePage from './components/GamePage';
import GameResultPage from './components/GameResultPage';
import PropTypes from "prop-types";
import { Modal, Button } from 'react-bootstrap';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);

    const navigate = useNavigate();

    const handleLogout = async () => {
        await API.logOut();
        setLoggedIn(false);
        setUser(null);
        navigate('/');
    };

    const handleLogin = async (credentials) => {
        try {
            const u = await API.logIn(credentials);
            setLoggedIn(true);
            setUser(u);
            navigate(`/`);
        } catch (err) {
            setError(err);
            setShow(true);
        }
    };

    const handleClose = () => {
        setError('');
        setShow(false);
    }

    return (
        <Routes>
            <Route element={<>
                <ModalLogin show={show} error={error} handleClose={handleClose} />
                {loggedIn && <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />}
                <Outlet />
            </>
            }>
                <Route index element={
                    <PresentationPage loggedIn={loggedIn} user={user} />
                } />
                <Route path='/play' element={
                    <GamePage user={user} handleLogout={handleLogout} loggedIn={loggedIn} />
                } />
                <Route path='/users/:username' element={
                    loggedIn ? <ProfilePage user={user} /> : <Navigate replace to='/' />
                } />
                <Route path='/matches/guest' element={
                    <GamePage user={null} handleLogout={handleLogout} loggedIn={loggedIn} />
                } />
                <Route path='/login' element={
                    loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
                } />
            </Route>
        </Routes>
    )
}

export default App;

function ModalLogin({ show, error, handleClose }) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Errore durante il login</Modal.Title>
            </Modal.Header>
            <Modal.Body>{error}</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Chiudi
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

ModalLogin.propTypes = {
    show: PropTypes.bool,
    error: PropTypes.string,
    handleClose: PropTypes.func
}