import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Collection, Task } from './Components/Task';
import { CreateTaskModal } from './Components/CreateModal';
import { ContextMenu } from './Components/ContextMenu';

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

export class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0,
            tasks: props.tasks,

            create: {
                type: '',
                title: '',
                options: [],
            },

            menu: {
                x: 0,
                y: 0,
                visible: false,
                type: null,
            },

            modal: {
                create: false,
                type: null,
            }
        }
    }

    componentDidMount() {
        let self = this;
        document.addEventListener('contextmenu', function () {
            self.setState({
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        })
    }

    createTask = (event) => {
        //const tasks = this.props.tasks;
        //var count = tasks.length;

        //var question = {
        //    questionType: -1,
        //    title: 'New Task',
        //    index: count,
        //};

        //this.setState({
        //    tasks: tasks.concat(question),
        //    active: count,
        //});
        //const code = sessionStorage.getItem('code');
        //var data = {
        //    Title: "Discuss: Ramifications of Dr.K",
        //}

        //axios.post(`admin/${code}/questions-create-opentext`, data, {
        //    headers: {
        //        'Content-Type': 'application/json',
        //    }
        //}).then(res => {
        //    if (res.status === 201) {
        //        this.props.updateTasks();
        //    }
        //});;

        const clickX = event.clientX;
        const clickY = event.clientY;
        this.setState({
            menu: {
                x: clickX,
                y: clickY,
                visible: true,
            }
        })
    }

    taskCreate = () => {
        const handleType = (event) => {
            event.preventDefault();
            this.setState({
                create: {
                    type: this.refs.type.value,
                }
            });
        }

        const handleTitle = (event) => {
            event.preventDefault();
            var create = this.state.create;
            create.title = this.refs.title.value;
            this.setState({
                create: create,
            });
        }

        const handleOption = (event) => {
            const key = event.target.id;
            const value = event.target.value;

            const data = this.state.create;
            data.options[key].description = value;
            this.setState({
                create: data,
            });
        }

        const createMultipleChoice = (event) => {
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
                    this.props.updateTasks().then(() => { this.props.startEventSource(this.state.active) });
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

        const createOpenText = () => {
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
                    this.props.updateTasks().then(() => { this.props.startEventSource(this.state.active) });
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

        const addOption = () => {
            var count = this.state.create.options !== undefined ? this.state.create.options.length : 0;
            var user = localStorage.getItem("user");

            var option = {
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
                        <Form id="type-form" onSubmit={handleType.bind(this)}>
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
                        <Form id="title-form" onSubmit={handleTitle.bind(this)}>
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
                    {isOpenText ? createOpenText() : ""}
                    <SlideTitle>{isOpenText ? "Creating your slide..." : "Select options"}</SlideTitle>
                    <SlideBody display={isOpenText ? "none" : "block"}>
                        <Form id="options-form" onSubmit={createMultipleChoice.bind(this)}>
                            {this.state.create.options !== undefined && this.state.create.options.map(option =>
                                <NewOptionContainer index={option.index}>
                                    <NewOptionNumber>{"Option " + (option.index + 1)}</NewOptionNumber>
                                    <NewOption id={option.index} name={"Option " + option.index} value={option.description} onChange={handleOption.bind(this)} required />
                                </NewOptionContainer>
                            )}
                            <NewOptionContainer>
                                <AddOption possible={canAdd} onClick={addOption.bind(this)}>➕ Add option...</AddOption>
                            </NewOptionContainer>
                        </Form>
                    </SlideBody>
                    <NewButton form="options-form" type='submit'>🠊</NewButton>
                </SelectedSlide>
            );
        }
    }

    taskClick = (event) => {
        this.loadTask(event);
    }

    loadTask = (event) => {
        let key = event.target.id;

        this.setState({
            active: key,
        });

        if (this.props.tasks[key].questionType !== -1) {
            this.props.startEventSource(key);
        }
    }

    renderActive() {
        if (this.state.active == -1) {
            return (
                <SelectedSlide>
                    <SlideTitle>Hello there</SlideTitle>
                    <SlideBody>To get started click "Create new Task" on the left</SlideBody>
                </SelectedSlide>
            );
        }

        var task = this.props.tasks[this.state.active];

        if (task !== undefined && task.questionType === -1) {
            return this.taskCreate();
        }
        else if (task !== undefined && task.questionType === 0) {
            return (
                <SelectedSlide>
                    <SlideTitle>{task.title}</SlideTitle>
                    <SlideBody>{task.groups !== undefined && task.groups.slice(1).map(group =>
                        group.Members !== undefined && group.Members.map(member =>
                            <VoteOption key={member.Index}>{member.Title}</VoteOption>
                        )
                    )}</SlideBody>
                </SelectedSlide>
            );
        }
        else if (task !== undefined && task.questionType === 1) {
            return (
                <SelectedSlide>
                    <SlideTitle>{task.title}</SlideTitle>
                    <SlideBody>
                        {task.options !== undefined && task.options.map(option =>
                            <>
                                <VoteOption id={option.Index} index={option.Index} name={"Option " + option.Index}>{option.Description} {option.Votes.length !== 0 && " (" + Math.floor((option.Votes.length / task.TotalVotes) * 100) + "%)"}</VoteOption>
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
        const modalCreateClose = (success) => {
            this.setState({
                modal: {
                    create: false,
                    type: null,
                }
            });

            if (success == true) {
                this.props.updateTasks();
            }
        }

        const createInput = () => {
            this.setState({
                modal: {
                    create: true,
                    type: 0,
                },
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        }

        const createVote = () => {
            this.setState({
                modal: {
                    create: true,
                    type: 1,
                },
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        }

        const menu = [
            { "label": "New Input", "callback": createInput },
            { "label": "New Vote", "callback": createVote },
        ];
        return (
            <>
                {this.state.modal.create && <CreateTaskModal type={this.state.modal.type} options={[]} onClose={modalCreateClose.bind(this)} />}
                <ContextMenu x={this.state.menu.x} y={this.state.menu.y} visible={this.state.menu.visible} items={menu} />
                <Collection createTask={(event) => this.createTask(event)} updateTasks={this.props.updateTasks}>
                    {this.props.tasks.map(task =>
                        <Task key={task.index} id={task.index} updateTasks={this.props.updateTasks}
                            onClick={this.taskClick} active={this.state.active == task.index}
                            type={task.questionType} title={task.title}
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