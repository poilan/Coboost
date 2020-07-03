import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { Button, Nav, Col, ToggleButton, Dropdown, ToggleButtonGroup, NavLink, DropdownButton } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Ico_Loading, Ico_Group152 } from "../Classes/Icons";
import SSE from "../Core/SSE";

const MainContainer = styled(Col)`
    display: table;
    height: 100%;
    width: 100%;
    background: #E4E4E4;
    position: absolute;
    padding: 0px;
`;

const Banner = styled(Col)`
    position: sticky;
    /*background: #4C7AD3;*/
    background: rgb(53, 57, 67);
    height: 75px;
    top: 0;
    left: 0;
    z-index: 11;
    padding-right: 15%;
`;

const BannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 2rem;
    color: #fff;
    padding: 25px 5px;
    position: absolute;
`;

const BannerButton = styled(DropdownButton)`
    background: #fff;
    border-radius: 100px;
    color: #100E0E;

    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    padding-left: 20px;
    padding-right: 20px;
    top: 25%;
    position: relative;
    float: right;

    margin: 0px 5px;

    button {
        background: none;
        border: none;

        font-family: CircularStd;
        font-weight: 450;

        color: #100E0E;
    };

    button:hover {
        background: none;
        border: none;

        color: #4C7AD3;
    };

    &.show {
        button {
            outline: none;
            background: none !important;
            border: none;
            color: #4C7AD3 !important;
        };
    }

    button:active {
        color: red;
    }
`;

const Header = styled(Col)`
    background: #fff;
    position: sticky;
    height: 50px;
    left: 0;
    top: 75px;

    display: flex;
    flex-direction: row;
    /*box-shadow: inset 0px -4px 0px 0px #cfcfcf;*/
    z-index: 10;
`;

const HeaderText = styled.h1`
    text-align: center;
    font-family: CircularStd;
    font-weight: 425;
    padding: 10px 35px;
    font-size: 1rem;
    /*border-bottom: 4px ${props => props.active === props.id ? "solid" : "hidden"} #4C7AD3;*/
    border-bottom: 4px ${props => props.active === props.id ? "solid" : "hidden"} rgb(53, 57, 67);
    cursor: pointer;

    :hover {
        border-bottom: 4px solid ${props => props.active === props.id ? "rgb(53, 57, 67)" : "#4f4f4f"};
    }

    flex: 1 1 auto;
    margin: 5px;
    margin-bottom: 0px;
`;

const ContentContainer = styled(Col)`
    background: #fff;
    box-shadow: 0px 0px 10px 0px #cfcfcf;
    position: relative;
    width: 100%;
    left: 0;
    margin-top: 75px;
    padding-top: 50px;
    padding-bottom: 50px;
`;

const Content = styled.div`
    background: #fff;
    width: 70%;
    margin-top: 20px;
    margin-left: 15%;
    border-radius: 10px;
    height: 75px;
    position: relative;
`;

const ContentTitle = styled.h3`
    font-size: 1.7rem;
    font-family: CircularStd;
    font-weight: 500;
    text-align: center;

    position: relative;
    padding: 30px;
    padding-bottom: 0;

    color: ${props => props.blue ? "#4C7AD3" : "black"};
`;

const ContentBody = styled.p`
    font-family: CircularStd;
    font-size: ${props => props.boxed ? "0.8em" : "1em"};
    text-align: center;

    position: relative;
    padding: 30px;

    background: ${props => props.boxed ? "#4C7ADC" : "transparent"};
    color: ${props => props.boxed ? "white" : "black"};
    border-radius: 10px;
`;

const ContentQuestion = styled.p`
    font-family: CircularStd;
    text-align: left;
    color: #4C7AD3;

    position: relative;
    padding: 0px 0px 10px 0px;
    margin: 0px 30px 0px 30px;
    border-bottom: 2px solid #cfcfcf;
`;

const ContentInput = styled.input`
    display: block;
    margin: 0 auto;
    margin-top: 35px;
    width: 100%;

    font-family: CircularStd;
    font-size: 1em;
    text-align: center;
    color: black;
    border: 0px solid;
    border-bottom: 1px solid #cfcfcf;
    padding-bottom: 10px;
`;

const ContentButton = styled(Button)`
    background: #fff;
    color: #100E0E;

    font-family: CircularStd;
    font-weight: 450;
    text-align: center;

    border-radius: 100px;
    padding-left: 20px;
    padding-right: 20px;

    display: block;
    margin: 0 auto;
    margin-top: 35px;
