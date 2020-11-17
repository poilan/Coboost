import React, {Component} from "react";
import Axios from "axios";
import Styled from "styled-components";
import {Nav, Container, Row, Col, Button} from "react-bootstrap";
import "circular-std";
import {IconMain, IconLogo} from "../Classes/Icons";


const LeftHalf = Styled(Col)`
  position: absolute;
  left: 50%;
  height: 50%;
  top: ${props => props.mobile ?
                  "5%" :
                  "50%"};
  width: 100%;
  max-width: 1080px;
  transform: ${props => props.mobile ?
                        "translateX(-50%)" :
                        "translate(-50%, -50%)"};
  display: flex;
  flex-direction: column;
`;

const InputContainer = Styled.div`
    height: ${props => props.mobile ?
                       "55px" :
                       "75px"};
    width: ${props => props.mobile ?
                      "calc(95% - 2rem)" :
                      "calc(80% - 2rem)"};
    max-width: 720px;
    position: absolute;
    background: #fff;
    border-radius: 1rem;
    left: 50%;
    transform: translateX(-50%);
`;

const LeftInput = Styled.input`
    position: absolute;
    font-family: CircularStd;
    left: ${props => props.mobile ?
                     "5.5" :
                     "8.5"}rem;
    width: ${props => props.mobile ?
                      "calc(75% - 2rem)" :
                      "80%"};
    border-radius: 1rem;
    height: 100%;
    border: 0;
    outline: none;
`;

const LeftText = Styled.h2`
    font-family: CircularStd;
    font-size: ${props => props.mobile ?
                          "1" :
                          "1.25"}rem;
    font-weight: 500;
    color: #fff;
    text-align: center;
    margin: 1rem;
`;

const LeftTitle = Styled.h1`
    font-family: CircularStd;
    text-align: center;
    font-size: ${props => props.mobile ?
                          "2rem" :
                          "4rem"};
    color: #fff;
`;

const JoinEventBtn = Styled.button`
    font-family: CircularStd;
    background-color: #575b75;
    color: rgb(255, 255, 255);
    display: inline;
    text-align: center;
    width: ${props => props.mobile ?
                      "5.2" :
                      "6.5"}rem;
    font-size: ${props => props.mobile ?
                          "0.8" :
                          "1"}rem;
    max-width: 30%;
    height: ${props => props.mobile ?
                       "calc(100% - 0.5rem)" :
                       "calc(100% - 1rem)"};
    right: ${props => props.mobile ?
                      "0.25" :
                      "0.5"}rem;;
    top: ${props => props.mobile ?
                    "0.25" :
                    "0.5"}rem;
    position: absolute;
    border: 2px solid #575b75;
    border-radius: 1rem;
`;

const RightHalf = Styled(Col)`
  display: ${props => props.mobile ?
                      "none" :
                      "block"};
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 10%;
  max-width: 1280px;
`;

const RightNav = Styled(Nav)`
    font-size: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    position: absolute;
    right: 10px;
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

const RightTitle = Styled.h2`
    position: absolute;
    color: #fff;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    font-family: CircularStd;
    font-size: 1.5rem;
`;

const LandingContainer = Styled(Container)`
    display: table;
    height: 100%;
    width: 100%;
    background: #E4E4E4;
    padding: 0;
    margin: 0;
    overflow: hidden;
`;

const LoginButton = Styled(Nav.Link)`
    color: #fff;
    background: #006bdd;
    border-radius: 3rem;
    text-align: center;
    width: 130%;
    box-shadow: 1px 1px #000;
`;

const EventCodeText = Styled.h5`
    display: inline;
    width: ${props => props.mobile ?
                      "5" :
                      "8"}rem;
    font-size: ${props => props.mobile ?
                          "0.8" :
                          "1"}rem;
    left: 0;
    position: absolute;
    font-family: CircularStd;
    text-align: right;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
`;

export class Home extends React.Component {
    static displayName = Home.name;


    constructor(props)
    {
        super(props);
        this.state = {
            code: "",
            width: window.innerWidth,

            loggedIn: false
        };

        this.onWindowSizeChange = this.onWindowSizeChange.bind(this);
    }


    componentDidMount()
    {
        if (localStorage.getItem("user") !== null)
        {
            this.setState({
                loggedIn: true
            });
        }

        window.addEventListener("resize", this.onWindowSizeChange);
    }


    componentWillUnmount()
    {
        window.removeEventListener("resize", this.onWindowSizeChange);
    }


    onWindowSizeChange()
    {
        this.setState({
            width: window.innerWidth
        });
    }


    async connectToSession(e)
    {
        e.preventDefault();

        const Code = this.refs.code.value;
        this.state.code = Code;

        await Axios.get(`client/${Code}`).then(res => {
            const Result = res.data;

            if (Result === true)
            {
                sessionStorage.setItem("code", Code);
                this.props.history.push(`/mobile`);
            }
        });
    }


    rightNav()
    {
        return (
            <RightNav
                activeKey="/"
                className="justify-content-end" >
                <Nav.Item>
                    <Nav.Link
                        href="/about" >
                        About
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        href="/price" >
                        Pricing
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link
                        href="/contact" >
                        Contact Us
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    {this.state.loggedIn ?
                         <LoginButton
                             href="/dashboard" >
                             Get Started
                         </LoginButton> :
                         <LoginButton
                             href="/Login" >
                             Login
                         </LoginButton>}
                </Nav.Item>
            </RightNav>
        );
    }


    render()
    {
        const State = this.state;
        const Width = State.width;
        const Mobile = Width <= 600;
        return (
            <LandingContainer>
                <LeftHalf
                    mobile={Mobile} >
                    <LeftTitle
                        id="ParticipantText"
                        mobile={Mobile} >
                        The Tool for
                        <br />
                        Digital Co-Creation
                    </LeftTitle>
                    <LeftText
                        id="JoinText"
                        mobile={Mobile} >
                        Co-create and innovate with your team members by creating an
                        <br />
                        event or joining an existing event below.
                    </LeftText>
                    <form
                        onSubmit={this.connectToSession.bind(this)} >
                        <InputContainer
                            mobile={Mobile} >
                            <EventCodeText
                                mobile={Mobile} >
                                Event code:
                            </EventCodeText>
                            <LeftInput
                                autoComplete="off"
                                mobile={Mobile}
                                name="code"
                                onBlur={(e) => e.target.placeholder = "e.g. 404 404"}
                                onFocus={(e) => e.target.placeholder = ""}
                                placeholder="e.g. 404 404"
                                ref="code"
                                type="number" />
                            <JoinEventBtn
                                mobile={Mobile}
                                type="submit" >
                                Join Event
                            </JoinEventBtn>
                        </InputContainer>
                    </form>
                </LeftHalf>

                <RightHalf
                    mobile={Mobile} >
                    <RightTitle
                        id="AdminText" >
                        Coboost
                    </RightTitle>
                    {this.rightNav()}
                </RightHalf>
                <img
                    alt="bg"
                    src="./landing.jpg"
                    style={window.innerHeight * 1.5 >= window.innerWidth ?
                               { height: "100%", width: "auto", position: "fixed", top: "0", left: "0", zIndex: "-5" } :
                               { height: "auto", width: "100%", position: "fixed", top: "0", left: "0", zIndex: "-20" }} />
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        position: "fixed",
                        top: "0",
                        left: "0",
                        background: "#575b75",
                        opacity: "60%",
                        zIndex: "-4"
                    }} />
            </LandingContainer>
        );
    }
}