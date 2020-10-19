import React, { Component } from "react";
import Styled from "styled-components";
import Axios from "axios";
import { Card, Form, FormControl, FormGroup, TabContainer, InputGroup, Nav, Tab, Button } from "react-bootstrap";

const LoginContainer = Styled.div`
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    justify-content: center;
`;

const LoginCard = Styled(Card)`
    align-self: center;
    border: 0;
    width: 100%;
    margin: 0 auto;
    max-width: 400px;
    right: 10%;
    background-color: rgb(255 255 255);
`;

const CardButton = Styled(Button)`
    position: relative;
    width: 100%;
    left: 50%;
    background-color: rgb(15 73 244);
    transform: translateX(-50%);
    margin-top: 8%;
`;

const FormInput = Styled(FormControl)`

`;

const InfoText = Styled.h2`
    position: relative;
    left: 50%;
    top: 15%;
    transform: translateX(-50%);
`;

export class Recovery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: "login",

            recover: {
                email: ""
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

    handleChange(e) {
        const Tab = this.state.tab;
        const Name = e.target.name;
        const Value = e.target.value;

        const Data = this.state[Tab];
        Data[Name] = Value;
        Data.validated = false;

        this.setState({
            [Tab]: Data
        });
    }

    forgotPassword() {

        // TODO: forgotPassword
    }

    loginTab() {
        return (
            <Form autoComplete="on"
                onSubmit={this.submitLogin}
                validated={this.state.login.validated}>
                <FormGroup controlId="formBasicEmail">
                    <Form.Label>Username or Email</Form.Label>
                    <FormInput name="email"
                        onChange={this.handleChange
                        }
                        placeholder="myemail@address.com"
                        required
                        type="email" />
                </FormGroup>
                <CardButton type="submit">Start Recovery</CardButton>
            </Form>
        );
    }

    async submitLogin(event) {
        event.preventDefault();

        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }

        /*const data = {
            Email: this.state.login.email,
            Password: this.state.login.password,
        }

        await axios.post(`user/login`, data
        ).then(res => {
            if (res.status === 202) {

                //Login Success
                localStorage.setItem("user", data.Email);
                this.props.history.go(-1);
            } else if (res.status === 406) {

                //Wrong password
            } else {

                //Wrong email / user not found
            }
        });*/
    }

    async submitRegistration(event) {
        event.preventDefault();
        const Data = this.state.recover;

        await Axios.post(`user/register`, Data).then(res => {
            if (res.status === 202) {

                //Registration Succeeded
                //Redirect to log in?
            }
            else if (res.status === 406) {

                //User didn't write in a correct email address
                //or password was too short (needs to be 8 or more characters)
            }
            else if (res.status === 409) {

                //That email is already in use
            }
            else if (res.status === 400) {

                //Data wasn't received by server
            }
        });
    }

    selectTab(key) {
        this.setState({
            tab: key
        });
    }

    render() {
        return (
            <LoginContainer>
                <InfoText>Account Recovery</InfoText>
                <LoginCard>
                    <TabContainer defaultActiveKey="login"
                        onSelect={this.selectTab}>
                        <Nav.Link>
                            <Nav variant="tabs">
                            </Nav>
                        </Nav.Link>
                        <Card.Body>
                            <Tab.Content>
                                <Tab.Pane eventKey="login">
                                    {this.loginTab()}
                                </Tab.Pane>
                            </Tab.Content>
                        </Card.Body>
                    </TabContainer>
                </LoginCard>
            </LoginContainer>
        );
    }
}