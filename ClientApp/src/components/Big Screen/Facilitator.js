import React from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { BsFullscreen, BsFullscreenExit, BsStopwatch, BsCollection, BsLock, BsInfoCircle, BsEyeSlash, BsArrowLeft, BsArrowRight } from "react-icons/bs";

const FacilitatorContainer = styled.div`
    height: 100px;
    width: 60%;
    background: rgb(53, 57, 67);

    display: flex;
    flex-direction: row;

    position: fixed;
    bottom: 10%;
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

            code: props.code,
            questions: [],
            questionIndex: props.active,
        }

        this.toggleFullscreen = this.toggleFullscreen.bind(this);

        this.arrowBackward = this.arrowBackward.bind(this);
        this.arrowForward = this.arrowForward.bind(this);
        this.setActiveQuestion = this.setActiveQuestion.bind(this);
        this.getActiveQuestion = this.getActiveQuestion.bind(this);
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

    async getActiveQuestion(callback) {
        const state = this.state;
        const code = state.code;

        await axios.get(`admin/${this.state.code}/questions-all`).then(res => {
            if (res.status === 202) {
                this.setState({
                    questions: res.data,
                });
                callback();
            }
        });
    }

    async setActiveQuestion(index) {
        const state = this.state;
        const code = state.code;

        await axios.post(`admin/${code}/active-${index}`).then((res) => {
            if (res.status === 200) {
                this.setState({
                    questionIndex: index,
                })
            }
        });
    }

    async arrowBackward() {
        const state = this.state;
        const questions = state.questions;
        const active = state.questionIndex;

        await this.getActiveQuestion(() => {
            if (active > 0) {
                const index = active - 1;
                this.setActiveQuestion(index);
            }
        });
    }

    async arrowForward() {
        const state = this.state;
        const questions = state.questions;
        const active = state.questionIndex;

        await this.getActiveQuestion(() => {
            if (active < (questions.length - 1)) {
                const index = active + 1;
                this.setActiveQuestion(index);
            }
        });
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