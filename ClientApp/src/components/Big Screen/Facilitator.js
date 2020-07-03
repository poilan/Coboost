import React from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { BsFullscreen, BsFullscreenExit, BsStopwatch, BsCollectionFill, BsCollection, BsLock, BsInfoCircle, BsEyeSlash, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Ico_Text, Ico_MultipleChoice } from "../Classes/Icons";

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

const TextIcon = styled(Ico_Text)`
    width: 32px;
    height: 32px;

    img {
        width: inherit;
        height: inherit;
    }
`;

const MultipleIcon = styled(Ico_MultipleChoice)`
    width: 32px;
    height: 32px;

    img {
        width: inherit;
        height: inherit;
    }
`;

const IconText = styled(TextIcon)`
    position: relative;
    top: 14px;
`;

const IconMP = styled(MultipleIcon)`
    position: relative;
    top: 14px;
`;

const SlideContainer = styled.div`
    display: ${props => props.show ? "flex" : "none"};
    flex-direction: row;

    position: fixed;
    bottom: 205px;
    left: 5px;
`;

const Slide = styled.div`
    height: 64px;
    width: 128px;
    background: ${props => props.isActive ? "#F4F4F4" : "white"};
    border: 2px solid ${props => props.isActive ? "#4C7ADC" : "rgb(53, 57, 67)"};
    border-radius: 4px;

    flex: 1 1 auto;

    :not(:first-child) {
        margin-left: 5px;
    }
`;

const SlideText = styled.a`
    position: relative;
    top: -5px;
    right: 70px;

    user-select: none;
`;

export class Facilitator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fullscreen: false,
            showTasks: false,

            code: props.code,
            questions: [],
        }

        this.toggleFullscreen = this.toggleFullscreen.bind(this);

        this.arrowBackward = this.arrowBackward.bind(this);
        this.arrowForward = this.arrowForward.bind(this);
        this.setActiveQuestion = this.setActiveQuestion.bind(this);
        this.getActiveQuestion = this.getActiveQuestion.bind(this);
        this.onSlideClick = this.onSlideClick.bind(this);
        this.openTasks = this.openTasks.bind(this);
    }

    async openTasks() {
        await this.getActiveQuestion(() => {
            const showing = this.state.showTasks;
            var newState = !showing;

            this.setState({
                showTasks: newState,
            });
        })
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

    componentDidMount() {
        this.getActiveQuestion(() => {
            console.log("Mounted and got question count");
        })
    }

    async getActiveQuestion(callback) {
        const state = this.state;
        const code = state.code;

        await axios.get(`admin/${this.state.code}/questions-all`).then(res => {
            if (res.status === 202) {
                console.log(res.data);
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
            }
        });
    }

    async arrowBackward() {
        const state = this.state;
        const questions = state.questions;
        const active = this.props.active;

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
        const active = this.props.active;

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

    onSlideClick(target) {
        const index = target.id;
        
        this.setActiveQuestion(index);
    }

    render() {
        return (
            <>
                <FacilitatorContainer>
                    <FacilitatorButton onClick={this.arrowBackward}>
                        <BsArrowLeft class="icon" />
                    </FacilitatorButton>

                    <FacilitatorButton onClick={this.arrowForward}>
                        <BsArrowRight class="icon" />
                    </FacilitatorButton>

                    <FacilitatorButton onClick={this.openTasks}>
                        {this.state.showTasks ? <>
                            <BsCollectionFill class="icon" />
                        </> : <>
                            <BsCollection class="icon" />
                        </>}
                        <br/>
                        All tasks
                    </FacilitatorButton>

                    {/*<FacilitatorButton onClick={this.handleMinimize}>
                        <BsInfoCircle class="icon" /><br />
                        Information
                    </FacilitatorButton>*/}

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
                <SlideContainer show={this.state.showTasks}>
                    {this.state.questions.map(question => <Slide id={question.index} isActive={question.index === this.props.active} onClick={(e) => this.onSlideClick(e.target)}>
                        {question.questionType === 0 && <IconText id={question.index} onClick={(e) => this.onSlideClick(e.target)} />}
                        {question.questionType === 1 && <IconMP id={question.index} onClick={(e) => this.onSlideClick(e.target)} />}
                        <SlideText>{question.index + 1}</SlideText>
                    </Slide>)}
                </SlideContainer>
            </>
        );
    }
}