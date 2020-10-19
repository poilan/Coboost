import React from "react";
import Styled from "styled-components";
import { Modal } from "react-bootstrap";
import "circular-std";

const ModalPage = Styled(Modal)`
    border-radius: 20px;
    font-family: CircularStd;

    .modal-title {
        font-size: 1rem;
        opacity: 50%;
    }
`;

export class PageModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showing: true,

            title: props.title || "",
            body: props.body || ""
        };

        this.onClosed = this.onClosed.bind(this);
    }

    onClosed() {
        if (this.props.onClose !== undefined) {
            this.props.onClose();
        }

        this.setState({
            showing: false
        });
    }

    render() {
        const State = this.state;
        return (
            <ModalPage centered
                onHide={this.onClosed}
                show={State.showing}>
                <Modal.Header closeButton>
                    <Modal.Title>{State.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{State.body}</Modal.Body>
            </ModalPage>
        );
    }
}