`;

const ContentFooter = styled.p`
    font-family: CircularStd;
    text-align: center;

    position: relative;
    top: 40px;
`;

const IconLoader = styled(Ico_Loading)`
    display: block;
    margin: 0 auto;
    height: 128px;

    @keyframes rotation {
        0% {
            transform: rotate(0deg), scale(1)
        }
        50% {
            transform: rotate(-180deg) scale(0.5);
        }
        100% {
            transform: rotate(-360deg) scale(1);
        }
    }

    animation: rotation 2.5s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
`;

const IconDone = styled(Ico_Group152)`
    display: block;
    margin: 5px auto;
    margin-bottom: 32px;
    height: 48px;

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(-360deg);
        }
    }

    animation: rotation 5s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
`;

const MultipleChoiceGroup = styled(ToggleButtonGroup)`
    display: block;
    padding: 20px;
`;

const TickStem = styled.div`
    position: relative;
    width: 2px;
    height: 12px;
    background-color: rgb(71, 114, 224);
    border-radius: 11px;
    left: 12px;
    top: 6px;
    transform: rotate(45deg);
`;

const TickKick = styled.div`
    position: relative;
    width: 6px;
    height: 2px;
    background-color: rgb(71, 114, 224);
    left: 5px;
    top: 1px;
    transform: rotate(45deg)
`;

const Tick = styled.div`
    width: 24px;
    height: 24px;

    float: left;

    border-radius: 12px;
    border: 1px solid black;

    margin-top: 3px;
    margin-right: 20px;

    display: inline-block;
`;

const MultipleChoiceButton = styled(ToggleButton)`
    background-color: transparent !important;
    border-radius: 10px !important;
    border-color: black !important;
    color: black !important;

    text-align: left;
    padding-left: 20px;

    :not(:first-child) {
        margin-top: 10px !important;
    }

    ${Tick} {
        ${TickKick} {
            background-color: transparent;
        };

        ${TickStem} {
            background-color: transparent;
        };
    };

    &.active {
        color: white !important;
        background-color: #006BDD !important;
        border-color: #006BDD !important;

        ${Tick} {
            display: inline;
            background-color: white;
            border-color: white;

            ${TickKick} {
                background-color: #006BDD;
            }

            ${TickStem} {
                background-color: #006BDD;
            }
        };
    };
