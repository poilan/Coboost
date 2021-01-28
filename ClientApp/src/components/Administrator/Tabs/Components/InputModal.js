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
    constructor(props) {
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


    componentDidMount() { }


    SendInput = (e) => {
        e.preventDefault();
        const title = this.state.title;
        const description = this.state.description;
        const user = localStorage.getItem("user");
        const code = sessionStorage.getItem("code");

        const data = {
            Description: description,
            UserID: user
        };

        if (data.title) {
            data.Title = title;
        }

        Axios.post(`client/${code}/add-text-open`, data).then(() => this.OnClose(true));
    }


    HandleTitle = (event) => {
        event.preventDefault();
        const title = event.target.value;
        this.setState({
            title: title
        });
    }


    HandleDescription = (event) => {
        event.preventDefault();
        const description = event.target.value;
        this.setState({
            description: description
        });
    }


    OnTitleFocus = (e) => {
        if (this.state.title.trim() === "") {
            let title = this.state.description.substring(0, 30);
            let index = title.lastIndexOf(" ");

            if (index !== -1) {
                index = 0;
                for (let i = 0; i < 3; i++) {
                    const check = title.indexOf(" ", index + 1);

                    if (check === -1) {
                        if (index > 0) {
                            break;
                        } else {
                            index = 30;
                            break;
                        }
                    } else {
                        index = check;
                    }
                }

                title = title.substring(0, index);
            }
            this.setState({
                title: title
            });
            e.target.select();
        }
    }


    HandleInvalid = () => {
        const Description = this.state.description;

        if (Description.length < 3) {
            if (this.Description.current) {
                this.Description.current.focus();
            }

            return;
        } else if (Description.length > 30) {
            const title = this.state.title;

            if (title.length < 3) {
                if (this.Title.current) {
                    this.Title.current.focus().select();
                }

                return;
            }
        }
    }


    HandleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (this.Submit.current) {
                this.Submit.current.click();
            }
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
            <Form autoComplete="off"
                  onSubmit={this.SendInput} >
                <Box m={1}
                     mb={2}
                     p={1} >
                    <ContentInput fullWidth
                                  helperText={`${this.state.title.length}/30`}
                                  id="input-title"
                                  inputProps={{ minlength: 1, maxlength: 30, autoComplete: "off" }}
                                  inputRef={this.Title}
                                  isTitle
                                  label="Title"
                                  margin="normal"
                                  name="title"
                                  onChange={this.HandleTitle}
                                  onFocus={this.OnTitleFocus}
                                  onKeyDown={this.HandleEnter.bind(this)}
                                  required
                                  value={this.state.title}
                                  variant="outlined" />
                </Box>
                <Box m={1}
                     mb={2}
                     p={1} >
                    <ContentInput autoFocus={true}
                                  fullWidth
                                  helperText={`${this.state.description.length}/250
                                    ${this.state.description.length > 30 ?
                                      "" :
                                      `(${30 - this.state.description.length})`}`}
                                  id="input-description"
                                  inputProps={{ minlength: 1, maxlength: 250, autoFocus: true, autoComplete: "off" }}
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
                <CancelButton onClick={this.OnClose} >
                    Cancel
                </CancelButton>
                <CreateButton ref={this.Submit}
                              type="submit"
                              value="Submit" />
            </Form >
        );
    };


    render() {
        return (
            <ModalPage aria-describedby="registerTab"
                       aria-labelledby="loginTab"
                       centered
                       onHide={this.OnClose}
                       show={this.state.showing} >
                <Modal.Header closeButton >
                    <Modal.Title id="input-modal-title" >
                        Write Input
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body id="input-modal-description" >
                    {this.Content()}
                </Modal.Body>
            </ModalPage>
        );
    }
}