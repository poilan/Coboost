import React, { Component } from 'react';
import axios from './Tabs/node_modules/axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "./Tabs/node_modules/circular-std";
import { useState } from 'react';
import { PageModal } from '../Services/PageModal';
import { Input } from './Tabs/Components/Input';
import { Group } from './Tabs/Components/Group';
import { Column } from './Tabs/Components/Column';
import { Collection, Task } from './Tabs/Components/Tasks';
import { ResultBackground, ResultItem } from './Tabs/Components/Results';
import { Ico_Text, Ico_MultipleChoice } from '../Classes/Icons';

const MainContainer = styled.div`
    display: table;
    height: 100%;
    width: 100%;
    left: 0;
    background: #E4E4E4;
    position: absolute;
`;

const Banner = styled(Col)`
    position: fixed;
    background: #4C7AD3;
    height: 5vh;
    top: 0;
    left: 0;
    z-index: 11;
`;

const BannerArrow = styled.div`
    font-family: CircularStd;
    font-Size: 3vh;
    color: #fff;
    padding: .5vh 0;
    margin-left: 1vw;
    position: absolute;
    &:hover {
        cursor: pointer;
        margin-left: -.5vw;
    };
`;

const BannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 3vh;
    color: #fff;
    padding: 1vh 0;
    margin-left: 6vw;
    position: absolute;
`;

const BannerCode = styled(BannerText)`
    width: 40vw;
    left: 50vw;
    margin-left: -20vw;
    text-align: center;
