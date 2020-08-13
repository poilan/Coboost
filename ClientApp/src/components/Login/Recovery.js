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
    right: 10%;
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
    left: 50%;
    top: 15%;
    transform: translateX(-50%);
`;

export class Recovery extends Component {
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

    selectTab(key) {
        this.setState({
            tab: key,
        });
    }

    render() {
        return (

            <LoginContainer>
                <InfoText>Account Recovery</InfoText>
                <LoginCard>
                    <TabContainer defaultActiveKey="login" onSelect={this.selectTab}>
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