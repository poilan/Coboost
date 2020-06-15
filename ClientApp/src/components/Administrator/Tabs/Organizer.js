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

const MainContainer = styled.div`
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

const TitleBreadCrumb = styled.h2`
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

const AnswerButton = styled(Nav.Link)`
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

const SendToMC = styled(AnswerButton)`
    right: calc(6% + 200px);
`;

const SendToT = styled(SendToMC)`
`;

const MergeButton = styled(AnswerButton)`
    right: calc(7% + 400px);
`;

export class Organizer extends Component {
    state = {
        tasks: [],
        overview: true,
        active: 0,
        columns: [],
        selected: [],

        modal = {
            string: '',
            key: '',
            answer: false,
            rename: false,
        }
    }

    eventSource = undefined;

    componentWillMount() {
        this.addColumn();
        this.getTasks();
    }

    componentWillUnmount() {
        if (this.eventSource)
            this.eventSource.close();
    }

    getTasks = () => {
        const code = this.state.code;
        await axios.get(`admin/${code}/questions-all`).then(res => {
            if (res.status === 202) {
                this.setState({ tasks: res.data });
            } else if (res.status === 404) {
                //session not found
            }
        })
    }

    addColumn = () => {
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

    clickTask = (event) => {
        this.setState({
            overview: false,
        });

        if (event.target.id == this.state.question)
            return;

        this.loadTask(event);
    }

    loadTask = (event) => {
        let key = event.target.id;

        this.setState({
            active: key,
            selected: [],
        });

        if (this.state.questions[key].questionType !== -1) {
            this.startEventSource(key);
        }
    }

    renderText(task) {
        shrink = (key) => {
            let Columns = this.state.columns;

            if (Columns[key] !== undefined) {
                Columns[key].width !== undefined ? Columns[key].width -= 1 : Columns[key].width = 1;
            }

            this.setState({
                columns: Columns,
            });
        }

        grow = (key) => {
            let Columns = this.state.columns;

            if (Columns[key] !== undefined) {
                Columns[key].width !== undefined ? Columns[key].width += 1 : Columns[key].width = 1;
            }

            this.setState({
                columns: Columns,
            });
        }

        createGroup = () => {
            const code = sessionStorage.getItem("code");
            axios.post(`admin/${code}/question-create-group-C${this.state.columns.length - 1}`);
        }

        select = (event) => {
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

        sendToVote = () => {
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

        merge = () => {
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

        modalAnswerOpen = () => {
            this.setState({
                modal: {
                    answer: true,
                }
            })
        }

        modalAnswerContent = () => {
            const sendInput = (e) => {
                e.preventDefault();
                const title = this.state.create.title;
                const user = localStorage.getItem("user");
                const code = sessionStorage.getItem("code");

                modalAnswerClose();

                let data = {
                    description: title,
                    userID: user,
                }

                axios.post(`client/${code}/add-opentext`, data);
            }

            handleTitle = (event) => {
                event.preventDefault();
                var modal = this.state.modal;
                modal.string = this.refs.title.value;
                this.setState({
                    modal: modal,
                });
            }

            return (
                <Form autoComplete="off" onSubmit={sendInput.bind(this)}>
                    <NewOptionNumber>Title</NewOptionNumber>
                    <Form.Group controlId="validateTitle">
                        <InputGroup>
                            <Form.Control name="title" ref="title" onChange={handleTitle.bind(this)} tabIndex autoFocus="true" placeholder="Input Title.." required />
                        </InputGroup>
                    </Form.Group>
                    <CancelButton onClick={this.modalAnswerClose.bind(this)}>Cancel</CancelButton>
                    <CreateButton type="submit" value="Submit" />
                </Form>
            );
        }

        modalAnswerClose = () => {
            this.setState({
                modal: {
                    string: '',
                    answer: true,
                }
            })
        }

        modalRenameOpen = (event) => {
            const key = event.target.id.split("-");
            console.log(key);

            this.setState({
                modalRename: true,
                modalRenameKey: key,
            });
        }

        modalRenameContent = () => {
            const rename = (e) => {
                e.preventDefault();
                const code = sessionStorage.getItem("code");
                const key = this.state.modal.key;
                const title = {
                    Title: this.state.modal.string,
                }

                modalRenameClose();
                if (key.indexOf("title") !== -1) {
                    axios.post(`admin/${code}/question-rename-group-${key[0]}`, title);
                } else {
                    axios.post(`admin/${code}/question-rename-member-${key[0]}-${key[1]}`, title);
                }
            }

            handleTitle = (event) => {
                event.preventDefault();
                var modal = this.state.modal;
                modal.string = this.refs.title.value;
                this.setState({
                    modal: modal,
                });
            }

            return (
                <Form autoComplete="off" onSubmit={rename.bind(this)}>
                    <NewOptionNumber>Title</NewOptionNumber>
                    <Form.Group controlId="validateTitle">
                        <InputGroup>
                            <Form.Control name="title" ref="title" onChange={handleTitle.bind(this)} autoFocus={true} placeholder="Input Title.." required />
                        </InputGroup>
                    </Form.Group>
                    <CancelButton onClick={modalRenameClose.bind(this)}>Cancel</CancelButton>
                    <CreateButton type="submit" value="Submit" />
                </Form>
            );
        }

        modalRenameClose = () => {
            this.setState({
                modal: {
                    rename: false,
                    key: [],
                    string: '',
                }
            });
        }

        return (
            <MainContainer>
                {this.state.modalInput && <PageModal title="Send Input" body={this.modalInputContent()} onClose={this.modalInputClose.bind(this)} />}
                {this.state.modalRename && <PageModal title="Rename" body={this.modalRenameContent()} onClose={this.modalRenameClose.bind(this)} />}
                <TitleBreadCrumb onClick={this.backtoOverview.bind(this)}>{this.state.title} &#187; Organizing &#187;   {task.title}</TitleBreadCrumb>

                <AnswerButton onClick={this.modalInputOpen.bind(this)}>Answer Task</AnswerButton>
                <SendToMC onClick={sendToVote()}>Send to voting</SendToMC>
                <MergeButton onClick={merge(this)}>Merge</MergeButton>

                {this.state.columns !== undefined && this.state.columns.map(column =>

                    <Column column={column.index} width={column.width} empty={column.index + 1 == this.state.columns.length}
                        grow={grow(column.index)}
                        shrink={shrink(column.index)}>
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
                                                        onCheck={select(this)}
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
                                onClick={createGroup()} />
                        }
                    </Column>

                )}
            </MainContainer>
        );
    }

    renderMultipleChoice(task) {
        return (
            <MainContainer>
                <SendToT onClick={() => this.organizeCreateInput(question)}>New Input: Text</SendToT>
                <ResultBackground style={{ width: "95%", height: "70%" }} />
                {task.options !== undefined && task.options.map(option =>
                    <ResultItem id={option.Index} id={option.Index} index={option.Index} title={option.Title}
                        vote percentage={((option.Votes.length / question.TotalVotes) * 100)} height="70%" total={task.options.length}
                        checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                        onCheck={this.organizeSelect.bind(this)}
                    />
                )}
            </MainContainer>
        );
    }

    render() {
        if (this.state.overview) {
            return (
                <MainContainer>
                    <TitleBreadCrumb>All Tasks</TitleBreadCrumb>
                    {this.state.tasks.map(task =>
                        <ItemTask id={task.index} onClick={this.clickTask}>{task.index + 1}. {task.title}</ItemTask>
                    )}
                </MainContainer>
            )
        } else {
            let task = this.state.tasks[this.state.active];

            if (task.type == 0) {
                return this.renderText(task);
            } else if (task.type == 1) {
                return this.renderMultipleChoice(task);
            }
        }
    }
}