`;

const BannerButton = styled(DropdownButton)`
    background: #fff;
    border-radius: 5vh;
    color: #100E0E;

    font-family: CircularStd;
    font-weight: 450;
    font-size: 1vh;
    width: 5vw;
    height: 3vh;
    text-align: center;
    padding-left: .5vw;
    padding-right: .5vw;
    top: 1vh;
    position: relative;
    float: right;

    margin: 0px 1vw;

    button {
        text-align:center;
        vertical-align: center;
        background: none;
        border: none;

        font-family: CircularStd;
        font-weight: 450;
        font-size: 1vh;

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

const BodyContainer = styled(Card)`
    position: absolute;
    top: 5vh;
    width: 100%;
    left: 0;
    height: 95vh;
    padding:0;
    background: #e4e4e4;
    min-height: calc(720px - 9vh);
`;

const CardHeader = styled(Card.Header)`
    width: 100%;
    background: #fff;
    height: 4vh;
    top: 0;
    position: absolute;
`;

const HeaderTabs = styled(Nav)`
    left: 5%;
    position: absolute;
    height: 100%;
    top: 0;
    .nav-link {
        width: 200px;
        min-width: 15vw;
        max-width: 33vw;
        text-align: center;
        top: 0;
        height: 100%;
        color: black;
        padding: 0.75vh;
        font-family: CircularStd;
        font-weight: 600;
        font-size: 2vh;

        &:hover {
            border: 0;
            background: #4C7AD3;
            padding-top: 1.25vh;
        }

        &.active {
            border: 0;
            opacity: 100%;
            color: black;
            border-bottom: .4vh solid #4C7AD3;
            cursor: default;
            background: #FFF;
            padding-top: 1.25vh;
        };
    };
`;

const CardBody = styled(Card.Body)`
    background: #E4E4E4;
    position: absolute;
    top: 4vh;
    width: 100%;
    min-height: 89vh;
    padding: 0;
`;

const SlidesOverview = styled.div`
    width: 20%;
    background: #fff;
    height: 95%;
    top: 2.5%;
    border-radius: 10px;
    display: inline-block;
    position: absolute;
    overflow: auto;
    left: 2.5%;
    padding: 0px 20px;

    scrollbar-width: thin;
    scrollbar-color: #4C7AD3 #fff;
`; //Scrollbar only affects firefox currently

const SlideCategory = styled.div`
    border-radius: 10px;
    border: ${props => props.type == "0" ? "2px solid #1a3ac1" : props.type == "1" ? "2px solid #18be0a" : "2px solid #100e0e"};
    color: ${props => props.type == "0" ? "#1a3ac1" : props.type == "1" ? "#18be0a" : "#100e0e"};
    background: ${props => props.type == "0" ? "#dce1f6" : props.type == "1" ? "#dcf5da" : "#e9e9e9"};
    margin-top: 20px;
    margin-right:  ${props => props.active ? "50px" : ""};
    position: relative;
    font-size: 1rem;
    font-family: CircularStd;
    font-weight: 600;
    padding: 10px;

    &:hover {
        cursor: pointer;
    };

`;

const NewSlide = styled(SlideCategory)`
    opacity: 50%;
    &:hover {
        opacity: 75%;
    };
`;

const SlideContainer = styled.div`
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    display: inline-block;
    position: absolute;
    left: 26%;
    width: 69%;
    max-width: calc(172vh - 225px);
`;

const SelectedSlide = styled.div`
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    background: #fff;
    border-radius: 10px;
`;

const SlideTitle = styled.h1`
    position: absolute;
    width: 80%;
    font-family: CircularStd;
    font-size: 2em;
    text-align: center;
    top: 25%;
    left: 10%;
`;

const SlideBody = styled.h3`
    position: absolute;
    left: 10%;
    top: 35%;
    width: 80%;
    text-align: center;
    font-family: CircularStd;
`;

const QuestionContainer = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
    padding: 50px;
    padding-bottom: 0;
    background: #E4E4E4;
    top: 0;
    left 0;
    margin-top: 25px;

    scrollbar-width: thin;
    scrollbar-color: #4C7AD3 #fff;
`;

const Overview = styled.h2`
    font-family: CircularStd;
    font-weight: 500;
    font-size: 1rem;
    margin: 1% 0;
    height: 35px;
    position: fixed;
    text-align: center;
    z-index: 11;
    top: 9.5vh;
    left: 2.5vw;

    &:hover {
        cursor: pointer;
        opacity: 75%;
    }
`;

const Question = styled.div`
    width: 100%;
    background: #fff;
    padding: 1.5% 2.5%;
    margin-bottom: 1%;
    border-radius: 10px;
    position: relative;
    font-family: CircularStd;
    font-weight: 420;
    border: 1px solid black;
    opacity: 90%;

    &:hover {
        cursor:pointer;
        opacity: 100%;
    }
`;

const NewQuestion = styled(Question)`
    opacity: 50%;
    &:hover {
        opacity: 80%;
    }
`;

const ModalDisplay = styled.div`
    display: ${props => props.show ? "block" : "none"};
`;

const NewButton = styled.button`
    border-radius: 10px;
    border: 0;
    font-family: CircularStd;
    font-size: 2em;
    position: absolute;
    height: 100%;
    padding: 0.5em;
    top: 0;
    right: 0;
    opacity: 50%;

    &:hover {
        cursor:pointer;
        opacity: 85%;
        background: #4C7AD3;
        color: #fff;
    }
`;

const NewType = styled.select`
    font-family: CircularStd;
    font-size: 1.5em;
    font:weight: 700;
    padding: .6em 1.4em .5em .8em;
    box-sizing: border-box;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
    border-radius: .5em;
    /*-moz-appearance: none;
    -webkit-appearance: none;*/
    appearance: none;
    background: #fff;

    margin: 60px;

    &::-ms-expand {
        display: none;
    }

    &:hover {
        border-color: #888;
    }

    &:focus {
        border-color: #aaa;
        box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
        box-shadow: 0 0 0 3px -moz-mac-focusring;
        outline: none;
    }
`;

const NewTitle = styled.input`
    font-family: CircularStd;
    font-size: 1em;
    font:weight: 700;
    padding: .6em 1.4em .5em .8em;
    box-sizing: border-box;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
    border-radius: .5em;
    /*-moz-appearance: none;
    -webkit-appearance: none;*/
    appearance: none;
    background: #fff;

    margin: 60px;

    &:hover {
        border-color: #888;
    }

    &:focus {
        border-color: #aaa;
        box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
        box-shadow: 0 0 0 3px -moz-mac-focusring;
        outline: none;
    }
`;

const NewOptionContainer = styled.div`
    display: inline-block;
    padding: 0.3em;
    width: 30%;
    height: 15%;
    text-align: left;

`;

const NewOptionNumber = styled.h2`
    opacity: 50%;
    font-family: CircularStd;
    font-size: 0.5em;
`;

const NewOption = styled.input`
    font-family: CircularStd;
    font-size: 0.8em;
    font:weight: 700;
    width: 100%;
    padding: .2em .5em .17em .26em;
    box-sizing: border-box;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;

    &:hover {
        border-color: #888;
    }

    &:focus {
        border-color: #aaa;
        box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
        box-shadow: 0 0 0 3px -moz-mac-focusring;
        outline: none;
    }
`;

const AddOption = styled.div`
    display: ${props => props.possible ? "inline-block" : "none"};
    opacity: 50%;
    width: 100%;
    font-family: CircularStd;
    font-size: 0.8em;
    font:weight: 700;
    padding: .2em .5em .17em .26em;
    box-sizing: border-box;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;

    &:hover {
        opacity: 75%;
        cursor:pointer;
    }
`;

const VoteOption = styled(AddOption)`
    display: inline-block;
    width: 30%;
    margin: 1.5%;
    opacity: 100%;
`;

const GroupTitle = styled.h1`
    color: #fff;
    font-style: CircularStd;
    font-weight: 600;
    font-size: 1em;
    opacity: 90%;
`;

const MemberCheckbox = styled.input`
    border-radius: 0.5em;
    height: 1.3em;
    width: 1.3em;
    border: 1px solid #aaa;
    box-sizing: border-box;
    background: #fff;
    vertical-align: middle;
    -webkit-appearance: none;
    outline: none;
    appearance: none;
    margin: 0 5%;

    &:checked {
        background: #4C7AD3;
    }

    &:hover {
        cursor: pointer;
    }
`;

const IDNumbers = styled.h1`
    display: inline-block;
    color: #fff;
    width: 2%;
    margin: 5px;
    padding: 10px 0;
    clear: left;
    float: left;
    font-family: CircularStd;
    font-Size: 1.25em;
    text-align: left;
    vertical-align: center;
    height: 44px;
    font-weight: 700;
`;

const NewGroup = styled.div`
    width: 100%;
    display: inline-block;
    background: #4C7AD3;
    padding: 1%;
    margin: .5% 1%;
    border-radius: 10px;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .12);
    vertical-align: top;
    position: relative;
    opacity: 50%;

    &:hover {
        opacity: 95%;
        cursor:pointer;
    }