`;

export class Mobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeHeader: "inputs",
            currentInput: 0,
            lastInput: 0,

            answers: [],
            inputs: [],

            loggedIn: false,
            sessionState: 0, // 0: Not started, 1: Answering, 2: Finished
            sse: null,
        }

        //this.eventSource = undefined;
        this.headerClick = this.headerClick.bind(this);
        this.questionChange = this.questionChange.bind(this);
        this.choicePick = this.choicePick.bind(this);
        this.inputsClick = this.inputsClick.bind(this);
        this.inputsEdit = this.inputsEdit.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        if (localStorage.getItem("user") !== null)
            this.setState({
                loggedIn: true
            });

        //this.startEventSource();
        const code = sessionStorage.getItem("code");
        var sse = new SSE(`client/${code}/question`);

        this.setState({
            sse: sse,
        })

        sse.startEventSource((e) => {
            sse.log("ASD");
            sse.addListener("question", (data) => {
                try {
                    var qData = JSON.parse(data); // Question data

                    var index = parseInt(qData.Index);

                    var question = {
                        type: qData.QuestionType,
                        title: qData.Title
                    }

                    if (question.type === 1) { // Multiple Choice
                        var choices = [];

                        qData.Options.forEach(choice => {
                            choices.push(choice.Title);
                        });

                        question.choices = choices;
                    }

                    var inputs = this.state.inputs;
                    inputs[index] = question;

                    this.setState({
                        inputs: inputs,
                    });

                    this.parseAnswers();

                    var currentState = this.state.sessionState;
                    if (currentState === 0 || currentState === 2) { // Either in the start phase or waiting phase
                        this.setState({
                            sessionState: 1
                        });
                    }
                } catch (e) {
                    sse.log("Failed to parse server event");
                }
            });
        });
    }

    componentWillUnmount() {
        if (this.eventSource)
            this.eventSource.close();
    }

    parseAnswers() {
        var answers = this.state.answers;

        const questions = this.getInputQuestions();
        questions.forEach((question, index) => {
            var answer = {
                index: index,
                value: (question.type === 0 ? "" : []),
            };

            if (!answers[index]) {
                answers.push(answer);
            }
        });

        this.setState({
            answers: answers
        });
    }

    /*startEventSource() {
        const code = sessionStorage.getItem("code");
        this.eventSource = new EventSource(`client/${code}/question`);

        this.eventSource.addEventListener("question", (e) => {
            try {
                var data = JSON.parse(e.data);

                var index = parseInt(data.Index);
                var question = {
                    type: data.QuestionType,
                    title: data.Title,
                }

                if (question.type === 1) // Multiple Choice
                {
                    var choices = []
                    data.Options.forEach(choice => {
                        choices.push(choice.Title);
                    });

                    question.choices = choices;
                }

                var inputs = this.state.inputs;
                inputs[index] = question;

                // Initially add the question
                this.setState({
                    inputs: inputs
                });
                // Then parse answers
                this.parseAnswers();

                // Show the question if a question isn't already showing
                var currentState = this.state.sessionState
                if (currentState === 0 || currentState === 2) {
                    this.setState({
                        sessionState: 1
                    })
                }
            } catch (e) {
                //console.log("Failed to parse server event: " + e.data);
                //console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("error", (e) => {
            if (e.eventPhase == EventSource.CLOSED) {
                //Connection was closed.
                //console.log("SSE: connection closed");
            } else {
                //console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("open", function (e) {
            //console.log("SSE: connection opened");
            // Connection was opened.
        }, false);
    }*/

    getInputQuestions() {
        return this.state.inputs;
    }

    getInputIndex() {
        return this.state.currentInput;
    }

    getInputAnswer() {
        const index = this.getInputIndex();
        const type = this.getInputType();
        const answerData = this.state.answers[index];

        if (answerData !== undefined) {
            return answerData.value
        } else {
            switch (type) {
                case 0:
                    return "";
                case 1:
                    return [];
            }
        }
    }

    setInputAnswer(answer) {
        const state = this.state;
        const index = this.getInputIndex();
        const answers = state.answers;
        answers[index].value = answer;

        this.setState({
            answers: answers
        })
    }

    getCurrentInput() {
        const inputs = this.getInputQuestions()
        return inputs[this.getInputIndex()];
    }

    getLastInput() {
        const inputs = this.getInputQuestions();
        return inputs[this.state.lastInput];
    }

    getInputType() {
        return this.getCurrentInput().type;
    }

    getInputTitle() {
        return this.getCurrentInput().title;
    }

    getInputChoices() {
        return this.getCurrentInput().choices;
    }

    headerClick(target) {
        const id = target.id;

        this.setState({
            activeHeader: id,
        });
    }

    welcomeRender() {
        return (
            <ContentContainer>
                <ContentTitle>Welcome!</ContentTitle>
                <ContentBody>Wait for the remaining participants, or until the administrator starts the presentation</ContentBody>
                <IconLoader />
                <ContentFooter>2 Participants</ContentFooter>
            </ContentContainer>
        );
    }

    finishedRender() {
        const lastInput = this.getLastInput();
        const lastType = lastInput.type;

        var word = "Open Text";

        switch (lastType) {
            case 0:
                word = "Open Text";
                break;
            case 1:
                word = "Voting";
                break;
        }

        return (
            <ContentContainer>
                <ContentTitle blue>{word} sent!</ContentTitle>
                <IconDone />
                <ContentBody boxed>Take it easy while waiting for the next task, change your last input or look at previous tasks.</ContentBody>
                <ContentButton onClick={this.inputsEdit}>Edit Last {word} Task</ContentButton>
            </ContentContainer>
        );
    }

    questionChange(e) {
        const target = e.target;
        const value = target.value;

        const index = this.getInputIndex();
        this.setInputAnswer(value);
    }

    questionRender() {
        return (
            <ContentContainer>
                <ContentQuestion>{this.getInputTitle()}</ContentQuestion>
                <ContentInput value={this.getInputAnswer()} name={`q-${this.getInputIndex()}`} onChange={this.questionChange} placeholder="Write your answer..." />
                <ContentButton onClick={this.inputsClick}>Send Input</ContentButton>
            </ContentContainer>
        );
    }

    choicePick(picked) {
        const index = this.getInputIndex();
        const options = this.getInputChoices();

        var chosen = [];

        picked.forEach(pick => {
            var pickData = pick.split("-");
            var choiceIndex = parseInt(pickData[0]);
            var id = parseInt(pickData[1]);

            if (choiceIndex === index) {
                var name = options[id];
                //chosen.push({name: name, index: id})
                chosen.push(pick);
            }
        })

        this.setInputAnswer(chosen);
    }

    inputsClick() {
        const state = this.state;
        const questions = this.getInputQuestions().length;
        const current = this.getInputIndex();

        const type = this.getInputType();
        const answer = this.getInputAnswer();

        var newState = 1;
        var newIndex = current + 1;

        // Send the input
        const code = sessionStorage.getItem("code");
        var user = "anonymous";
        if (state.loggedIn) {
            user = localStorage.getItem("user");
        }

        var data = {
            UserID: user,
        }

        // Send
        if (type === 0) { // Open Text
            //data.title = answer // Title just uses description if it isn't set
            data.Description = answer

            axios.post(`client/${code}/add-opentext`, data);
        }
        else if (type === 1) { // Multiple Choice
            answer.forEach(option => {
                var optionData = option.split("-");
                var index = parseInt(optionData[1]);
                data.Option = index

                axios.post(`client/${code}/add-multiplechoice`, data);
            })
        }

        this.setState({
            currentInput: newIndex,
            lastInput: current,
            sessionState: newState,
        })
    }

    inputsEdit() {
        const lastInput = this.state.lastInput;
        this.setState({
            currentInput: lastInput,
            sessionState: 1,
        })
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
    }

    choiceRender() {
        return (
            <ContentContainer>
                <ContentQuestion>{this.getInputTitle()}</ContentQuestion>
                <MultipleChoiceGroup onChange={this.choicePick} toggle type="checkbox" name={`group-${this.getInputIndex()}`} vertical value={this.getInputAnswer()}>
                    {this.getInputChoices().map((choice, index) =>
                        <MultipleChoiceButton key={index} value={`${this.getInputIndex()}-${index}`} name={`${this.getInputIndex()}-${choice}-${index}`} size="lg">
                            <Tick>
                                <TickStem />
                                <TickKick />
                            </Tick>
                            {choice}
                        </MultipleChoiceButton>)}
                </MultipleChoiceGroup>

                <ContentButton onClick={this.inputsClick}>Send Vote</ContentButton>
            </ContentContainer>
        );
    }

    processScreens() {
        const state = this.state.sessionState;

        switch (state) {
            case 0: // Start Screen
                return this.welcomeRender();
            case 1: // Answer Screen
                if (this.getCurrentInput() !== undefined) {
                    const type = this.getInputType();
                    const answer = this.getInputAnswer();

                    if (answer !== 0) {
                        if (type === 0)
                            return this.questionRender()
                        else if (type === 1)
                            return this.choiceRender()
                    }
                } else {
                    if (this.getInputIndex() > 0)
                        return this.finishedRender()
                    else
                        return this.welcomeRender()
                }

            case 2: // Wait for more questions
                return this.finishedRender();
        }
    }

    renderPage() {
        const tab = this.state.activeHeader;

        // eslint-disable-next-line default-case
        switch (tab) {
            case "inputs":
                return this.processScreens();
        }
    }

    tabTitle(type) {
        var title = null;

        switch (type) {
            case 0:
                title = "Open Text";
                break;
            case 1:
                title = "Multiple Choice";
                break;
            default:
                title = "Waiting";
                break;
        }

        return title;
    }

    render() {
        return (
            <>
                <MainContainer>
                    <Banner>
                        <BannerText>Pin: #{sessionStorage.getItem("code")}</BannerText>
                        {this.state.loggedIn && < BannerButton title="User">
                            <Dropdown.Item onClick={this.logout}> Logout</Dropdown.Item>
                        </BannerButton>}
                    </Banner>
                    <Header>
                        <HeaderText active={this.state.activeHeader} onClick={(e) => this.headerClick(e.target)} id='inputs'>{this.getCurrentInput() !== undefined ? this.tabTitle(this.getInputType()) : "Waiting"}</HeaderText>
                        <HeaderText active={this.state.activeHeader} onClick={(e) => this.headerClick(e.target)} id='archive'>Archive</HeaderText>
                    </Header>
                    {this.renderPage()}
                </MainContainer>
            </>
        );
    }
}