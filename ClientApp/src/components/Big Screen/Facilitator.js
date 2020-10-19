import React from "react"
import Styled from "styled-components";
import Axios from "axios";
import {
    BsFullscreen, BsFullscreenExit, BsFillCaretRightFill, BsStopwatch, BsCollectionFill, BsCollection, BsLock, BsInfoCircle, BsEye, BsEyeSlash, BsArrowLeft, BsArrowRight, BsCaretRightFill
} from "react-icons/bs";
import { Ico_Text, Ico_MultipleChoice, Ico_Points, Ico_Slider } from "../Classes/Icons";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";

// ReSharper disable UnknownCssClass.Global

const FacilitatorContainer = Styled.div`
    display: flex;
    flex-direction: row;

    opacity: ${props => props.hide
        ? "0%"
        : "100%"};
    /*outline: 0;
    box-shadow: 0;
    border: solid rgb(106, 114, 137);
    border-width: 0 1px;*/

    &:hover {
        opacity:  100%;
    }
`;

const FacilitatorButton = Styled.button`
    color: rgb(249, 251, 247);
    background-color: ${props => props.isBigScreen
        ? "#575b75"
        : "rgb(66, 67, 85)"};
    height: 100%;
    border: ${props => props.isBigScreen
        ? "solid rgb(106, 114, 137)"
        : "none"};
    border-width: 2px 1px;
    outline: none;
    box-shadow: none;
    border-top: ${props => props.isBigScreen
        ? "none"
        : "1px solid white"};

    flex: 1 1 auto;

    .icon {
        width: 24px;
        height: 24px;
    }

    :not(:last-child) {
        border-right: ${props => props.isBigScreen
        ? "none"
        : "1px solid white"};
    }

    :focus {
        outline: none;
        box-shadow: none;
    }

    :active {
        border-color: rgb(83, 87, 97);
    }

    :last-child {
        border-top-right-radius: ${props => props.isBigScreen
        ? "10px"
        : "0px"};
        border-bottom-right-radius: ${props => props.isBigScreen
        ? "10px"
        : "0px"};
    }

    &:hover {
        background-color: ${props => props.isBigScreen
        ? "rgb(73, 77, 87)"
        : "rgb(76, 77, 95)"};
    }
`;

const TextIcon = Styled(Ico_Text)`
    width: 32px;
    height: 32px;

    img {
        width: inherit;
        height: inherit;
    }
`;

const MultipleIcon = Styled(Ico_MultipleChoice)`
    width: 32px;
    height: 32px;

    img {
        width: inherit;
        height: inherit;
    }
`;

const PointsIcon = Styled(Ico_Points)`
    width: 32px;
    height: 32px;

    img {
        width: inherit;
        height: inherit;
    }
`;

const SliderIcon = Styled(Ico_Slider)`
    width: 32px;
    height: 32px;

    img {
        width: inherit;
        height: inherit;
    }
`;

const IconText = Styled(TextIcon)`
    position: relative;
    top: 14px;
`;

const IconMP = Styled(MultipleIcon)`
    position: relative;
    top: 14px;
`;

const IconPoints = Styled(PointsIcon)`
    position: relative;
    top: 14px;
`;

const IconSlider = Styled(SliderIcon)`
    position: relative;
    top: 14px;
`;

const SlideContainer = Styled.div`
    display: ${props => props.show
        ? "flex"
        : "none"};
    flex-direction: row;

    position: fixed;
    bottom: 205px;
    left: 5px;
`;

const Slide = Styled.div`
    height: 64px;
    width: 128px;
    background: ${props => props.isActive
        ? "#F4F4F4"
        : "white"};
    border: 2px solid ${props => props.isActive
        ? "#4C7ADC"
        : "#575b75"};
    border-radius: 4px;

    flex: 1 1 auto;

    :not(:first-child) {
        margin-left: 5px;
    }
`;

