import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Card, Form, FormControl, FormGroup, TabContainer, InputGroup, Nav, Tab, Button } from 'react-bootstrap';

const LoginContainer = styled.div`
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    justify-content: center;
`;

const LoginCard = styled(Card)`
    align-self: center;
    border: 0; 
    width: 100%;
    margin: 0 auto;
    max-width: 400px;
    right: 15%;
    background-color: rgb(255 255 255);
`;

const CardButton = styled(Button)`
    position: relative;
    width: 100%;
    left: 50%;
    background-color: rgb(15 73 244);
    transform: translateX(-50%);
    margin-top: 8%;
`;

const ForgotButton = styled(Button)`
    position: relative;
    margin-top: -24%;
    left: 65%;
    border: 0;
    color: rgb(63 120 250);
    background-color: rgb(255 255 255);
    font-size: 80%;
`;

const FormInput = styled(FormControl)`

`;

const InfoText = styled.h2`
    position: relative;
    left: 35%;
    top: 15%;
`;


export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'login',
            login: {
                email: '',
                password: '',
                validated: false,
            },

            register: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                repeatPassword: '',
                validated: false,
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.submitRegistration = this.submitRegistration.bind(this);
        this.selectTab = this.selectTab.bind(this);
    }

    handleChange(e) {
        const tab = this.state.tab;
        const name = e.target.name;
        const value = e.target.value;

        const data = this.state[tab];
        data[name] = value;
        data.validated = false;

        this.setState({
            [tab]: data,
        });
    }

    forgotPassword() {
        // TODO: forgotPassword
    }

    loginTab() {
        return (
            
                <Form autoComplete="on" validated={this.state.login.validated} onSubmit={this.submitLogin}>
                    <FormGroup controlId="formBasicEmail">    
                    <Form.Label>Username or Email</Form.Label>
                            <FormInput name="email" onChange={this.handleChange} placeholder="myemail@address.com" type="email" required />
                    </FormGroup>
                    <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                            <FormInput autoComplete="off" name="password" onChange={this.handleChange} placeholder="Enter your password" type="password" minLength="8" required />
                    </Form.Group>
                    <CardButton type="submit">Login</CardButton>
                    <Form.Check style={{ margin: '5%' }} type="checkbox" label="Remember Me" />
                    <ForgotButton onClick={this.forgotPassword}>Forgot password?</ForgotButton>
                </Form>
            
        );
    }

    async submitLogin(event) {
        event.preventDefault();

        if (!event.currentTarget.checkValidity()) {
            event.stopPropagation();
        }

        const data = {
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
        });
    }

    registerTab() {
        return (
            <>
                <Form autoComplete="on" noValidate validated={this.state.register.validated} onSubmit={this.submitRegistration}>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="firstName" onChange={this.handleChange} placeholder="First name..." />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="lastName" onChange={this.handleChange} placeholder="Last name..." />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="email" onChange={this.handleChange} placeholder="Email.." />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="password" type="password" onChange={this.handleChange} placeholder="Password..." />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup>
                            <Form.Control name="repeatPassword" type="password" onChange={this.handleChange} placeholder="Repeat password..." />
                        </InputGroup>
                    </Form.Group>
                    <CardButton type="submit">Register</CardButton>
                </Form>
            </>
        );
    }

    async submitRegistration(event) {
        event.preventDefault();
        const data = this.state.register;

        await axios.post(`user/register`, data).then(res => {
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
                //Data wasn't recieved by server
            }
        });
    }

    selectTab(key) {
        this.setState({
            tab: key,
        });
    }

    render() {
        return (
            
            <LoginContainer>
                <InfoText>Sign in or Register to your account</InfoText>
                <LoginCard>
                    <TabContainer defaultActiveKey="login" onSelect={this.selectTab}>
                        <Nav.Link>
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Nav.Link style={{ border: '0' }} eventKey="login">Login</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link style={{ border: '0' }} eventKey="register">Register</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Nav.Link>
                        <Card.Body>
                            <Tab.Content>
                                <Tab.Pane eventKey="login">
                                    {this.loginTab()}
                                </Tab.Pane>
                                <Tab.Pane eventKey="register">
                                    {this.registerTab()}
                                </Tab.Pane>
                            </Tab.Content>
                        </Card.Body>
                    </TabContainer>
                </LoginCard>
            </LoginContainer>
        );
    }
}