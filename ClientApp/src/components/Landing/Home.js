import React, { Component } from 'react';
import axios from "axios";
import styled from "styled-components";
import { Nav, Container, Row, Col, Button } from "react-bootstrap";
import "circular-std";
import { IconMain, IconLogo } from '../Classes/Icons';

const LeftHalf = styled(Col)`
  position: absolute;
  left: 50%;
  height: 50%;
  top: ${props => props.mobile ? "5%" : "50%"};
  width: 100%;
  max-width: 1080px;
  transform: ${props => props.mobile ? "translateX(-50%)" : "translate(-50%, -50%)"};
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
    height: 75px;
    width: ${props => props.mobile ? "calc(95% - 2rem)" : "calc(80% - 2rem)"};
    max-width: 720px;
    position: absolute;
    background: #fff;
    border-radius: 1rem;
    left: 50%;
    transform: translateX(-50%);
`;

const LeftInput = styled.input`
    position: absolute;
    font-family: CircularStd;
    left: ${props => props.mobile ? "5.5" : "8.5"}rem;
    width: ${props => props.mobile ? "calc(75% - 2rem)" : "80%"};
    border-radius: 1rem;
    height: 100%;
    border: 0;
    outline: 0;
`;

const LeftText = styled.h2`
    font-family: CircularStd;
    font-size: ${props => props.mobile ? "1" : "1.25"}rem;
    font-weight: 500;
    color: #fff;
    text-align: center;
    margin: 1rem;
`;

const LeftTitle = styled.h1`
    font-family: CircularStd;
    text-align: center;
    font-size: ${props => props.mobile ? "2rem" : "4rem"};
    color: #fff;
`;

const JoinEventBtn = styled.button`
    font-family: CircularStd;
    background-color: rgb(53, 57, 67);
    color: rgb(255, 255, 255);
    display: inline;
    text-align: center;
    width: ${props => props.mobile ? "5.2" : "6.5"}rem;
    font-size: ${props => props.mobile ? "0.8" : "1"}rem;
    max-width: 30%;
    height: calc(100% - 1rem);
    right: ${props => props.mobile ? "0.25" : "0.5"}rem;;
    top: ${props => props.mobile ? "0.25" : "0.5"}rem;
    position: absolute;
    border: 2px solid rgb(53, 57, 67);
    border-radius: 1rem;
`;

const RightHalf = styled(Col)`
  display: ${props => props.mobile ? "none" : "block"};
  position: absolute;
  top: 25px;
  left: 50%;
  width: 100%;
  height: 10%;
  max-width: 1280px;
`;

const RightNav = styled(Nav)`
    font-size: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    position: absolute;
    right: 2rem;
    .nav-link {
        &.active {
            color: rgb(71, 114, 224);
        }
        align: right;
        font-weight: 500;
        font-family: CircularStd;
        position: relative;
        color: #fff;
    };
`;

const RightTitle = styled.h2`
    position: absolute;
    color: #fff;
    left: 2rem;
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
    width: ${props => props.mobile ? "5.5" : "8"}rem;
    font-size: ${props => props.mobile ? "0.8" : "1"}rem;
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
                <LeftHalf mobile={mobile}>
                    <LeftTitle mobile={mobile} id="ParticipantText">The Tool for<br />Digital Co-Creation</LeftTitle>
                    <LeftText mobile={mobile} id="JoinText">Co-create and innovate with your team members by creating an<br />event or joining an existing event below.</LeftText>
                    <form onSubmit={this.connectToSession.bind(this)}>
                        <InputContainer mobile={mobile}>
                            <EventCodeText mobile={mobile}>Event code: </EventCodeText>
                            <LeftInput autoComplete={false} type="number" mobile={mobile} ref="code" placeholder="eg. 404 404" name="code" />
                            <JoinEventBtn mobile={mobile} type="submit">Join Event</JoinEventBtn>
                        </InputContainer>
                    </form>
                </LeftHalf>

                <RightHalf mobile={mobile}>
                    <RightTitle id="AdminText">Coboost</RightTitle>
                    {this.rightNav()}
                </RightHalf>
                <img src="./landing.jpg" style={mobile ? { height: "100%", width: "auto", position: "fixed", top: "0", left: "0", zIndex: "-20" } : { height: "auto", width: "100%", position: "fixed", top: "0", left: "0", zIndex: "-20" }} />
                <div style={{ height: "100%", width: "100%", position: "fixed", top: "0", left: "0", background: "#424355", opacity: "70%", zIndex: "-19" }} />
            </LandingContainer>
        );
    }
}