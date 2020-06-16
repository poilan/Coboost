import React, { Component } from 'react';
import axios from "axios";
import styled from "styled-components";
import { Nav, Container, Row, Col, Button } from "react-bootstrap";
import "circular-std";
import { IconMain } from '../Classes/Icons';

const LeftHalf = styled(Col)`
  background: rgb(224 233 254);
  position: absolute;
  left: ${props => props.mobile === "true" ? "0%" : "10%"};
  height: ${props => props.mobile === "true" ? "100%" : "70%"};
  bottom: ${props => props.mobile === "true" ? "0%" : "10%"};
  width: ${props => props.mobile === "true" ? "100%" : "85%"};
  border-radius: 10px;
  padding: 20px;
`;

const MainIcon = styled(IconMain)`
    position: absolute;
    width: 50%;
    height: 100%;
    right: 0%;
    border-radius: 10px;
    padding: 20px;
    display: ${props => props.mobile === "true" ? "none" : "block"};
`;

const LeftInput = styled.input`
    position: absolute;
    font-family: CircularStd;
    width: ${props => props.mobile === "true" ? "90%" : "35%"};
    height: 10%;
    bottom: 20%;
    box-shadow: 0;
    border-radius: 10px;
    border: 0;
    padding-left: ${props => props.mobile === "true" ? "8%" : "11%"};
`;

const LeftText = styled.h2`
    font-family: CircularStd;
    position: absolute;
    top: ${props => props.mobile === "true" ? "25%" : "50%"};
    font-size: ${props => props.mobile === "true" ? "18px" : "20px"};
`;

const LeftTitle = styled.h1`
    font-family: CircularStd;
    position: absolute;
    top: ${props => props.mobile === "true" ? "5%" : "20%"};
    font-size: ${props => props.mobile === "true" ? "2rem" : "4rem"};
`;

const JoinEventBtn = styled.button`
    font-family: CircularStd;
    background-color: rgb(60 102 246);
    color: rgb(255 255 255);
    position: absolute;
    bottom: ${props => props.mobile === "true" ? "23%" : "22%"};
    left: ${props => props.mobile === "true" ? "62%" : "25%"};  
    border: 2px solid rgb(60 102 246);
    border-radius: 10px;    
    width: ${props => props.mobile === "true" ? "30%" : "10%"};
`;

const RightHalf = styled(Col)`
  display: ${props => props.mobile === "true" ? "none" : "block"};
  position: absolute;
  top: 0px;
  left: 40%;
  width: 60%;
  height: 100%;
  margin-left: 0px;
  padding: 0px;
  border-radius: 10px;
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

        color: black;
    };
`;

const RightTitle = styled.h2`
    position: relative;
    color: rgb(26 87 248);
    opacity: 60%;
    padding: 50px;
    font-family: CircularStd;
    font-size: 1.5rem;
    left: -50%;


`;

const LandingContainer = styled(Container)`
  display: table;
  height: 100%;
  width: 100%;
`;

const LoginButton = styled(Nav.Link)`
    border: 2px solid rgb(73 128 250); 
    color: rgb(73 128 250);
    border-radius: 50px;
    text-align: center;
    width: 170%;
`;

const EventCodeText = styled.h5`
    display: ${props => props.mobile === "true" ? "none" : "block"};
    position: absolute;
    font-family: CircularStd;   
    bottom: ${props => props.mobile === "true" ? "22%" : "21.5%"};
    left: ${props => props.mobile === "true" ? "9%" : "2.5%"};
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
                    <EventCodeText mobile={mobile.toString()}>Event code:</EventCodeText>
                    <LeftTitle mobile={mobile.toString()} id="ParticipantText">The tool for Digital <br />Co-Creation</LeftTitle>
                    <LeftText mobile={mobile.toString()} id="JoinText">Co-create and innovate with your team members by <br />creating an event or joining an existing event below.</LeftText>
                    <form onSubmit={this.connectToSession.bind(this)}>
                        <LeftInput mobile={mobile.toString()} ref="code" placeholder={mobile ? "Enter the 6-digit code" : "eg. #000 000"} name="code"></LeftInput>
                        <JoinEventBtn mobile={mobile.toString()} type="submit">Join Event</JoinEventBtn>
                    </form>
                    <MainIcon mobile={mobile.toString()}></MainIcon>
                </LeftHalf>

                <RightHalf mobile={mobile.toString()}>
                    <RightTitle id="AdminText">Innonor</RightTitle>
                    {this.rightNav()}
                </RightHalf>
            </LandingContainer>
        );
    }
}