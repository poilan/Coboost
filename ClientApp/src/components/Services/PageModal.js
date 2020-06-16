import React from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import 'circular-std';

const ModalPage = styled(Modal)`
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
            body: props.body || "",
        };

        this.onClosed = this.onClosed.bind(this);
    }

    onClosed() {
        if (this.props.onClose !== undefined)
            this.props.onClose();

        this.setState({
            showing: false,
        })
    }

    render() {
        const state = this.state;
        return (
            <ModalPage show={state.showing} centered onHide={this.onClosed}>
                <Modal.Header closeButton>
                    <Modal.Title>{state.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{state.body}</Modal.Body>
            </ModalPage>
        );
    }
}