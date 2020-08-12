import React from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { BsFullscreen, BsFullscreenExit, BsFillCaretRightFill, BsStopwatch, BsCollectionFill, BsCollection, BsLock, BsInfoCircle, BsEye, BsEyeSlash, BsArrowLeft, BsArrowRight, BsCaretRightFill } from "react-icons/bs";
import { Ico_Text, Ico_MultipleChoice } from "../Classes/Icons";

const FacilitatorContainer = styled.div`
    display: flex;
    flex-direction: row;

    opacity: ${props => props.hide ? "0%" : "100%"};
    /*outline: 0;
    box-shadow: 0;
    border: solid rgb(106, 114, 137);
    border-width: 0 1px;*/

    &:hover {
        opacity:  100%;
    }
`;

const FacilitatorButton = styled.button`
    color: rgb(249, 251, 247);
    background-color: rgb(53, 57, 67);
    height: 100%;
    border: solid rgb(106, 114, 137);
    border-width: 2px 1px;
    outline: none;
    box-shadow: none;

    flex: 1 1 auto;

    .icon {
        width: 24px;
        height: 24px;
    }

    :focus {
        outline: none;
        box-shadow: none;
    }

    :active {
        border-color: rgb(83, 87, 97);
    }

    :last-child {
        border-top-right-radius: ${props => props.isBigScreen ? "10px" : "0px"};
        border-bottom-right-radius: ${props => props.isBigScreen ? "10px" : "0px"};
    }

    &:hover {
        background-color: rgb(73, 77, 87);
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
            hidden: true,
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
        this.hideResults = this.hideResults.bind(this);
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
        console.log("Countdown started");
    }

    closeVoting() {
        console.log("closing task...");
    }

    hideResults() {
        this.props.onResultToggle();
    }

    componentDidMount() {
        this.getActiveQuestion(() => {
            console.log("Mounted and got question count");
        })
    }

    async getActiveQuestion(callback) {
        const state = this.state;
        const code = sessionStorage.getItem('code');

        await axios.get(`admin/${code}/questions-all`).then(res => {
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
        const code = sessionStorage.getItem('code');

        await axios.post(`admin/${code}/active-${index}`).then((res) => {
            if (res.status === 200) {
            }
        });
    }

    async arrowBackward() {
        if (this.props.back !== undefined) {
            this.props.back();
        }
        else {

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
    }

    async arrowForward() {
        if (this.props.next !== undefined) {
            this.props.next();
        }
        else {
            const state = this.state;
            const questions = state.questions;
            const active = this.props.active;

            await this.getActiveQuestion(() => {
                if (active < questions.length) {
                    const index = active + 1;
                    this.setActiveQuestion(index);
                }
            });
        }
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

    /* Hide/Show Logic */
    onHover(state) {
        console.log("Hover state: " + state);
        this.setState({
            hidden: !state
        });
    }

    render() {
        if (this.props.toggle && this.state.hidden) {
            return(
                <>
                    <FacilitatorContainer style={{ left: "0px", bottom: this.props.style.bottom, position: "fixed", height: "100px", width: "25px", opacity: "15%" }}>
                        <FacilitatorButton isBigScreen={this.props.toggle} style={{borderTopRightRadius: "5px", borderBottomRightRadius: "5px"}} onMouseEnter={() => this.onHover(true)} onMouseLeave={() => this.onHover(false)}>
                            <BsCaretRightFill/>
                        </FacilitatorButton>
                    </FacilitatorContainer>
                </>
            )
        }
        return (
            <>
                <FacilitatorContainer onMouseLeave={() => this.onHover(false)} hide={this.props.toggle ? this.state.hidden : this.props.hide} style={this.props.style}>
                    <FacilitatorButton isBigScreen={this.props.toggle} onClick={this.arrowBackward}>
                        <BsArrowLeft class="icon" />
                    </FacilitatorButton>

                    <FacilitatorButton isBigScreen={this.props.toggle} onClick={this.arrowForward}>
                        <BsArrowRight class="icon" />
                    </FacilitatorButton>

                    {this.props.allTasks &&
                        <FacilitatorButton isBigScreen={this.props.toggle} onClick={this.openTasks}>
                            {this.state.showTasks ? <>
                                <BsCollectionFill class="icon" />
                            </> : <>
                                    <BsCollection class="icon" />
                                </>}
                            <br />
                        All tasks
                    </FacilitatorButton>
                    }

                    {/*<FacilitatorButton isBigScreen={this.props.toggle} onClick={this.handleMinimize}>
                        <BsInfoCircle class="icon" /><br />
                        Information
                    </FacilitatorButton>*/}

                    <FacilitatorButton isBigScreen={this.props.toggle} onClick={this.hideResults}>
                        {this.props.showingResult ? <>
                            <BsEyeSlash class="icon" /><br />
                            Hide Results
                        </> : <>
                                <BsEye class="icon" /><br />
                            Show Results
                        </>}
                    </FacilitatorButton>

                    {/*<FacilitatorButton isBigScreen={this.props.toggle} onClick={this.closeVoting}>
                        <BsLock class="icon" /><br/>
                        Lock answers
                    </FacilitatorButton>

                    <FacilitatorButton onClick={this.startCountdown}>
                        <BsStopwatch class="icon" /><br/>
                        Countdown
                    </FacilitatorButton>*/}

                    {this.props.fullscreen &&
                        <FacilitatorButton isBigScreen={this.props.toggle} onClick={this.toggleFullscreen}>
                            {this.state.fullscreen ? <>
                                <BsFullscreenExit class="icon" /><br />
                            Exit Fullscreen
                        </> : <>
                                    <BsFullscreen class="icon" /><br />
                            Enter Fullscreen
                        </>}
                        </FacilitatorButton>
                    }
                </FacilitatorContainer>
                <SlideContainer show={this.state.showTasks}>
                    {this.state.questions.map(question => <Slide id={question.Index} isActive={question.Index === this.props.active} onClick={(e) => this.onSlideClick(e.target)}>
                        {question.Type === 0 && <IconText id={question.Index} onClick={(e) => this.onSlideClick(e.target)} />}
                        {question.Type === 1 && <IconMP id={question.Index} onClick={(e) => this.onSlideClick(e.target)} />}
                        <SlideText>{question.Index + 1}</SlideText>
                    </Slide>)}
                </SlideContainer>
            </>
        );
    }
}