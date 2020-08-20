import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import { Button, Nav, Col, ToggleButton, Dropdown, ToggleButtonGroup, NavLink, DropdownButton } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Ico_Loading, Ico_Group152 } from "../Classes/Icons";
import SSE from "../Core/SSE";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Rating from '@material-ui/lab/Rating';

import BannerDropdown, { BannerLink } from '../Classes/Dropdown';

const MainContainer = styled(Col)`
    display: table;
    height: 100%;
    width: 100%;
    background: #E4E4E4;
    position: absolute;
    padding: 0px;
    padding-bottom: 50px;
`;

const Banner = styled(Col)`
    position: absolute;
    /*background: #4C7AD3;*/
    background: rgb(53, 57, 67);
    height: 50px;
    bottom: 0;
    left: 0;
    z-index: 11;
    padding-right: 15%;
`;

const BannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 1rem;
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
    min-height: 50%;
    left: 0;
    margin-top: 2px;
    padding: 25px;
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
    font-size: 1rem;
    font-family: CircularStd;
    font-weight: 500;
    text-align: center;

    position: relative;
    padding: 10px 30px;
    padding-bottom: 0;

    color: ${props => props.blue ? "#4C7AD3" : "black"};
`;

const ContentBody = styled.p`
    font-family: CircularStd;
    font-size: ${props => props.boxed ? "0.8rem" : "1rem"};
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
    padding: 0px 30px 10px 30px;
    border-bottom: 2px solid #cfcfcf;
