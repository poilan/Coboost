import React, {Component, createRef} from "react";
import Axios from "axios";
import {Modal, Nav, Form} from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import {TextField, Box} from "@material-ui/core";


const ModalPage = Styled(Modal)`
    border-radius: 20px;
    font-family: CircularStd;

    .modal-title {
        font-size: 1rem;
        opacity: 50%;
    }
`;

const ContentInput = Styled(TextField)`
    display: block;
    max-height: ${props => props.isTitle ?
                           "2rem" :
                           "8rem"};
    min-height: 1rem;
    font-family: CircularStd;
    font-size: 1rem;
    text-align: ${props => props.isTitle ?
                           "center" :
                           "left"};
    color: black;
    border: 0;
    border-bottom: 1px solid ${props => props.isTitle ?
                                        "#4C7AD3" :
                                        "#cfcfcf"};
    resize: none;
`;

const CancelButton = Styled(Nav.Link)`
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

const CreateButton = Styled.input`
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
    constructor(props)
    {
        super(props);
        this.state = {
            description: "",
            title: "",
            showing: true
        };

        this.Title = createRef();
        this.Description = createRef();
        this.Submit = createRef();
    }


    componentDidMount()
    {
    }


    SendInput = (e) => {
        e.preventDefault();
        const Title = this.state.title;
        const Description = this.state.description;
        const User = localStorage.getItem("user");
        const Code = sessionStorage.getItem("code");

        const Data = {
            Description: Description,
            UserID: User
        };

        if (Description.length > 30)
            Data.Title = Title;

        Axios.post(`client/${Code}/add-text-open`, Data).then(res => this.OnClose(true));
    }


    HandleTitle = (event) => {
        event.preventDefault();
        var Title = event.target.value;
        this.setState({
            title: Title
        });
    }


    HandleDescription = (event) => {
        event.preventDefault();
        var Description = event.target.value;
        this.setState({
            description: Description
        });
    }


    OnTitleFocus = () => {
        if (this.state.title.trim() === "")
        {
            let Title = this.state.description.substring(0, 30);
            let Index = Title.lastIndexOf(" ");

            if (Index !== -1)
            {
                Index = 0;
                for (let I = 0; I < 3; I++)
                {
                    const Check = Title.indexOf(" ", Index + 1);

                    if (Check === -1)
                    {
                        if (Index > 0)
                            break;
                        else
                        {
                            Index = 30;
                            break;
                        }
                    }
                    else
                        Index = Check;
                }

                Title = Title.substring(0, Index);
            }
            this.setState({
                title: Title
            });
        }
    }


    HandleInvalid = () => {
        const Description = this.state.description;

        if (Description.length < 3)
        {
            if (this.Description.current)
                this.Description.current.focus();

            return;
        }
        else if (Description.length > 30)
        {
            const Title = this.state.title;

            if (Title.length < 3)
            {
                if (this.Title.current)
                    this.Title.current.focus().select();

                return;
            }
        }
    }


    HandleEnter = (e) => {
        if (e.key === "Enter")
        {
            e.preventDefault();
            e.stopPropagation();
            if (this.Submit.current)
                this.Submit.current.click();
        }
    }


    OnClose = (repeat) => {
        this.setState({
            title: "",
            description: "",
            showing: false
        });
        this.props.onClose(repeat);
    }


    Content = () => {
        return (
            <Form
                autoComplete="off"
                onInvalid={this.HandleInvalid}
                onSubmit={this.SendInput} >
                <Box
                    m={1}
                    mb={2}
                    p={1} >
                    <ContentInput
                        fullWidth
                        helperText={`${this.state.title.length}/30`}
                        inputProps={{ minlength: 1, maxlength: 30, autocomplete: "off" }}
                        inputRef={this.Title}
                        isTitle
                        label="Title"
                        margin="normal"
                        onChange={this.HandleTitle}
                        onFocus={this.OnTitleFocus}
                        onKeyDown={this.HandleEnter.bind(this)}
                        required
                        value={this.state.title}
                        variant="outlined" />
                </Box>
                <Box
                    m={1}
                    mb={2}
                    p={1} >
                    <ContentInput
                        autoFocus={true}
                        fullWidth
                        helperText={`${this.state.description.length}/250
                                    ${this.state.description.length > 30 ?
                                      "" :
                                      `(${30 - this.state.description.length})`}`}
                        inputProps={{ minlength: 1, maxlength: 250, autofocus: true, autocomplete: "off" }}
                        inputRef={this.Description}
                        label="Input"
                        margin="normal"
                        multiline
                        name="description"
                        onChange={this.HandleDescription}
                        onKeyDown={this.HandleEnter.bind(this)}
                        required
                        rows={4}
                        value={this.state.description}
                        variant="outlined" />
                </Box>
                <CancelButton
                    onClick={this.OnClose} >
                    Cancel
                </CancelButton>
                <CreateButton
                    ref={this.Submit}
                    type="submit"
                    value="Submit" />
            </Form >
        );
    };


    render()
    {
        return (
            <ModalPage
                centered
                onHide={this.OnClose}
                show={this.state.showing} >
                <Modal.Header
                    closeButton >
                    <Modal.Title>Write Input</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.Content()}</Modal.Body>
            </ModalPage>
        );
    }
}