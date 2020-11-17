import React, {Component} from "react";
import Styled from "styled-components";
import Axios from "axios";
import {Card, Form, FormControl, FormGroup, TabContainer, InputGroup, Nav, Tab, Button} from "react-bootstrap";


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
    right: 19%;
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

const ForgotButton = Styled(Button)`
    position: relative;
    margin-top: -24%;
    left: 65%;
    border: 0;
    color: rgb(63 120 250);
    background-color: rgb(255 255 255);
    font-size: 80%;
`;

const FormInput = Styled(FormControl)`

`;

const InfoText = Styled.h2`
    position: relative;
    left: 50%;
    top: 15%;
    transform: translateX(-50%);
`;

export class Login extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            tab: "login",
            login: {
                email: "",
                password: "",
                validated: false
            },

            register: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                repeatPassword: "",
                validated: false
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.submitRegistration = this.submitRegistration.bind(this);
        this.selectTab = this.selectTab.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
    }


    handleChange(e)
    {
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


    forgotPassword()
    {
        // TODO: forgotPassword
        this.props.history.push("/recover");
    }


    loginTab()
    {
        return (
            <Form
                autoComplete="on"
                onSubmit={this.submitLogin}
                validated={this.state.login.validated} >

                <FormGroup
                    controlId="formBasicEmail" >

                    <Form.Label>
                        Email
                    </Form.Label>

                    <FormInput
                        name="email"
                        onChange={this.handleChange}
                        placeholder="myemail@address.com"
                        required
                        type="email" />

                </FormGroup>

                <Form.Group
                    controlId="formBasicPassword" >

                    <Form.Label>
                        Password
                    </Form.Label>

                    <FormInput
                        autoComplete="off"
                        minLength="8"
                        name="password"
                        onChange={this.handleChange}
                        placeholder="Enter your password"
                        required
                        type="password" />

                </Form.Group>

                <Form.Check
                    label="I have read the Terms of Agreement, and agree to be a beta tester."
                    required
                    style={{ margin: "5%" }}
                    type="checkbox" />

                <CardButton
                    type="submit" >
                    Login
                </CardButton>

                <ForgotButton
                    onClick={this.forgotPassword} >
                    Forgot password?
                </ForgotButton>
            </Form>
        );
    }


    async submitLogin(event)
    {
        event.preventDefault();

        if (!event.currentTarget.checkValidity())
            event.stopPropagation();

        const Data = {
            Email: this.state.login.email,
            Password: this.state.login.password
        };

        await Axios.post(`user/login`, Data).then(res => {
            if (res.status === 202)
            {
                //Login Success
                localStorage.setItem("user", Data.Email);
                this.props.history.push("/");
                return true;
            }
            return false;
        }, () => {
            alert("Wrong user-name or password");

            //Wrong password or user-name
            return false;
        });
    }


    registerTab()
    {
        return (
            <React.Fragment>
                <Form
                    autoComplete="on"
                    onSubmit={this.submitRegistration}
                    validated={this.state.register.validated} >

                    <Form.Group>
                        <InputGroup>
                            <Form.Control
                                name="email"
                                onChange={this.handleChange}
                                placeholder="Email.."
                                required
                                type="email" />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <InputGroup>
                            <Form.Control
                                name="firstName"
                                onChange={this.handleChange}
                                placeholder="First name..."
                                required />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <InputGroup>
                            <Form.Control
                                name="lastName"
                                onChange={this.handleChange}
                                placeholder="Last name..."
                                required />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <InputGroup>
                            <Form.Control
                                name="password"
                                onChange={this.handleChange}
                                placeholder="Password..."
                                required
                                type="password" />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group>
                        <InputGroup>
                            <Form.Control
                                name="repeatPassword"
                                onChange={this.handleChange}
                                placeholder="Repeat password..."
                                required
                                type="password" />
                        </InputGroup>
                    </Form.Group>

                    <CardButton
                        type="submit" >
                        Register
                    </CardButton>

                </Form>
            </React.Fragment>
        );
    }


    async submitRegistration(event)
    {
        event.preventDefault();
        const Data = this.state.register;

        await Axios.post(`user/register`, Data).then(res => {
            if (res.status === 201)
            {
                //Registration Succeeded
                //Redirect to log in?
                alert("Account Created! Please log in");
                this.selectTab("login");
                return true;
            }
            return false;
        }, error => {
            if (error.response.status === 406)
            {
                alert("Please verify your email address, and make sure your password is 8 or more characters");

                //User didn't write in a correct email address
                //or password was too short (needs to be 8 or more characters)
            }
            else if (error.response.status === 409)
            {
                alert("That email is already linked to an account!");

                //That email is already in use
            }

            return false;
        });
    }


    selectTab(key)
    {
        this.setState({
            tab: key
        });
    }


    render()
    {
        return (
            <LoginContainer>

                <InfoText>
                    Sign in or Register to your account
                </InfoText>

                <LoginCard>

                    <TabContainer
                        defaultActiveKey="login"
                        onSelect={this.selectTab} >

                        <Nav.Link>

                            <Nav
                                variant="tabs" >

                                <Nav.Item>

                                    <Nav.Link
                                        eventKey="login"
                                        style={{ border: "0" }} >

                                        Login
                                    </Nav.Link>

                                </Nav.Item>

                                <Nav.Item>

                                    <Nav.Link
                                        eventKey="register"
                                        style={{ border: "0" }} >

                                        Register
                                    </Nav.Link>

                                </Nav.Item>

                            </Nav>

                        </Nav.Link>

                        <Card.Body>

                            <Tab.Content>

                                <Tab.Pane
                                    eventKey="login" >
                                    {this.loginTab()}
                                </Tab.Pane>

                                <Tab.Pane
                                    eventKey="register" >
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