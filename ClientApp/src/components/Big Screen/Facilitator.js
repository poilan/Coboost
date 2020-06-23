import React from 'react'
import styled from 'styled-components';
import { BsFullscreen, BsFullscreenExit, BsStopwatch, BsCollection, BsLock, BsInfoCircle, BsEyeSlash, BsArrowLeft, BsArrowRight } from "react-icons/bs";

const FacilitatorContainer = styled.div`
    height: 100px;
    width: 60%;
    background: rgb(53, 57, 67);

    display: flex;
    flex-direction: row;

    position: fixed;
    bottom: 100px;
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

        this.state = {
            fullscreen: false,
        }

        this.toggleFullscreen = this.toggleFullscreen.bind(this);
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

    toggleFullscreen() {
        var document = window.document;
        var element = document.documentElement;

        var request = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullScreen || element.msRequestFullscreen;
        var cancel = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;

        var fullscreen = this.state.fullscreen;

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            request.call(element);
            fullscreen = !fullscreen;
        } else {
            cancel.call(document);
            fullscreen = !fullscreen;
        }

        this.setState({
            fullscreen: fullscreen,
        });
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

                <FacilitatorButton onClick={this.toggleFullscreen}>
                    {this.state.fullscreen ? <>
                        <BsFullscreenExit class="icon" /><br />
                        Exit Fullscreen
                    </> : <>
                        <BsFullscreen class="icon" /><br />
                        Enter Fullscreen
                    </>}
                </FacilitatorButton>
            </FacilitatorContainer>
        );
    }
}