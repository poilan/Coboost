import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { useState } from 'react';
import { PageModal } from '../../Services/PageModal';
import { Input } from './Components/Input';
import { Group } from './Components/Group';
import { Column } from './Components/Column';
import { Collection, Task } from './Components/Task';
import { ResultBackground, ResultItem } from './Components/Results';
import { Ico_Text, Ico_MultipleChoice } from '../../Classes/Icons';

export class Tasks extends Component {
    state = {
        tasks: [],
        active: [],

        create: {
            type: '',
            title: '',
            options: [],
        },
    }

    eventSource = undefined;

    startEventSource = (target) => {
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

    createTask = () => {
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

    taskCreate = () => {
        handleType = (event) => {
            event.preventDefault();
            this.setState({
                create: {
                    type: this.refs.type.value,
                }
            });
        }

        handleTitle = (event) => {
            event.preventDefault();
            var create = this.state.create;
            create.title = this.refs.title.value;
            this.setState({
                create: create,
            });
        }

        handleOption = (event) => {
            const key = event.target.id;
            const value = event.target.value;

            const data = this.state.create;
            data.options[key].description = value;
            this.setState({
                create: data,
            });
        }

        createMultipleChoice = (event) => {
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

        createOpenText = () => {
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

        addOption = () => {
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

    taskClick = (event) => {
        if (event.target.id == this.state.question)
            return;

        this.loadTask(event);
    }

    loadTask = (event) => {
        let key = event.target.id;

        this.setState({
            active: key,
        });

        if (this.state.tasks[key].questionType !== -1) {
            this.startEventSource(key);
        }
    }

    renderActive() {
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
        else if (question !== undefined && question.questionType === 1) {
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
        else {
            return (
                <SelectedSlide>
                    <SlideTitle>Hello there</SlideTitle>
                    <SlideBody>To get started click "Create new Task" on the left</SlideBody>
                </SelectedSlide>
            );
        }
    }

    render() {
        return (
            <>
                <Collection createTask={this.createTask}>
                    {this.state.questions.map(question =>
                        <Task key={question.index} id={question.index}
                            onClick={this.taskClick} active={this.state.question == question.index}
                            type={question.questionType} title={question.title}
                        />
                    )}
                </Collection>
                <SlideContainer>
                    {this.renderActive()}
                </SlideContainer>
            </>
        );
    }
}