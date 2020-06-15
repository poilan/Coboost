import React from 'react'
import styled from 'styled-components';
import { BsArrowsAngleContract, BsX, BsList, BsArrowLeft, BsArrowRight } from "react-icons/bs";

const FacilitatorContainer = styled.div`
    display: table;
    height: 10%;
    width: 100%;
    background: rgb(53 57 67);
    position: absolute;
`;

const FacilitatorButtonArrowRight = styled.button`
    color: rgb(249 251 247);
    background-color: rgb(53 57 67);
    float: right;
    width: 10%;
    height: 100%;
    border: 0;

`;

const FacilitatorButtonArrowLeft = styled.button`
    color: rgb(249 251 247);
    background-color: rgb(53 57 67);
    float: right;
    width: 10%;
    height: 100%;
    border: 0;

`;

const FacilitatorButtonHide = styled.button`
    color: rgb(249 251 247);
    background-color: rgb(53 57 67);
    float: right;
    width: 13%;
    height: 100%;
    border: 0;

`;

const FacilitatorButtonClose = styled.button`
    color: rgb(249 251 247);
    display: rgb(53 57 67);
    background-color: rgb(53 57 67);
    float: right;
    width: 13%;
    height: 100%;
    border: 0;
`;

const FacilitatorButtonStart = styled.button`
    color: rgb(249 251 247);
    background-color: rgb(53 57 67);
    float: right;
    width: 13%;
    height: 100%;
    border: 0;

`;

const FacilitatorButtonHamburger = styled.button`
    color: rgb(249 251 247);
    background-color: rgb(53 57 67);
    float: left;
    width: 13%;
    height: 100%;
    border: 0;
`;

const FacilitatorButtonExit = styled.button`
    color: rgb(249 251 247);
    background-color: rgb(53 57 67);
    float: left;
    width: 13%;
    height: 100%;
    border: 0;
`;

const FacilitatorButtonMinimize = styled.button`
    color: rgb(249 251 247);
    background-color: rgb(53 57 67);
    float: left;
    width: 13%;
    height: 100%;
    border: 0;
    font-size: 100%;
`;

export class Controls extends React.Component {
    constructor(props) {
        super(props);
    }

    openHamburgerMenu() {
        console.log("Hamburger menu opened");
    }

    handleExit() {
        console.log("Handlig exit");
    }

    handleMinimize() {
        console.log("Handling minizime property");
    }

    startCountdown() {
        console.log("starting countdown");
    }

    closeVoting() {
        console.log("starting countdown");
    }

    hideResults() {
        console.log("Hiding results");
    }

    arrowBackward() {
        console.log("<")
    }

    arrowForward() {
        console.log(">")
    }

    render() {
        return (
            <FacilitatorContainer>
                <FacilitatorButtonHamburger onClick={this.openHamburgerMenu}>
                    <BsList>
                    </BsList>
                </FacilitatorButtonHamburger>

                <FacilitatorButtonExit onClick={this.handleExit}>
                    <BsX>
                    </BsX>
                </FacilitatorButtonExit>

                <FacilitatorButtonMinimize onClick={this.handleMinimize}>
                    <BsArrowsAngleContract>
                    </BsArrowsAngleContract>
                </FacilitatorButtonMinimize>

                <FacilitatorButtonArrowRight onClick={this.arrowForward}>
                    <BsArrowRight>
                    </BsArrowRight>
                </FacilitatorButtonArrowRight>
                <FacilitatorButtonArrowLeft onClick={this.arrowBackward}>
                    <BsArrowLeft>

                    </BsArrowLeft>
                </FacilitatorButtonArrowLeft>
                <FacilitatorButtonHide onClick={this.hideResults}>
                    Hide Results
                        </FacilitatorButtonHide>
                <FacilitatorButtonClose onClick={this.closeVoting}>
                    Close voting
                        </FacilitatorButtonClose>
                <FacilitatorButtonStart onClick={this.startCountdown}>
                    Start Countdown
                        </FacilitatorButtonStart>
            </FacilitatorContainer>
        );
    }
}