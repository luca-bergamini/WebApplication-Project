import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../allCss.css'

function LoginForm({ login }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        const credentials = { username, password };
        login(credentials);
    };

    return (
        <Row className="mt-5 vh-100 justify-content-md-center">
            <Col md={4}>
                <h1 className="pb-3">Effettua il login</h1>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            placeholder="username"
                            onChange={(ev) => setUsername(ev.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            placeholder="Enter the password."
                            onChange={(ev) => setPassword(ev.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button className="mt-3" type="submit" variant='info'>Login</Button>
                </Form>
            </Col>
        </Row>
    );
}

function LogoutButton({ logout }) {
    return (
        <Button variant='danger' onClick={logout}>Logout</Button>
    )
}

export { LoginForm, LogoutButton };

LoginForm.propTypes = {
    login: PropTypes.func.isRequired
}

LogoutButton.propTypes = {
    logout: PropTypes.func.isRequired
}