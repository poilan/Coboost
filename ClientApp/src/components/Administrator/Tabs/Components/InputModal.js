import React, { Component } from 'react';
import axios from 'axios';
import { Modal, Form } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";

const ModalPage = styled(Modal)`
    border-radius: 20px;
    font-family: CircularStd;

    .modal-title {
        font-size: 1rem;
        opacity: 50%;
    }
`;

const ContentInput = styled.textarea`
    display: block;
    width: calc(100% - 60px);
    max-height: ${props => props.isTitle ? "50px" : "300px"};
    min-height: 50px;
    font-family: CircularStd;
    font-size: 1rem;
    text-align: ${props => props.isTitle ? "center" : "left"};
    color: black;
    border: 0;
    border-bottom: 1px solid ${props => props.isTitle ? "#4C7AD3" : "#cfcfcf"};
    margin: 0 30px;
    margin-top: ${props => props.isTitle ? "30px" : "0"};
    resize: none;
`;

export class InputModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            title: "",
            showing: true,
        }

        this.Title = createRef();
        this.Description = createRef();
        this.Submit = createRef();
    }

    componentDidMount() {
    }

    SendInput = (e) => {
        e.preventDefault();
        const title = this.state.title;
        const description = this.state.description;
        const user = localStorage.getItem("user");
        const code = sessionStorage.getItem("code");

        let data = {
            Description: description,
            UserID: user,
        }

        if (description.length > 30)
            data.Title = title;

        axios.post(`client/${code}/add-opentext`, data);
        this.OnClose();
    }

    HandleTitle = (event) => {
        event.preventDefault();
        var title = this.state.title;
        title = event.target.value;
        this.setState({
            title: title,
        });
    }

    HandleDescription = (event) => {
        event.preventDefault();
        var description = this.state.description;
        description = event.target.value;
        this.setState({
            description: description,
        });
    }

    OnTitleFocus = (e) => {
        e.target.placeholder = ""; //We do not want pesky placeholders while the input is being focused.

        if (this.state.title.trim() == "") {
            var title = this.state.description.substring(0, 29);
            this.setState({
                title: title,
            });
        }
    }

    HandleInvalid = () => {
        const description = this.state.description;

        if (description.length < 3) {
            if (this.Description.current)
                this.Description.current.focus();

            return;
        } else if (description.length > 30) {
            let title = this.state.title;

            if (title.length < 3) {
                if (this.Title.current)
                    this.Title.current.focus();

                return;
            }
        }
    }

    HandleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            if (this.Submit.current) {
                this.Submit.current.click();
            }
        }
    }

    OnClose = () => {
        if (this.props.onClose !== undefined)
            this.props.onClose();
        this.setState({
            title: "",
            description: "",
            showing: false,
        });
    }

    Content = () => {
        return (
            <Form autoComplete="off" onSubmit={this.SendInput} onInvalid={this.HandleInvalid} >
                < ContentInput ref={this.Title} disabled={this.state.description == undefined || this.state.description.length <= 30}
                    required placeholder={this.state.description != undefined && this.state.description.length <= 30 ? "Short inputs dont need a title" : "Please write a fitting title for your input"}
                    type="text" minLength="3" maxLength="30" name="opentext-titlefield" isTitle
                    value={this.state.title} onChange={this.HandleTitle}
                    onFocus={this.OnTitleFocus}
                    onBlur={(e) => e.target.placeholder = "Please write a fitting title for your input"} onKeyDown={this.HandleEnter.bind(this)}
                />

                <ContentInput ref={this.Description}
                    required autoFocus placeholder="Write your input..."
                    type="text" minLength="3" name={`description`}
                    value={this.state.description} onChange={this.HandleDescription}
                    onFocus={(e) => e.target.placeholder = ""}
                    onBlur={(e) => e.target.placeholder = "Write your answer..."} onKeyDown={this.HandleEnter.bind(this)}
                />

                <CancelButton onClick={this.OnClose}>Cancel</CancelButton>
                <CreateButton ref={this.Submit} type="submit" value="Submit" />
            </Form >
        );
    },

    render() {
        return (
            <ModalPage show={this.state.showing} centered onHide={this.OnClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Write Input</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.Content()}</Modal.Body>
            </ModalPage>
        )
    }
}