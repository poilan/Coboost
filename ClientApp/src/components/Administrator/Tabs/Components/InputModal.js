import React, { Component, createRef } from 'react';
import axios from 'axios';
import { Modal, Nav, Form } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { TextField, Box } from '@material-ui/core';

const ModalPage = styled(Modal)`
    border-radius: 20px;
    font-family: CircularStd;

    .modal-title {
        font-size: 1rem;
        opacity: 50%;
    }
`;

const ContentInput = styled(TextField)`
    display: block;
    max-height: ${props => props.isTitle ? "2rem" : "8rem"};
    min-height: 1rem;
    font-family: CircularStd;
    font-size: 1rem;
    text-align: ${props => props.isTitle ? "center" : "left"};
    color: black;
    border: 0;
    border-bottom: 1px solid ${props => props.isTitle ? "#4C7AD3" : "#cfcfcf"};
    resize: none;
`;

const CancelButton = styled(Nav.Link)`
    color: #100e0e;
    background: #fff;
    position: relative;
    display: inline-block;
    left: 0;
    top: 0;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
`;

const CreateButton = styled.input`
    color: #fff;
    background: #4C7AD3;
    position: relative;
    display: inline-block;
    left: 0;
    top: 0;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
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
        if (this.state.title.trim() == "") {
            var title = this.state.description.substring(0, 30);
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
            <Form autoComplete="off" onSubmit={this.SendInput} onInvalid={this.HandleInvalid}>
                <Box p={1} m={1} mb={2}>
                    <ContentInput inputRef={this.Title} disabled={this.state.description == undefined || this.state.description.length <= 30} fullWidth
                        label="Title" isTitle required helperText={`${30 - this.state.title.length}`} variant="outlined" hidden={this.state.description == undefined || this.state.description.length <= 30} margin="normal"
                        inputProps={{ minlength: 3, maxlength: 30, autocomplete: "off" }} onFocus={this.OnTitleFocus}
                        value={this.state.title} onChange={this.HandleTitle} onKeyDown={this.HandleEnter.bind(this)}
                    />
                </Box>
                <Box p={1} m={1} mb={2}>
                    <ContentInput inputRef={this.Description} name="description" variant="outlined" multiline margin="normal" rowsMax={5} fullWidth
                        label="Input" required helperText={`${250 - this.state.description.length}${this.state.description.length > 30 ? "" : ` | ${30 - this.state.description.length}`}`}
                        inputProps={{ minlength: 3, maxlength: 250, autofocus: true, autocomplete: "off" }}
                        value={this.state.description} onChange={this.HandleDescription}
                        onKeyDown={this.HandleEnter.bind(this)}
                    />
                </Box>
                <CancelButton onClick={this.OnClose}>Cancel</CancelButton>
                <CreateButton ref={this.Submit} type="submit" value="Submit" />
            </Form >
        );
    };

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