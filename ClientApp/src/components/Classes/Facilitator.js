import React from 'react'
import styled from 'styled-components';
import { BsFullscreenExit, BsStopwatch, BsCollection, BsLock, BsInfoCircle, BsEyeSlash, BsArrowLeft, BsArrowRight } from "react-icons/bs";

const FacilitatorContainer = styled.div`
    height: 10%;
    width: 60%;
    background: rgb(53, 57, 67);

    display: flex;
    flex-direction: row;

    position: absolute;
    bottom: -12.6%;
    left: 0px;
`;

const FacilitatorButton = styled.button`
    color: rgb(249, 251, 247);
    background-color: rgb(53, 57, 67);
    height: 100%;
    border: 0px solid;

    flex: 1 1 auto;

    .icon {
        width: 24px;
        height: 24px;
    }

    :focus {
        outline: none;
        box-shadow: none;
    }
`;

export class Facilitator extends React.Component {
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
                <FacilitatorButton onClick={this.arrowBackward}>
                    <BsArrowLeft class="icon" />
                </FacilitatorButton>

                <FacilitatorButton onClick={this.arrowForward}>
                    <BsArrowRight class="icon" />
                </FacilitatorButton>

                <FacilitatorButton>
                    <BsCollection class="icon" /><br />
                    All tasks
                </FacilitatorButton>

                <FacilitatorButton onClick={this.handleMinimize}>
                    <BsInfoCircle class="icon" /><br />
                    Information
                </FacilitatorButton>

                <FacilitatorButton onClick={this.hideResults}>
                    <BsEyeSlash class="icon" /><br/>
                    Hide results
                </FacilitatorButton>

                <FacilitatorButton onClick={this.closeVoting}>
                    <BsLock class="icon" /><br/>
                    Lock answers
                </FacilitatorButton>

                <FacilitatorButton onClick={this.startCountdown}>
                    <BsStopwatch class="icon" /><br/>
                    Countdown
                </FacilitatorButton>

                <FacilitatorButton>
                    <BsFullscreenExit class="icon" /><br/>
                    Exit Fullscreen
                </FacilitatorButton>
            </FacilitatorContainer>
        );
    }
}