import React, { Component } from 'react';
import axios from "axios";
import styled from "styled-components";
import { Nav, Container, Row, Col, Button } from "react-bootstrap";
import "circular-std";
import { IconMain, IconLogo } from '../Classes/Icons';

const LeftHalf = styled(Col)`
  position: absolute;
  left: 50%;
  height: 60%;
  top: 50%;
  width: 100%;
  max-width: 1080px;
  transform: translate(-50%, -50%);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
    height: 75px;
    width: 80%;
    position: absolute;
    background: #fff;
    border-radius: 1rem;
    left: 50%;
    transform: translateX(-50%);    
    margin: 1rem;
`;

const LeftInput = styled.input`
    position: absolute;
    font-family: CircularStd;
    left: 8rem;
    width: 70%;
    height: 100%;
    border: 0;
    outline: 0;
`;

const LeftText = styled.h2`
    font-family: CircularStd;
    font-size: ${props => props.mobile === "true" ? "1" : "1.25"}rem;
    font-weight: 500;
    color: #fff;
    text-align: center;
    margin: 1rem;
`;

const LeftTitle = styled.h1`
    font-family: CircularStd;
    text-align: center;
    font-size: ${props => props.mobile === "true" ? "2rem" : "5rem"};
    color: #fff;
    margin: 1rem;
`;

const JoinEventBtn = styled.button`
    font-family: CircularStd;
    background-color: rgb(53, 57, 67);
    color: rgb(255, 255, 255);
    display: inline;
    text-align: center;
    width: 20%;
    height: calc(100% - 0.2rem);
    right: 0.1rem;
    top: 0.1rem;
    position: absolute;
    border: 2px solid rgb(53, 57, 67);
    border-radius: 1rem;    
`;

const RightHalf = styled(Col)`
  display: ${props => props.mobile === "true" ? "none" : "block"};
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 10%;
  padding: 10px;
  max-width: 1280px;
`;

const RightNav = styled(Nav)`
    .nav-link {
        &.active {
            color: rgb(71, 114, 224);
        }
        align: right;
        font-weight: 500;
        font-family: CircularStd;
        padding: 10px 25px;
        bottom: 100px;
        right: 100px;
        position: relative;
        color: #fff;
    };
`;

const RightTitle = styled.h2`
    position: relative;
    color: #fff;
    padding: 2rem;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;    
    font-family: CircularStd;
    font-size: 1.5rem;
`;

const LandingContainer = styled(Container)`
  display: table;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const LoginButton = styled(Nav.Link)`
    color: #fff;
    background: #006bdd;
    border-radius: 3rem;
    text-align: center;
    width: 130%;
    box-shadow: 1px 1px #000;
`;

const EventCodeText = styled.h5`
    display: inline;
    width: 7.5rem;
    left: 0;
    position: absolute;
    font-family: CircularStd; 
    text-align: right;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
`;


export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            width: window.innerWidth,

            loggedIn: false,
        };

        this.onWindowSizeChange = this.onWindowSizeChange.bind(this);
    }

    componentWillMount() {
        if (localStorage.getItem("user") !== null) {
            this.setState({
                loggedIn: true
            });
        }

        window.addEventListener('resize', this.onWindowSizeChange);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowSizeChange);
    }

    onWindowSizeChange() {
        this.setState({
            width: window.innerWidth,
        })
    }

    async connectToSession(e) {
        e.preventDefault();

        let code = this.refs.code.value;
        this.state.code = code;

        await axios.get(`client/${code}`).then(res => {
            const result = res.data;

            if (result === true) {
                sessionStorage.setItem("code", code);
                this.props.history.push(`/mobile`)
            } else {
                //Tell the user this code didn't work
            }
        })
    }

    rightNav() {
        return (
            <RightNav className="justify-content-end" activeKey="/">
                <Nav.Item>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/price">Pricing</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/contact">Contact Us</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    {this.state.loggedIn ? <LoginButton href="/dashboard">Get Started</LoginButton> : <LoginButton href="/Login">Login</LoginButton>}
                </Nav.Item>
            </RightNav>
        );
    }

    render() {

        const state = this.state;
        const width = state.width;
        const mobile = width <= 500;
        return (
            <LandingContainer>
                <LeftHalf mobile={mobile.toString()}>
                    <LeftTitle mobile={mobile.toString()} id="ParticipantText">The Tool for<br />Digital Co-Creation</LeftTitle>
                    <LeftText mobile={mobile.toString()} id="JoinText">Co-create and innovate with your team members by creating an<br />event or joining an existing event below.</LeftText>
                    <form onSubmit={this.connectToSession.bind(this)}>
                        <InputContainer>
                            <EventCodeText mobile={mobile.toString()}>Event code: </EventCodeText>
                            <LeftInput type="number" mobile={mobile.toString()} ref="code" placeholder="eg. 404 404" name="code" />
                            <JoinEventBtn mobile={mobile.toString()} type="submit">Join Event</JoinEventBtn>
                        </InputContainer>
                    </form>
                </LeftHalf>

                <RightHalf mobile={mobile.toString()}>
                    <RightTitle id="AdminText">Coboost</RightTitle>
                    {this.rightNav()}
                </RightHalf>
                <img src="./landing.jpg" style={{ height: "auto", width: "100%", position: "fixed", top: "0", left: "0", zIndex: "-20" }} />
                <div style={{ height: "100%", width: "100%", position: "fixed", top: "0", left: "0", background: "#424355", opacity: "80%", zIndex: "-19" }} />
            </LandingContainer>
        );
    }
}