`;

const NewInput = styled(Nav.Link)`
    color: #fff;
    background: #4C7AD3;
    position: fixed;
    display: inline-block;
    right: 5%;
    top: 9.5vh;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
`;

const NewMultipleChoice = styled(NewInput)`
    right: calc(6% + 200px);
`;

const MergeButton = styled(NewMultipleChoice)`
    right: calc(7% + 400px);
`;

const CancelButton = styled(Nav.Link)`
    color: #100e0e;
    background: #fff;
    position: relative;
    display: inline-block;
    left: 0;
    top: 0;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
`;

const CreateButton = styled.input`
    color: #fff;
    background: #4C7AD3;
    position: relative;
    display: inline-block;
    left: 0;
    top: 0;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
`;

const Cheat = styled.div`
    color: #4C7AD3;
    display: block;
    width: 100%;
    clear: both;
`;

const OrganizingArrow = styled(BannerArrow)`
    position: relative;
    color: #100e0e;
    display: inline;
    font-family: CircularStd;
    font-weight: 500;
    font-size: 2rem;
    margin: 1% 0;
    padding: 0;
`;

export class Session extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            code: 0,
            questions: [],
            question: -1,
            organizing: false,
            columns: [],
            selected: [],

            tab: 'task',

            create: {
                type: '',
                title: '',
                options: [],
            },

            modalInput: false,
            modalRename: false,
            modalRenameKey: [],
            modalCreate: false,
            modalCreateNumber: "-1",

            screenWindow: null,
        }
        this.eventSource = undefined;
        this.backToProjects = this.backToProjects.bind(this);
        this.createQuestion = this.createTask.bind(this);
        this.logout = this.logout.bind(this);
        this.present = this.present.bind(this);
    }

    componentWillMount() {
        var code = sessionStorage.getItem("code");
        var title = sessionStorage.getItem("title");
        this.state.code = code;
        this.state.title = title;
        this.addColumn();
        this.getQuestions();
    }

    componentWillUnmount() {
        if (this.eventSource)
            this.eventSource.close();
    }

    startEventSource(target) {
        const code = sessionStorage.getItem("code");

        if (this.eventSource !== undefined)
            this.eventSource.close();

        this.eventSource = new EventSource(`admin/${code}/stream-question-${target}`);

        this.eventSource.addEventListener("Groups", (e) => {
            try {
                var data = JSON.parse(e.data);
                var questions = this.state.questions;
                questions[this.state.question].groups = data;
                let columns = this.state.columns;
                this.state.columns = [];
                if (questions[this.state.question].groups !== undefined) {
                    for (let i = 0; i < questions[this.state.question].groups.length; i++) {
                        while (questions[this.state.question].groups[i].Column + 1 >= this.state.columns.length) {
                            this.addColumn();
                        }
                    }
                }

                for (let i = 0; i < this.state.columns.length; i++) {
                    if (columns[i] !== undefined) {
                        this.state.columns[i].width = columns[i].width;
                    }
                    else {
                        break;
                    }
                }

                this.setState({
                    questions: questions,
                })
            } catch (e) {
                console.log("Failed to parse server event: " + e.data);
                console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("Options", (e) => {
            try {
                var data = JSON.parse(e.data);
                var questions = this.state.questions;
                questions[this.state.question].options = data;
                if (questions[this.state.question].options !== undefined) {
                    questions[this.state.question].options.sort((a, b) => (a.Votes.length > b.Votes.length) ? -1 : 1);
                }
                this.setState({
                    questions: questions,
                })
            } catch (e) {
                console.log("Failed to parse server event: " + e.data);
                console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("Total", (e) => {
            try {
                var data = JSON.parse(e.data);
                var questions = this.state.questions;
                questions[this.state.question].TotalVotes = data;
                this.setState({
                    questions: questions,
                })
            } catch (e) {
                console.log("Failed to parse server event: " + e.data);
                console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("Archive", (e) => {
            try {
                var data = JSON.parse(e.data);
                var questions = this.state.questions;
                questions[this.state.question].archive = data;
                this.setState({
                    questions: questions,
                })
            } catch (e) {
                console.log("Failed to parse server event: " + e.data);
                console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("error", (e) => {
            if (e.eventPhase == EventSource.CLOSED) {
                //Connection was closed.
                console.log("SSE: connection closed");
            } else {
                console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("open", function (e) {
            console.log("SSE: connection opened");
            // Connection was opened.
        }, false);
    }

    async getQuestions() {
        const code = this.state.code;
        await axios.get(`admin/${code}/questions-all`).then(res => {
            if (res.status === 202) {
                this.setState({ questions: res.data });
            } else if (res.status === 404) {
                //session not found
            }
        })
    }

    async getQuestion(key) {
        let code = sessionStorage.getItem("code");

        await axios.get(`admin/${code}/question-${key}`).then(res => {
            if (res.status === 202) {
                var questions = this.state.questions;
                questions[key] = res.data;
                console.log(res.data);
                this.setState({
                    questions: questions,
                })
            }
        });
    }

    selectTab(key) {
        this.setState({
            tab: key,
        });
    }

    old_tabTasks() {
        return (
            <>
                <SlidesOverview>
                    {this.state.questions.map(question =>
                        <SlideCategory key={question.index} id={question.index} onClick={this.taskClick.bind(this)} active={this.state.question == question.index} type={question.questionType}>{(question.index + 1) + '. ' + question.title} | {question.questionType == 1 ? "Vote: Multiple Choice" : question.questionType == 0 ? "Input: Standard" : "Creating Task"}</SlideCategory>)
                    }
                    <NewSlide onClick={this.createTask.bind(this)}>➕ Create new task</NewSlide>
                </SlidesOverview>
                <SlideContainer>
                    {this.activeTask()}
                </SlideContainer>
            </>
        );
    }

    tabTasks() {
        return (
            <>
                <Collection createTask={this.createTask.bind(this)}>
                    {this.state.questions.map(question =>
                        <Task key={question.index} id={question.index}
                            onClick={this.taskClick.bind(this)} active={this.state.question == question.index}
                            type={question.questionType} title={question.title}
                        />
                    )}
                </Collection>
                <SlideContainer>
                    {this.activeTask()}
                </SlideContainer>
            </>
        );
    }

    tabOrganize() {
        if (this.state.organizing) {
            const question = this.state.questions[this.state.question];
            if (question.questionType == 0) { //Open Text
                return this.organizeOpenText(question);
            }
            else if (question.questionType == 1) { //Multiple Choice
                return this.organizeMultipleChoice(question);
            }
        } else { //Display all tasks
            return (
                <>
                    <QuestionContainer>
                        <Overview>Overview</Overview>
                        {this.state.questions.map(question =>
                            <Question id={question.index} onClick={this.openTask.bind(this)}>{question.index + 1}. {question.title}</Question>)}
                        <NewQuestion onClick={this.createTask.bind(this)}>➕ Create new task </NewQuestion>
                    </QuestionContainer>
                </>
            );
        }
    }

    activeTask() {
        if (this.state.question == -1) {
            return (
                <SelectedSlide>
                    <SlideTitle>Hello there</SlideTitle>
                    <SlideBody>To get started click "Create new Task" on the left</SlideBody>
                </SelectedSlide>
            );
        }

        var question = this.state.questions[this.state.question];

        if (question !== undefined && question.questionType === -1) {
            return this.taskCreate();
        }
        else if (question !== undefined && question.questionType === 0) {
            return this.taskOpenText(question);
        }
        else if (question !== undefined && question.questionType === 1) {
            return this.taskMultipleChoice(question);
        }
        else {
            return (
                <SelectedSlide>
                    <SlideTitle>Hello there</SlideTitle>
                    <SlideBody>To get started click "Create new Task" on the left</SlideBody>
                </SelectedSlide>
            );
        }
    }

    taskClick(event) {
        this.setState({
            organizing: false,
        });

        if (event.target.id == this.state.question)
            return;

        this.loadTask(event);
    }

    loadTask(event) {
        let key = event.target.id;

        this.setState({
            question: key,
            selected: [],
        });

        if (this.state.questions[key].questionType !== -1) {
            this.startEventSource(key);
        }
    }

    openTask(event) {
        this.setState({
            organizing: true,
        });

        if (event.target.id == this.state.question)
            return;

        this.loadTask(event);
    }

    taskCreate() {
        if (!this.state.create.type) {
            return (
                <SelectedSlide>
                    <SlideTitle>What type of slide is this?</SlideTitle>
                    <SlideBody>
                        <Form id="type-form" onSubmit={this.handleType.bind(this)}>
                            <NewType placeholder='Select type...' ref='type' name='type' required>
                                <option value="" disabled>Select type...</option>
                                <option value='0'>Open Text</option>
                                <option value='1'>Multiple Choice</option>
                            </NewType>
                        </Form>
                    </SlideBody>
                    <NewButton form="type-form" type='submit'>🠊</NewButton>
                </SelectedSlide>
            );
        }
        else if (!this.state.create.title) {
            return (
                <SelectedSlide>
                    <SlideTitle>What is the question do you want answered?</SlideTitle>
                    <SlideBody>
                        <Form id="title-form" onSubmit={this.handleTitle.bind(this)}>
                            <NewTitle autoComplete="off" placeholder='Title...' ref='title' name='title' required />
                        </Form>
                    </SlideBody>
                    <NewButton form="title-form" type='submit'>🠊</NewButton>
                </SelectedSlide>
            );
        }
        else {
            var isOpenText = (this.state.create.type == 0);
            var canAdd = (this.state.create.options == undefined || this.state.create.options !== undefined && this.state.create.options.length < 15);
            console.log(canAdd);
            return (
                <SelectedSlide>
                    {isOpenText ? this.createOpenText() : ""}
                    <SlideTitle>{isOpenText ? "Creating your slide..." : "Select options"}</SlideTitle>
                    <SlideBody display={isOpenText ? "none" : "block"}>
                        <Form id="options-form" onSubmit={this.createMultipleChoice.bind(this)}>
                            {this.state.create.options !== undefined && this.state.create.options.map(option =>
                                <NewOptionContainer index={option.index}>
                                    <NewOptionNumber>{"Option " + (option.index + 1)}</NewOptionNumber>
                                    <NewOption id={option.index} name={"Option " + option.index} value={option.description} onChange={this.handleOption.bind(this)} required />
                                </NewOptionContainer>
                            )}
                            <NewOptionContainer>
                                <AddOption possible={canAdd} onClick={this.addOption.bind(this)}>➕ Add option...</AddOption>
                            </NewOptionContainer>
                        </Form>
                    </SlideBody>
                    <NewButton form="options-form" type='submit'>🠊</NewButton>
                </SelectedSlide>
            );
        }
    }

    handleType(event) {
        event.preventDefault();
        this.setState({
            create: {
                type: this.refs.type.value,
            }
        });
    }

    handleTitle(event) {
        event.preventDefault();
        var create = this.state.create;
        create.title = this.refs.title.value;
        this.setState({
            create: create,
        });
    }

    handleOption(event) {
        const key = event.target.id;
        const value = event.target.value;

        const data = this.state.create;
        data.options[key].description = value;
        this.setState({
            create: data,
        });
    }

    addOption() {
        var count = this.state.create.options !== undefined ? this.state.create.options.length : 0;
        var user = localStorage.getItem("user");

        var option =
        {
            userID: user,
            index: count,
            description: "",
            votes: [],
            archive: [],
        }

        var create = this.state.create;
        count > 0 ? create.options.push(option) : create.options = [option];
        this.setState({
            create: create,
        });
    }

    taskOpenText(question) {
        return (
            <SelectedSlide>
                <SlideTitle>{question.title}</SlideTitle>
                <SlideBody>{question.groups !== undefined && question.groups.slice(1).map(group =>
                    group.Members !== undefined && group.Members.map(member =>
                        <VoteOption key={member.Index}>{member.Title}</VoteOption>
                    )
                )}</SlideBody>
            </SelectedSlide>
        );
    }

    taskMultipleChoice(question) {
        return (
            <SelectedSlide>
                <SlideTitle>{question.title}</SlideTitle>
                <SlideBody>
                    {question.options !== undefined && question.options.map(option =>
                        <>
                            <VoteOption id={option.Index} index={option.Index} name={"Option " + option.Index}>{option.Description} {option.Votes.length !== 0 && " (" + Math.floor((option.Votes.length / question.TotalVotes) * 100) + "%)"}</VoteOption>
                        </>
                    )}
                </SlideBody>
            </SelectedSlide>
        );
    }

    createTask() {
        this.selectTab('task');

        const questions = this.state.questions;
        var count = questions.length;

        var question = {
            questionType: -1,
            title: 'New Task',
            index: count,
        };

        this.setState({
            questions: questions.concat(question),
            question: count,
        });
    }

    createOpenText() {
        const code = sessionStorage.getItem('code');
        var data = {
            Title: this.state.create.title,
        }

        axios.post(`admin/${code}/questions-create-opentext`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 201) {
                this.getQuestions().then(() => { this.startEventSource(this.state.question) });
                this.setState({
                    create: {
                        type: '',
                        title: '',
                        options: [],
                    }
                });
            }
        });
    }

    createGroup() {
        const code = sessionStorage.getItem("code");
        axios.post(`admin/${code}/question-create-group-C${this.state.columns.length - 1}`);
    }

    createMultipleChoice(event) {
        event.preventDefault();
        let code = sessionStorage.getItem("code");

        let data = {
            Title: this.state.create.title,
            Options: this.state.create.options,
        }

        axios.post(`admin/${code}/questions-create-multiplechoice`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 201) {
                this.getQuestions().then(() => { this.startEventSource(this.state.question) });
                this.setState({
                    create: {
                        type: '',
                        title: '',
                        options: [],
                    }
                });
            }
        })
    }

    old_organizeOpenText(question) {
        return (
            <QuestionContainer>
                {this.state.modalInput && <PageModal title="Send Input" body={this.modalInputContent()} onClose={this.modalInputClose.bind(this)} />}
                {this.state.modalRename && <PageModal title="Rename" body={this.modalRenameContent()} onClose={this.modalRenameClose.bind(this)} />}
                <Overview><OrganizingArrow onClick={this.backtoOverview.bind(this)}>⟵</OrganizingArrow>Organizing/{this.state.title.replace(" ", "-")}/{question.title.replace(" ", "-")}</Overview>

                <NewInput onClick={this.modalInputOpen.bind(this)}>New Input</NewInput>
                <NewMultipleChoice onClick={this.organizeCreateVote.bind(this)}>New Multiple Choice</NewMultipleChoice>
                <MergeButton onClick={this.organizeMerge.bind(this)}>Merge</MergeButton>

                {question.groups !== undefined && question.groups[0].size == undefined ? question.groups[0].size = 3 : ""}
                <Group title={question.groups !== undefined ? question.groups[0].Title : ""} shrink={(e) => this.shrink(e)} grow={(e) => this.grow(e)} size={question.groups !== undefined && question.groups[0].size} empty={!(question.groups !== undefined && question.groups[0].Members !== undefined && question.groups[0].Members.length > 0)} index={0} id="0">
                    {question.groups !== undefined && question.groups[0].Members !== undefined && question.groups[0].Members.map(member =>
                        <>
                            {member.Index % question.groups[0].size == 0 && <IDNumbers id="0">{(member.Index / question.groups[0].size) + 1}</IDNumbers>}
                            <Input size={question.groups !== undefined && question.groups[0].size} double={this.modalRenameOpen.bind(this)} index={member.Index} id={"0-" + member.Index}>
                                <MemberCheckbox checked={this.state.selected.indexOf("0-" + member.Index) !== -1} onChange={this.organizeSelect.bind(this)} type="checkbox" id={"0-" + member.Index} />
                                {member.Title}
                            </Input>
                        </>
                    )}
                    <Cheat>.</Cheat>
                </Group>

                {question.groups !== undefined && question.groups.slice(1).map(group =>
                    <>
                        {group.size == undefined ? group.size = 1 : ""}
                        <Group title={group.Title} shrink={(e) => this.shrink(e)} grow={(e) => this.grow(e)} double={this.modalRenameOpen.bind(this)} size={group.size} index={group.Index} id={group.Index} key={group.Index}>

                            {group.Members !== undefined && group.Members.map(member =>
                                <>
                                    {member.Index % group.size == 0 && <IDNumbers id={group.Index}>{(member.Index / group.size) + 1}</IDNumbers>}
                                    <Input size={group.size} double={this.modalRenameOpen.bind(this)} key={member.Index} organized id={group.Index + "-" + member.Index}>
                                        <MemberCheckbox checked={this.state.selected.indexOf(group.Index + "-" + member.Index) !== -1} onChange={this.organizeSelect.bind(this)} type="checkbox" id={group.Index + "-" + member.Index} />
                                        {member.Title}
                                    </Input>
                                </>
                            )}
                        </Group>
                    </>
                )}
                <NewGroup size={1} onClick={this.createGroup.bind(this)} id="create">
                    <GroupTitle>➕ Create Group</GroupTitle>
                </NewGroup>

            </QuestionContainer>
        );
    }

    organizeOpenText(question) {
        return (
            <QuestionContainer>
                {this.state.modalInput && <PageModal title="Send Input" body={this.modalInputContent()} onClose={this.modalInputClose.bind(this)} />}
                {this.state.modalRename && <PageModal title="Rename" body={this.modalRenameContent()} onClose={this.modalRenameClose.bind(this)} />}
                <Overview onClick={this.backtoOverview.bind(this)}>{this.state.title} &#187; Organizing &#187;   {question.title}</Overview>

                <NewInput onClick={this.modalInputOpen.bind(this)}>New Input</NewInput>
                <NewMultipleChoice onClick={this.organizeCreateVote.bind(this)}>Send to voting</NewMultipleChoice>
                <MergeButton onClick={this.organizeMerge.bind(this)}>Merge</MergeButton>

                {this.state.columns !== undefined && this.state.columns.map(column =>

                    <Column column={column.index} width={column.width} empty={column.index + 1 == this.state.columns.length}
                        grow={() => this.grow(column.index)}
                        shrink={() => this.shrink(column.index)}>
                        {question.groups !== undefined &&
                            question.groups.map(group => {
                                if (column.index === group.Column) {
                                    return (
                                        <Group id={group.Index} key={group.Index}
                                            group={group.Index} column={group.Column} title={group.Title} size={column.width}
                                            double={this.modalRenameOpen.bind(this)}>

                                            {group.Members !== undefined &&
                                                group.Members.map(member =>

                                                    <Input id={group.Index + "-" + member.Index} key={member.Index}
                                                        member={member.Index} group={group.Index} column={group.Column} title={member.Title} size={column.width}
                                                        double={this.modalRenameOpen.bind(this)}
                                                        checked={this.state.selected.indexOf(group.Index + "-" + member.Index) !== -1}
                                                        onCheck={this.organizeSelect.bind(this)}
                                                    />

                                                )}
                                        </Group>
                                    );
                                }
                            }
                            )}

                        {column.index + 1 == this.state.columns.length &&
                            <Group id="new"
                                group="new" column={column.index} title="➕ Create Group" size={column.width}
                                onClick={this.createGroup.bind(this)} />
                        }
                    </Column>

                )}
            </QuestionContainer>
        );
    }

    addColumn() {
        let column = {
            index: this.state.columns.length,
            width: 1,
        }

        let columns = this.state.columns;

        columns !== undefined ? columns.push(column) : columns = [column];
        this.setState({
            columns: columns,
        });
    }

    shrink(key) {
        let Columns = this.state.columns;

        if (Columns[key] !== undefined) {
            Columns[key].width !== undefined ? Columns[key].width -= 1 : Columns[key].width = 1;
        }

        this.setState({
            columns: Columns,
        });
    }

    grow(key) {
        let Columns = this.state.columns;

        if (Columns[key] !== undefined) {
            Columns[key].width !== undefined ? Columns[key].width += 1 : Columns[key].width = 1;
        }

        this.setState({
            columns: Columns,
        });
    }

    old_organizeMultipleChoice(question) {
        console.log(question.options)
        return (
            <QuestionContainer>
                <NewMultipleChoice onClick={() => this.organizeCreateInput(question)}>New Input</NewMultipleChoice>
                {question.options !== undefined && question.options.map(option =>
                    <Input percentage={((option.Votes.length / question.TotalVotes) * 100)} organized vote size="1"
                        id={option.Index} index={option.Index} title={option.Title}
                        checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                        onCheck={this.organizeSelect.bind(this)}
                    />
                )}
            </QuestionContainer>
        );
    }

    organizeMultipleChoice(question) {
        return (
            <QuestionContainer>
                <NewMultipleChoice onClick={() => this.organizeCreateInput(question)}>New Input: Text</NewMultipleChoice>
                <ResultBackground style={{ width: "95%", height: "70%" }} />
                {question.options !== undefined && question.options.map(option =>
                    <ResultItem id={option.Index} id={option.Index} index={option.Index} title={option.Title}
                        vote percentage={((option.Votes.length / question.TotalVotes) * 100)} height="70%" total={question.options.length}
                        checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                        onCheck={this.organizeSelect.bind(this)}
                    />
                )}
            </QuestionContainer>
        );
    }

    organizeSelect(event) {
        const key = event.target.id;

        if (this.state.selected.indexOf(key) == -1) {
            let selected = this.state.selected;
            selected !== undefined ? selected.push(key) : selected = [key];
            this.setState({
                selected: selected,
            });
        }
        else {
            var selected = this.state.selected;
            var index = selected.indexOf(key);
            selected.splice(index, 1);
            this.setState({
                selected: selected,
            })
        }
        console.log(this.state.selected);
    }

    organizeMerge() {
        console.log("Merging started...")
        if (this.state.selected == undefined || this.state.selected.length <= 1)
            return;

        const code = sessionStorage.getItem("code");
        const master = this.state.selected[0].split("-");
        let change = [];

        for (var i = 1; i < this.state.selected.length; i++) {
            var subject = this.state.selected[i].split("-");

            if (change[subject[0]] !== undefined && change[subject[0]] > 0) {
                subject[1] -= change[subject[0]];
            }

            axios.post(`admin/${code}/question-merge${master[0]}-${master[1]}with${subject[0]}-${subject[1]}`);

            if (change[subject[0]] == undefined) {
                change[subject[0]] = 1;
            } else {
                change[subject[0]] -= 1;
            }
        }

        this.setState({
            selected: [],
        })
    }

    organizeRemove() {
    }

    modalCreateOpen() {
        this.setState({
            modalCreate: true,
            modalCreateNumber: "-1",
        })
    }

    modalCreateContent() {
        const onType = e => {
            let number = e;

            this.setState({
                modalCreateNumber: number,
            })

            console.log(this.state.modalCreateNumber);
            console.log(number);
            console.log(e);
        }
        const Type = e => {
            return (
                <ModalDisplay show={this.state.modalCreateNumber == -1}>
                    <div id="0" onClick={() => onType("0")} style={{ height: "75px", display: "inline-block", width: "75px" }}>
                        <Ico_Text />
                    </div>
                    <div id="1" onClick={() => onType("1")} style={{ height: "75px", display: "inline-block", width: "75px" }}>
                        <Ico_MultipleChoice />
                    </div>
                </ModalDisplay>
            );
        }

        const Text = e => {
            return (
                <ModalDisplay show={this.state.modalCreateNumber == 0}>
                    <Form autoComplete="off">
                        <NewOptionNumber>Title</NewOptionNumber>
                        <Form.Group controlId="validateTitle">
                            <InputGroup>
                                <Form.Control name="title" ref="title" placeholder="Task Title.." required />
                            </InputGroup>
                        </Form.Group>
                        <CancelButton onClick={this.modalCreateClose.bind(this)}>Cancel</CancelButton>
                        <CreateButton type="submit" value="Submit" />
                    </Form>
                </ModalDisplay>
            );
        }
        const Choice = e => {
            let options = [];
            return (
                <ModalDisplay show={this.state.modalCreateNumber == 1}>
                    <Form autoComplete="off">
                        <NewOptionNumber>Title</NewOptionNumber>
                        <Form.Group controlId="validateTitle">
                            <InputGroup>
                                <Form.Control name="title" ref="title" placeholder="Task Title.." required />
                            </InputGroup>
                        </Form.Group>
                        {options.map(option =>
                            <Form.Group controlId={"validateOption" + option.Index}>
                                <InputGroup>
                                    <Form.Control name={"option" + option.Index} ref={"option" + option.Index} placeholder={"option" + option.Index + " title..."} required />
                                </InputGroup>
                            </Form.Group>
                        )}
                        <Form.Group />
                        <CancelButton onClick={this.modalCreateClose.bind(this)}>Cancel</CancelButton>
                        <CreateButton type="submit" value="Submit" />
                    </Form>
                </ModalDisplay>
            );
        }

        return (

            <>
                {Type()}
                {Text()}
                {Choice()}
            </>
        );
    }

    modalCreateClose() {
        this.setState({
            modalCreate: false,
        })
    }

    modalRenameOpen(event) {
        const key = event.target.id.split("-");
        console.log(key);

        this.setState({
            modalRename: true,
            modalRenameKey: key,
        });
    }

    modalRenameContent() {
        const rename = (e) => {
            e.preventDefault();
            const code = sessionStorage.getItem("code");
            const key = this.state.modalRenameKey;
            const title = {
                Title: this.state.create.title,
            }

            this.modalRenameClose();
            console.log(key);
            if (key.indexOf("title") !== -1) {
                axios.post(`admin/${code}/question-rename-group-${key[0]}`, title);
            } else {
                axios.post(`admin/${code}/question-rename-member-${key[0]}-${key[1]}`, title);
            }
        }

        return (
            <Form autoComplete="off" onSubmit={rename.bind(this)}>
                <NewOptionNumber>Title</NewOptionNumber>
                <Form.Group controlId="validateTitle">
                    <InputGroup>
                        <Form.Control name="title" ref="title" onChange={this.handleTitle.bind(this)} autoFocus={true} placeholder="Input Title.." required />
                    </InputGroup>
                </Form.Group>
                <CancelButton onClick={this.modalRenameClose.bind(this)}>Cancel</CancelButton>
                <CreateButton type="submit" value="Submit" />
            </Form>
        );
    }

    modalRenameClose() {
        this.setState({
            modalRename: false,
            modalRenameKey: [],
            create: {
                title: '',
            }
        });
    }

    organizeCreateVote() {
        var options = [];
        var question = this.state.questions[this.state.question];
        for (var i = 0; i < this.state.selected.length; i++) {
            var key = this.state.selected[i].split("-");
            var input = question.groups[key[0]].Members[key[1]];
            var data = {
                userID: input.UserID,
                index: options.length,
                description: input.Description,
                votes: [],
                archive: [],
            }
            options.push(data);
        }
        console.log(options);
        const create = this.state.create;
        create.type = 1;
        create.options = options;
        this.setState({
            create: create,
            organizing: false,
            selected: [],
        });
        this.createTask();
    }

    organizeCreateInput(question) {
        const code = sessionStorage.getItem('code');
        console.log(question);
        console.log(this.state.selected)
        if (question.options !== undefined) {
            for (let i = 0; i < this.state.selected.length; i++) {
                var data = {
                    Title: "Discuss: " + question.options[this.state.selected[i]].Description,
                }

                axios.post(`admin/${code}/questions-create-opentext`, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(res => {
                    if (res.status === 201 && i == this.state.selected.length - 1) {
                        this.getQuestions();
                        this.setState({
                            selected: [],
                        });
                        this.selectTab('task');
                        this.backtoOverview();
                    }
                });;
            }
        }
    }

    modalInputOpen() {
        this.setState({
            modalInput: true,
        })
    }

    modalInputContent() {
        const sendInput = (e) => {
            e.preventDefault();
            const title = this.state.create.title;
            const user = localStorage.getItem("user");
            const code = sessionStorage.getItem("code");

            this.modalInputClose();

            let data = {
                description: title,
                userID: user,
            }

            axios.post(`client/${code}/add-opentext`, data);
        }

        return (
            <Form autoComplete="off" onSubmit={sendInput.bind(this)}>
                <NewOptionNumber>Title</NewOptionNumber>
                <Form.Group controlId="validateTitle">
                    <InputGroup>
                        <Form.Control name="title" ref="title" onChange={this.handleTitle.bind(this)} tabIndex autoFocus="true" placeholder="Input Title.." required />
                    </InputGroup>
                </Form.Group>
                <CancelButton onClick={this.modalInputClose.bind(this)}>Cancel</CancelButton>
                <CreateButton type="submit" value="Submit" />
            </Form>
        );
    }

    modalInputClose() {
        this.setState({
            modalInput: false,
            create: {
                type: '',
                title: '',
                options: [],
            },
        })
    }

    backtoOverview() {
        this.setState({
            organizing: false,
        });
    }

    backToProjects() {
        this.props.history.go(-1);
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
    }

    present() {
        var state = this.state;
        var code = sessionStorage.getItem("code");
        sessionStorage.setItem("present_code", code);

        var existing = window.open('', "Storskjerm");
        existing.close();

        var popup = window.open("/screen", "Storskjerm", "height=768,width=1024");

        this.setState({
            screenWindow: popup,
        })
    }

    render() {
        return (
            <MainContainer>
                <Banner>
                    <BannerArrow onClick={this.backToProjects}>⟵</BannerArrow>
                    <BannerText>{this.state.title}</BannerText>
                    <BannerCode>{"#" + this.state.code.substr(0, 3) + " " + this.state.code.substr(3, 3)}</BannerCode>

                    <BannerButton title="User">
                        <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                    </BannerButton>

                    <BannerButton title="Presentation">
                        <Dropdown.Item disabled="true">Presentation mode</Dropdown.Item>
                        <Dropdown.Item onClick={this.present}>Present in a new window</Dropdown.Item>
                        <Dropdown.Item disabled="true">Mirror Screen</Dropdown.Item>
                        <Dropdown.Item disabled="true">Get Presentation Link</Dropdown.Item>
                    </BannerButton>
                </Banner>
                <BodyContainer>
                    <Tab.Container activeKey={this.state.tab} onSelect={(k) => this.selectTab(k)}>
                        <CardHeader>
                            <HeaderTabs variant="tabs">
                                <Nav.Link eventKey="task">Tasks</Nav.Link>
                                <Nav.Link eventKey="organize">Organize</Nav.Link>
                            </HeaderTabs>
                        </CardHeader>
                        <CardBody>
                            <Tab.Content>
                                <Tab.Pane eventKey="task">
                                    {this.tabTasks()}
                                </Tab.Pane>
                                <Tab.Pane eventKey="organize">
                                    {this.tabOrganize()}
                                </Tab.Pane>
                            </Tab.Content>
                        </CardBody>
                    </Tab.Container>
                </BodyContainer>
            </MainContainer>
        );
    }
}