const SlideText = Styled.a`
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
            questions: []
        };

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
            const Showing = this.state.showTasks;
            var NewState = !Showing;

            this.setState({
                showTasks: NewState
            });
        });
    }

    handleExit() {
        console.log("Handling exit");
    }

    handleMinimize() {
        console.log("Handling minimize property");
    }

    startCountdown() {
        console.log("Countdown started");
    }

    closeVoting() {
        console.log("closing task...");
    }

    hideResults() {

        //this.props.onResultToggle();
        const Code = sessionStorage.getItem("code");
        const Active = -1;

        Axios.post(`admin/${Code}/question-results-toggle${Active}`).then(() => {
            this.getActiveQuestion(() => {
                console.log("Results Toggled!");
            });
        });
    }

    componentDidMount() {
        this.getActiveQuestion(() => {
            console.log("Mounted and got question count");
        });
    }

    async getActiveQuestion(callback) {
        const Code = sessionStorage.getItem("code");

        await Axios.get(`admin/${Code}/questions-all`).then(res => {
            if (res.status === 202) {
                this.setState({
                    questions: res.data
                });
                callback();
            }
        });
    }

    async setActiveQuestion(index) {
        const Code = sessionStorage.getItem("code");

        await Axios.post(`admin/${Code}/active-${index}`).then((res) => {
            if (res.status === 200) { }
        });
    }

    async arrowBackward() {
        if (this.props.back !== undefined) {
            this.props.back();
        }
        else {
            const Active = this.props.active;

            await this.getActiveQuestion(() => {
                if (Active > 0) {
                    const Index = Active - 1;
                    this.setActiveQuestion(Index);
                }
            });
        }
    }

    async arrowForward() {
        if (this.props.next !== undefined) {
            this.props.next();
        }
        else {
            const Questions = this.state.questions;
            const Active = this.props.active;

            await this.getActiveQuestion(() => {
                if (Active < Questions.length) {
                    const Index = Active + 1;
                    this.setActiveQuestion(Index);
                }
            });
        }
    }

    toggleTask = () => {
        const Code = sessionStorage.getItem("code");
        const Active = -1;

        Axios.post(`admin/${Code}/task-toggle${Active}`).then(() => {
            this.getActiveQuestion(() => {
                console.log("Results Toggled!");
            });
        });
    }

    toggleFullscreen() {
        const Document = window.document;
        const Element = Document.documentElement;

        const Request = Element.requestFullscreen ||
            Element.mozRequestFullScreen ||
            Element.webkitRequestFullScreen ||
            Element.msRequestFullscreen;
        const Cancel = Document.exitFullscreen ||
            Document.mozCancelFullScreen ||
            Document.webkitExitFullscreen ||
            Document.msExitFullscreen;

        let Fullscreen = this.state.fullscreen;

        if (!Document.fullscreenElement &&
            !Document.mozFullScreenElement &&
            !Document.webkitFullscreenElement &&
            !Document.msFullscreenElement) {
            Request.call(Element);
            Fullscreen = !Fullscreen;
        }
        else {
            Cancel.call(Document);
            Fullscreen = !Fullscreen;
        }

        this.setState({
            fullscreen: Fullscreen
        });
    }

    onSlideClick(target) {
        const Index = target.id;

        this.setActiveQuestion(Index);
    }

    /* Hide/Show Logic */
    onHover(state) {
        this.setState({
            hidden: !state
        });
    }

    render() {
        if (this.props.toggle && this.state.hidden) {
            return (
                <React.Fragment>
                    <FacilitatorContainer style={{
                        left: "0",
                        bottom: this.props.style.bottom,
                        position: "fixed",
                        height: "100px",
                        width: "25px",
                        opacity: "15"
                    }}>
                        <FacilitatorButton isBigScreen={this.props.toggle}
                            onMouseEnter={() => this.onHover(true)}
                            onMouseLeave={() => this.onHover(false)}
                            style={{
                                borderTopRightRadius: "5px",
                                borderBottomRightRadius: "5px"
                            }}>
                            <BsCaretRightFill />
                        </FacilitatorButton>
                    </FacilitatorContainer>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <FacilitatorContainer hide={this.props.toggle
                    ? this.state.hidden
                    : this.props.hide}
                    onMouseLeave={() => this.onHover(false)}
                    style={this.props.style}>

                    <FacilitatorButton isBigScreen={this.props.toggle}
                        onClick={this.arrowBackward}>
                        <BsArrowLeft class="icon" />
                        <br />
                        Previous Task
                    </FacilitatorButton>

                    <FacilitatorButton isBigScreen={this.props.toggle}
                        onClick={this.arrowForward}>
                        <BsArrowRight class="icon" />
                        <br />
                        Next Task
                    </FacilitatorButton>

                    {this.props.allTasks &&
                        <FacilitatorButton isBigScreen={this.props.toggle}
                            onClick={this.openTasks}>
                            {this.state.showTasks
                                ? <React.Fragment>
                                    <BsCollectionFill class="icon" />
                                </React.Fragment>
                                : <React.Fragment>
                                    <BsCollection class="icon" />
                                </React.Fragment>}
                            <br />
                            All tasks
                    </FacilitatorButton>
                    }

                    { /*<FacilitatorButton isBigScreen={this.props.toggle} onClick={this.handleMinimize}>
                        <BsInfoCircle class="icon" /><br />
                        Information
                    </FacilitatorButton>*/
                    }

                    {this.state.questions[this.props.active] &&
                        <FacilitatorButton isBigScreen={this.props.toggle}
                            onClick={this.hideResults}>
                            {this.state.questions[this.props.active].ShowResults
                                ? <React.Fragment>
                                    <BsEye class="icon" />
                                    <br />
                                    Results Shown
                                </React.Fragment>
                                : <React.Fragment>
                                    <BsEyeSlash class="icon" />
                                    <br />
                                    Results Hidden
                                </React.Fragment>
                            }
                        </FacilitatorButton>
                    }

                    {this.state.questions[this.props.active] &&
                        <FacilitatorButton isBigScreen={this.props.toggle}
                            onClick={this.toggleTask}>
                            {this.state.questions[this.props.active].InProgress
                                ? <React.Fragment>
                                    <LockOpenIcon className="icon" />
                                    <br />
                                    Task Open
                                </React.Fragment>
                                : <React.Fragment>
                                    <LockIcon className="icon" />
                                    <br />
                                    Task Closed
                                </React.Fragment>
                            }
                        </FacilitatorButton>
                    }

                    { /*
                    <FacilitatorButton onClick={this.startCountdown}>
                        <BsStopwatch class="icon" /><br/>
                        Countdown
                    </FacilitatorButton>*/
                    }

                    {this.props.fullscreen &&
                        <FacilitatorButton isBigScreen={this.props.toggle}
                            onClick={this.toggleFullscreen}>
                            {this.state.fullscreen
                                ? <React.Fragment>
                                    <BsFullscreenExit class="icon" />
                                    <br />
                            Exit Fullscreen
                        </React.Fragment>
                                : <React.Fragment>
                                    <BsFullscreen class="icon" />
                                    <br />
                            Enter Fullscreen
                        </React.Fragment>
                            }
                        </FacilitatorButton>
                    }
                </FacilitatorContainer>
                <SlideContainer show={this.state.showTasks}>
                    {this.state.questions.map(question =>
                        <Slide id={question.Index}
                            isActive={question.Index === this.props.active}
                            onClick={(e) => this.onSlideClick(e.target)}>
                            {question.Type === 0 &&
                                <IconText id={question.Index} onClick={(e) => this.onSlideClick(e.target)} />
                            }
                            {question.Type === 1 &&
                                <IconMP id={question.Index} onClick={(e) => this.onSlideClick(e.target)} />
                            }
                            {question.Type === 2 &&
                                <IconPoints id={question.Index} onClick={(e) => this.onSlideClick(e.target)} />
                            }
                            {question.Type === 3 &&
                                <IconSlider id={question.Index} onClick={(e) => this.onSlideClick(e.target)} />
                            }
                            <SlideText>{question.Index + 1}</SlideText>
                        </Slide>
                    )}
                </SlideContainer>
            </React.Fragment>
        );
    }
}