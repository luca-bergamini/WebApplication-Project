import React from "react";
import PropTypes from "prop-types";
import { ToastContainer, Toast } from "react-bootstrap";

function PopUpComponent({ popup, setPopUp }) {

    return (
        <>
            <ToastContainer
                className="p-3"
                position="top-center"
                style={{ zIndex: 1 }}
            >
                <Toast onClose={() => setPopUp(old => { return { ...old, show: false } })} show={popup.show} delay={6000} autohide>
                    <Toast.Header>
                        <strong className="me-auto" bg={popup.res === true ? "info" : "warning"}>{popup.res === true ? "Risposta corretta" : "Risposta errata"}</strong>
                    </Toast.Header>
                    {popup.res !== true ? <Toast.Body>
                        <>
                            <h6>Possibili risposte:</h6>
                            {popup.res.map((c, i) => (
                                <p key={i}>{c.text}</p>
                            ))}
                        </>
                    </Toast.Body> : <Toast.Body><h6>La risposta selezionata è corretta!</h6></Toast.Body>}
                </Toast>
            </ToastContainer>
        </>
    )
}

export default PopUpComponent;

PopUpComponent.propTypes = {
    popup: PropTypes.shape({
        round: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.array
        ]),
        show: PropTypes.bool.isRequired
    }).isRequired
}