`;

const ContentInput = styled.textarea`
    display: block;
    width: calc(100% - 60px);

    font-family: CircularStd;
    font-size: 1rem;
    text-align: center;
    color: black;
    border: 0;
    border-bottom: 1px solid #cfcfcf;
    margin: 30px;
    resize: none;
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
    margin: 35px auto 0 auto;

    margin-bottom: 50px;
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
            title: "",

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

        const code = sessionStorage.getItem("code");

        axios.get(`admin/${code}/questions-all`).then(res => {
            if (res.status === 202) {
                var data = res.data;

                //var inputs = [];
                //data.forEach((q) => {
                //    var task = {
                //        Type: q.type,
                //        Title: q.title,
                //        Index: q.index,
                //        Options: q.options,
                //    };

                //    inputs[q.index] = task;
                //});

                this.setState({
                    inputs: data,
                });

                this.parseAnswers();
            }
        });

        var sse = new SSE(`client/${code}/question`);

        this.setState({
            sse: sse,
        })

        sse.startEventSource((e) => {
            sse.addListener("question", (e) => {
                try {
                    var data = JSON.parse(e.data); // Question data

                    var index = parseInt(data.Index);

                    //if (data.Type === 1) { // Multiple Choice
                    //    var choices = [];

                    //    data.Options.forEach(choice => {
                    //        choices.push(choice.Title);
                    //    });

                    //    data.choices = choices;
                    //}

                    if (data.Type === 2) {
                    }
                    else if (data.Type === 3) {
                    }

                    var inputs = this.state.inputs;
                    inputs[index] = data;

                    this.setState({
                        inputs: inputs,
                    });

                    this.parseAnswers();

                    this.setState({
                        currentInput: index,
                        sessionState: 1
                    });
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
        var answers = [];

        const questions = this.getTasks();
        questions.forEach((question, index) => {
            var answer = {
                index: index,
                value: question.Type === 0 ? "" : []
            };

            if (question.Options !== undefined) {
                if (question.Type === 2) {
                    let values = [];

                    for (let i = 0; i < question.Options.length; i++) {
                        values.push(0);
                    }
                    answer.value = values;
                    question.Spent = 0;
                }
                else if (question.Type === 3) {
                    let values = [];

                    for (let i = 0; i < question.Options.length; i++) {
                        values.push(question.Min);
                    }

                    answer.value = values;
                }
            }

            if (answers[index] !== undefined) {
                answers[index] = answer;
            }
            else {
                answers.push(answer);
            }
        });

        this.setState({
            answers: answers
        });
    }

    getTasks() {
        return this.state.inputs;
    }

    getTaskIndex() {
        return this.state.currentInput;
    }

    getTaskAnswers() {
        const index = this.getTaskIndex();
        const type = this.getTaskType();
        const answerData = this.state.answers[index];

        if (answerData !== undefined) {
            return answerData.value
        } else {
            switch (type) {
                case 0:
                    return "";
                default:
                    return [];
            }
        }
    }

    setTaskAnswers(answer) {
        const state = this.state;
        const index = this.getTaskIndex();
        const answers = state.answers;
        answers[index].value = answer;

        this.setState({
            answers: answers
        })
    }

    getCurrentTask() {
        const inputs = this.getTasks()
        return inputs[this.getTaskIndex()];
    }

    getLastTask() {
        const inputs = this.getTasks();
        return inputs[this.state.lastInput];
    }

    getTaskType() {
        return this.getCurrentTask().Type;
    }

    getTaskTitle() {
        return this.getCurrentTask().Title;
    }

    getTaskOptions() {
        return this.getCurrentTask().Options;
    }

    getOptionMax() {
        return this.getCurrentTask().Max;
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
        const lastInput = this.getLastTask();
        const lastType = lastInput.Type;

        var word = "Open Text";

        switch (lastType) {
            case 0:
                word = "Input";
                break;
            default:
                word = "Vote";
                break;
        }

        return (
            <ContentContainer>
                <ContentTitle blue>{word} sent!</ContentTitle>
                <IconDone />
                <ContentBody boxed>Take it easy while waiting for the next task, or you can send another {word}!</ContentBody>
                <ContentButton onClick={this.inputsEdit}>New {word}</ContentButton>
            </ContentContainer>
        );
    }

    questionChange(e) {
        const target = e.target;
        const value = target.value;
        target.style.height = "inherit";
        target.style.height = `${target.scrollHeight + 1}px`;

        this.setTaskAnswers(value);
    }

    questionRender() {
        const titleChange = (e) => {
            const target = e.target;
            const value = target.value;

            this.setState({
                title: value,
            });
        }
        return (
            <ContentContainer>
                <ContentQuestion>{this.getTaskTitle()}</ContentQuestion>
                {this.getTaskAnswers().length > 20 && <ContentInput type="text" value={this.state.title} name={`q-${this.getTaskIndex()}-title`} maxLength="20" onChange={titleChange} onFocus={this.placeholder = ""} onBlur={this.placeholder = "Give your input a title"} placeholder="Give your input a title..." />}
                <ContentInput type="text" value={this.getTaskAnswers()} name={`q-${this.getTaskIndex()}`} onChange={this.questionChange} onFocus={this.placeholder = ""} onBlur={this.placeholder = "Write your answer..."} placeholder="Write your answer..." />
                <ContentButton disabled={(this.getTaskAnswers().length <= 20 && this.getTaskAnswers().length < 3) || (this.getTaskAnswers().length > 20 && this.state.title < 3)} onClick={this.inputsClick}>{this.getTaskAnswers().length < 3 ? "Write Input" : (this.getTaskAnswers().length > 20 && this.state.title < 3) ? "Write Title" : "Send Input!"}</ContentButton>
            </ContentContainer>
        );
    }

    choicePick(picked) {
        const index = this.getTaskIndex();
        const options = this.getTaskOptions();
        const max = this.getOptionMax();

        if (picked.length >= this.getTaskAnswers().length && picked.length > max) {
            return;
        }

        var chosen = [];

        picked.forEach(pick => {
            var pickData = pick.split("-");
            var choiceIndex = parseInt(pickData[0]);

            if (choiceIndex === index) {
                chosen.push(pick);

                if (chosen.length >= max) {
                    this.setTaskAnswers(chosen);
                    return;
                }
            }
        })

        this.setTaskAnswers(chosen);
    }

    pointsChange(index, value) {
        const answers = this.getTaskAnswers();
        let spent = 0;
        let tasks = this.getTasks();
        const change = value - answers[index];

        if (tasks[this.getTaskIndex()].Amount < tasks[this.getTaskIndex()].Spent + change) {
            let maximum = tasks[this.getTaskIndex()].Amount - tasks[this.getTaskIndex()].Spent;

            if (maximum < 1)
                return;
            else
                value = maximum;
        }
        for (let i = 0; i < this.getTaskOptions().length; i++) {
            if (answers[i] == undefined)
                answers[i] = 0;

            if (index == i) {
                answers[i] = value;
            }

            if (answers[i] > 0) {
                spent += answers[i];
            }
        }

        tasks[this.getTaskIndex()].Spent = spent;
        this.setState({
            inputs: tasks
        });
        this.setTaskAnswers(answers);
    }

    sliderChange(index, value) {
        const answers = this.getTaskAnswers();
        answers[index] = value;
        this.setTaskAnswers(answers);
    }

    inputsClick() {
        const state = this.state;
        const questions = this.getTasks().length;
        const current = this.getTaskIndex();

        const type = this.getTaskType();
        const answer = this.getTaskAnswers();

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
            data.Description = answer;

            if (data.Description.length > 20) {
                data.Title = this.state.title;
            }

            axios.post(`client/${code}/add-opentext`, data);
        }
        else if (type === 1) { // Multiple Choice
            answer.forEach(option => {
                var optionData = option.split("-");
                var index = parseInt(optionData[1]);
                data.Option = index;

                axios.post(`client/${code}/add-multiplechoice`, data);
            })
        }
        else if (type === 2) { // Points
            data.Points = answer;
            axios.post(`client/${code}/add-points`, data);
        }
        else if (type === 3) { // Slider
            data.Ratings = answer;
            axios.post(`client/${code}/add-slider`, data);
        }

        this.parseAnswers();

        this.setState({
            lastInput: current,
            sessionState: 2,
            title: "",
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
                <ContentQuestion>{this.getTaskTitle()}</ContentQuestion>
                <MultipleChoiceGroup onChange={this.choicePick} toggle type="checkbox" name={`group-${this.getTaskIndex()}`} vertical value={this.getTaskAnswers()}>
                    {this.getTaskOptions().map((choice) =>
                        <MultipleChoiceButton key={choice.Index} value={`${this.getTaskIndex()}-${choice.Index}`} name={`${this.getTaskIndex()}-${choice.Title}-${choice.Index}`} size="lg">
                            <Tick>
                                <TickStem />
                                <TickKick />
                            </Tick>
                            {choice.Title}
                        </MultipleChoiceButton>)}
                </MultipleChoiceGroup>

                <ContentButton onClick={this.inputsClick}>Send Vote</ContentButton>
            </ContentContainer>
        );
    }

    pointsRender() {
        let task = this.getCurrentTask();
        let answers = this.state.answers[this.getTaskIndex()];
        return (
            <ContentContainer>
                <ContentQuestion>{task.Title}</ContentQuestion>
                <Box component="fieldset" mb={3} pt={2} px={2} borderColor="transparent">
                    { //<Typography component="legend">{task.Spent == undefined ? task.Amount : task.Amount - task.Spent} left to assign!</Typography>
                    }
                    {task.Options.map((point) =>
                        <Box key={point.Index} component="fieldset" mb={3} pt={1} px={1} borderColor="transparent">
                            <Typography component="legend">{point.Title}</Typography>
                            <Rating name={point.Title} value={answers.value[point.Index]} max={task.Max} onChange={(e, value) => this.pointsChange(point.Index, value)} />
                        </Box>
                    )}
                </Box>
                <ContentButton disabled={task.Spent != task.Amount} onClick={this.inputsClick}>{task.Spent != task.Amount ? (task.Amount - task.Spent) + " points left!" : "Send Vote"}</ContentButton>
            </ContentContainer>
        );
    }

    sliderRender() {
        let task = this.getCurrentTask();
        let answers = this.state.answers[this.getTaskIndex()];;

        return (
            <ContentContainer>
                <ContentQuestion>{task.Title}</ContentQuestion>
                <Box component="fieldset" mb={3} pt={2} px={2} borderColor="transparent">
                    {task.Options.map((slider) =>
                        <Box key={slider.Index} component="fieldset" mb={3} pt={1} px={1} borderColor="transparent">
                            <Typography component="legend">{slider.Title}</Typography>
                            <Slider name={slider.Title} value={answers.value[slider.Index]}
                                step={1} marks min={task.Min} max={task.Max}
                                aria-labledby="discrete-slider" valueLabelDisplay="auto"
                                onChange={(e, value) => this.sliderChange(slider.Index, value)} />
                        </Box>
                    )}
                </Box>
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
                if (this.getCurrentTask() !== undefined) {
                    const type = this.getTaskType();
                    const answer = this.getTaskAnswers();

                    if (answer !== 0) {
                        if (type === 0)
                            return this.questionRender()
                        else if (type === 1)
                            return this.choiceRender()
                        else if (type === 2)
                            return this.pointsRender()
                        else if (type === 3)
                            return this.sliderRender()
                    }
                } else {
                    if (this.getTaskIndex() > 0)
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
        let task = this.getCurrentTask();

        switch (type) {
            case 0:
                title = "Open Text";
                break;
            case 1:
                title = "Multiple Choice";
                break;
            case 2:
                title = "Points" + (task.Spent == undefined ? task.Amount : task.Amount - task.Spent) + " left to assign!";
                break;
            case 3:
                title = "Slider";
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
                        {this.state.loggedIn && <BannerDropdown title="User" style={{ float: "right", position: "relative", top: "50%", transform: "translateY(-50%)" }}>
                            <BannerLink onClick={this.logout}>Test</BannerLink>
                        </BannerDropdown>}
                    </Banner>
                    <Header>
                        <HeaderText active={this.state.activeHeader} onClick={(e) => this.headerClick(e.target)} id='inputs'>{this.getCurrentTask() !== undefined ? this.tabTitle(this.getTaskType()) : "Waiting"}</HeaderText>
                        {//<HeaderText active={this.state.activeHeader} onClick={(e) => this.headerClick(e.target)} id='archive'>Archive</HeaderText>
                        }
                    </Header>
                    {this.renderPage()}
                </MainContainer>
            </>
        );
    }
}