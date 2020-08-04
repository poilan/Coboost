import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { PageModal } from '../../Services/PageModal';
import { Input, InputDetails } from './Components/Input';
import { Group } from './Components/Group';
import { Column } from './Components/Column';
import { ResultBackground, ResultItem } from './Components/Results';
import { CreateTaskModal } from './Components/CreateModal';
import { ContextMenu } from './Components/ContextMenu';
import { Tooltip, Collapse, IconButton } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

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

    scrollbar-width: thin;
    scrollbar-color: #4C7AD3 #fff;
`;

const ButtonToolbar = styled.div`
    display: flex;
    flex-direction: row;
    z-index: 10;
    position: absolute;
    height: 75px;
    left: 0;
    width: 100%;
    bottom: 0;
`;

const TitleBreadCrumb = styled.h2`
    font-family: CircularStd;
    font-weight: 500;
    font-size: 1.25rem;
    margin: 1% 0;
    height: 35px;
    position: fixed;
    text-align: center;
    z-index: 11;
    top: max(7.5%, 105px);
    left: 2.5vw;

    &:hover {
        cursor: pointer;
        opacity: 75%;
    }
`;

const ItemTask = styled.div`
    width: 100%;
    background: #fff;
    padding: 25px;
    margin-bottom: 20px;
    border-radius: 10px;
    position: relative;
    font-family: CircularStd;
    font-weight: 420;
    border: 1px solid black;
    opacity: 85%;

    &:hover {
        cursor:pointer;
        opacity: 100%;
    }
`;

const AnswerButton = styled(Nav.Link)`
    color: #fff;
    background: #4C7AD3;
    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    border: 1px solid #fff;
    flex: 1 1 auto;
    height: 100%;
    line-height: 75px;
`;

const SendToMC = styled(AnswerButton)`
    right: calc(6% + 250px);
`;

const SendToT = styled(SendToMC)`
`;

const MergeButton = styled(AnswerButton)`
    right: calc(7% + 500px);
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

const NewOptionNumber = styled.h2`
    opacity: 50%;
    font-family: CircularStd;
    font-size: 1rem;
`;

export class Organizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            overview: true,
            selected: '',
            collapse: [],

            modal: {
                string: '',
                key: '',
                answer: false,
                rename: false,
                create: false,
                remove: false,
            },

            details: {
                open: false,
                answer: null,
            },

            menu: {
                x: 0,
                y: 0,
                visible: false,
            }
        }

        //Contains all the modals
        this.modal = {
            answer: {
                open: () => {
                    this.setState({
                        modal: {
                            answer: true,
                        }
                    })
                },

                content: () => {
                    const sendInput = (e) => {
                        e.preventDefault();
                        const title = this.state.modal.string;
                        const user = localStorage.getItem("user");
                        const code = sessionStorage.getItem("code");

                        let data = {
                            description: title,
                            userID: user,
                        }

                        axios.post(`client/${code}/add-opentext`, data);
                        this.modal.answer.close();
                    }

                    const handleTitle = (event) => {
                        event.preventDefault();
                        var modal = this.state.modal;
                        modal.string = this.refs.title.value;
                        this.setState({
                            modal: modal,
                        });
                    }

                    return (
                        <Form autoComplete="off" onSubmit={sendInput}>
                            <NewOptionNumber>Title</NewOptionNumber>
                            <Form.Group controlId="validateTitle">
                                <InputGroup>
                                    <Form.Control name="title" ref="title" onChange={handleTitle.bind(this)} placeholder="Input Title.." required />
                                </InputGroup>
                            </Form.Group>
                            <CancelButton onClick={this.modal.answer.close}>Cancel</CancelButton>
                            <CreateButton type="submit" value="Submit" />
                        </Form>
                    );
                },

                close: () => {
                    this.setState({
                        modal: {
                            string: '',
                            answer: false,
                        }
                    })
                },
            },

            rename: {
                open: (event) => {
                    const key = event.target.id.split("-");

                    this.setState({
                        modal: {
                            rename: true,
                            key: key,
                        }
                    });
                },

                content: () => {
                    const rename = (e) => {
                        e.preventDefault();
                        const code = sessionStorage.getItem("code");
                        const key = this.state.modal.key;
                        const title = {
                            Title: this.state.modal.string,
                        }
                        if (key.indexOf("title") !== -1) {
                            axios.post(`admin/${code}/question-rename-group-${key[0]}`, title);
                        } else {
                            axios.post(`admin/${code}/question-rename-member-${key[0]}-${key[1]}`, title);
                        }

                        this.modal.rename.close();
                    }

                    const handleTitle = (event) => {
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
                                    <Form.Control name="title" ref="title" onChange={handleTitle.bind(this)} placeholder="Input Title.." required />
                                </InputGroup>
                            </Form.Group>
                            <CancelButton onClick={this.modal.rename.close}>Cancel</CancelButton>
                            <CreateButton type="submit" value="Submit" />
                        </Form>
                    );
                },

                close: () => {
                    this.setState({
                        modal: {
                            rename: false,
                            key: '',
                            string: '',
                        }
                    });
                },
            },

            create: {
                open: () => {
                    this.setState({
                        modal: {
                            create: true,
                        }
                    });
                },

                close: (success) => {
                    this.setState({
                        modal: {
                            create: false,
                        }
                    });

                    if (success == true) {
                        this.props.changeTab('task');
                        this.props.update(true);
                    }
                },
            },

            details: {
                open: (id) => {
                    let key = id.split("-");
                    let answer = this.props.tasks[this.props.active].groups[key[0]].Members[key[1]];
                    this.setState({
                        details: {
                            answer: answer,
                            open: true,
                        }
                    })
                },

                close: () => {
                    this.setState({
                        details: {
                            answer: null,
                            open: false,
                        }
                    })
                }
            }
        }
    }

    componentDidMount() {
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            const clickX = event.clientX;
            const clickY = event.clientY;
            this.setState({
                menu: {
                    x: clickX,
                    y: clickY,
                    visible: true,
                }
            })
        })

        document.addEventListener('click', () => {
            this.setState({
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        })
    }

    componentWillUnmount() {
    }

    clickTask = (event) => {
        this.setState({
            overview: false,
        });
        this.loadTask(event);
    }

    loadTask = (event) => {
        let key = event.target.id;
        let code = sessionStorage.getItem("code");

        this.setState({
            overview: false,
            selected: [],
        });
        axios.post(`admin/${code}/active-${key}`);
        this.props.SSE(key);
    }

    toOverview = () => {
        this.setState({
            overview: true,
            selected: [],
        });
    }

    render() {
        const text = (task) => {
            const shrink = (key) => {
                let Columns = this.props.columns;

                if (Columns[key] !== undefined) {
                    Columns[key].width !== undefined ? Columns[key].width -= 1 : Columns[key].width = 1;
                }

                this.setState({
                    columns: Columns,
                });
            }

            const grow = (key) => {
                let Columns = this.props.columns;

                if (Columns[key] !== undefined) {
                    Columns[key].width !== undefined ? Columns[key].width += 1 : Columns[key].width = 1;
                }

                this.setState({
                    columns: Columns,
                });
            }

            const createGroup = () => {
                const code = sessionStorage.getItem("code");
                axios.post(`admin/${code}/question-create-group-C${this.props.columns.length - 1}`);
            }

            const select = (event) => {
                event.stopPropagation();
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
            }

            const getOptions = () => {
                let options = [];
                for (var i = 0; i < this.state.selected.length; i++) {
                    var key = this.state.selected[i].split("-");
                    var answer = task.groups[key[0]].Members[key[1]];
                    var data = {
                        userID: answer.UserID,
                        index: options.length,
                        description: answer.Description,
                        votes: [],
                        archive: [],
                    }
                    options.push(data);
                }

                return options;
            }

            const getSelected = () => {
                let selected = [];
                for (let i = 0; i < this.state.selected.length; i++) {
                    let key = this.state.selected[i].split("-");

                    selected.push(key);
                }

                const compare = (a, b) => {
                    let group = a[0] - b[0];

                    if (group == 0)
                        return a[1] - b[1];
                    else
                        return group;
                }
                return selected.sort(compare);
            }

            const merge = () => {
                if (this.state.selected == undefined || this.state.selected.length <= 1)
                    return;

                const code = sessionStorage.getItem("code");
                const selected = getSelected();

                const master = selected[0];
                let change = [];

                for (var i = 1; i < selected.length; i++) {
                    var subject = selected[i];

                    if (change[subject[0]] !== undefined && change[subject[0]] > 0) {
                        subject[1] -= change[subject[0]];
                    }

                    axios.post(`admin/${code}/question-merge${master[0]}-${master[1]}with${subject[0]}-${subject[1]}`);

                    if (change[subject[0]] == undefined) {
                        change[subject[0]] = 1;
                    } else {
                        change[subject[0]] += 1;
                    }
                }

                this.setState({
                    selected: [],
                })
            }

            const archive = {
                members: () => {
                    const code = sessionStorage.getItem('code');

                    const selected = getSelected();
                    let change = []

                    for (let i = 0; i < selected.length; i++) {
                        let subject = selected[i];

                        if (change[subject[0]] !== undefined && change[subject[0]] > 0) {
                            subject[1] -= change[subject[0]];
                        }

                        axios.post(`admin/${code}/question-archive-member-${subject[0]}-${subject[1]}`);

                        if (change[subject[0]] == undefined) {
                            change[subject[0]] = 1;
                        } else {
                            change[subject[0]] += 1;
                        }
                    }

                    this.setState({
                        selected: [],
                    });
                }
            }

            const menu = [
                { "label": "Answer question", "callback": this.modal.answer.open },
                //{ "label": "Group selected answers", "callback": "" },
                { "label": "Merge selected answers", "callback": merge },
                { "label": "Create vote from selected", "callback": this.modal.create.open },
                { "label": "Remove selected answers", "callback": archive.members },
            ];

            return (
                <MainContainer>
                    <ButtonToolbar>
                        <AnswerButton onClick={this.modal.answer.open}>Send input</AnswerButton>
                        <Tooltip title="Creates a new task using the selected answer"><SendToMC onClick={this.modal.create.open.bind(this)}>Send to tasks</SendToMC></Tooltip>
                        <MergeButton onClick={merge.bind(this)}>Merge selected</MergeButton>
                    </ButtonToolbar>

                    {this.props.columns !== undefined && this.props.columns.map(column =>

                        <Column column={column.index} width={column.width} empty={column.index + 1 == this.props.columns.length}
                            grow={() => grow(column.index)}
                            shrink={() => shrink(column.index)}>

                            {task.groups !== undefined &&
                                task.groups.map(group => {
                                    if (column.index === group.Column) {
                                        return (
                                            <Group id={group.Index} key={group.Index}
                                                group={group.Index} column={group.Column} title={group.Title} size={column.width}
                                                double={this.modal.rename.open}>
                                                {group.Members !== undefined &&
                                                    group.Members.map(member =>

                                                        <Input id={group.Index + "-" + member.Index} key={member.Index}
                                                            member={member.Index} group={group.Index} column={group.Column} title={member.Title} size={column.width}
                                                            double={this.modal.rename.open.bind(this)}
                                                            checked={this.state.selected.indexOf(group.Index + "-" + member.Index) !== -1}
                                                            onCheck={select.bind(this)}
                                                            onClick={this.modal.details.open}
                                                        />

                                                    )}
                                            </Group>
                                        );
                                    }
                                }
                                )}

                            {column.index + 1 == this.props.columns.length &&
                                <Group id="new"
                                    group="new" column={column.index} title="➕ Create Group" size={column.width}
                                    onClick={createGroup.bind(this)}
                                />
                            }
                        </Column>
                    )
                    }
                    <ContextMenu x={this.state.menu.x} y={this.state.menu.y} visible={this.state.menu.visible} items={menu} />
                    {this.state.modal.answer && <PageModal title="Send Input" body={this.modal.answer.content()} onClose={this.modal.answer.close.bind(this)} />}
                    {this.state.modal.rename && <PageModal title="Rename" body={this.modal.rename.content()} onClose={this.modal.rename.close.bind(this)} />}
                    {this.state.modal.create && <CreateTaskModal type="1" options={getOptions()} onClose={this.modal.create.close.bind(this)} />}
                    {this.state.details.open && <InputDetails answer={this.state.details.answer} close={this.modal.details.close} />}
                </MainContainer >
            );
        }

        const multipleChoice = (task) => {
            const select = (event) => {
                const key = event.target.id;

                if (this.state.selected.indexOf(key) == -1) {
                    this.setState({
                        selected: key,
                    });
                }
                else {
                    this.setState({
                        selected: '',
                    })
                }
            }

            return (
                <MainContainer>
                    {this.state.modal.create && <CreateTaskModal type="0" title={task.options[parseInt(this.state.selected)].Description} onClose={this.state.modal.create.close.bind(this)} />}

                    <ButtonToolbar>
                        <Tooltip title="Creates a new task using the selected answer">
                            <SendToT disabled={this.state.selected.length !== 1} onClick={() => this.state.modal.create.open()}>Send to Tasks</SendToT>
                        </Tooltip>
                    </ButtonToolbar>
                    <ResultBackground style={{ width: "95%", height: "70%" }} />
                    {task.options !== undefined && task.options.map(option =>
                        <ResultItem id={option.Index} id={option.Index} index={option.Index} title={option.Title}
                            vote percentage={((option.Votes.length / task.TotalVotes) * 100)} height="70%" total={task.options.length}
                            checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                            onCheck={select.bind(this)}
                        />
                    )}
                </MainContainer>
            );
        }

        if (!this.state.overview && this.props.tasks[this.props.active] != undefined) {
            let task = this.props.tasks[this.props.active];

            if (task.type == 0) {
                return text(task);
            } else if (task.type == 1) {
                return multipleChoice(task);
            }
            else if (task.type == 2) {
                return multipleChoice(task);
            }
            else {
                return multipleChoice(task);
            }
            //else {
            //    return (
            //        <MainContainer>
            //            {this.props.tasks.map(task =>
            //                <ItemTask id={task.index} onClick={this.clickTask}>{task.index + 1}. {task.title}</ItemTask>
            //            )}
            //        </MainContainer>
            //    )
            //}
        } else {
            return (
                <MainContainer>
                    {this.props.tasks.map(task =>
                        <ItemTask id={task.index} onClick={this.clickTask}>{task.index + 1}. {task.title}</ItemTask>
                    )}
                </MainContainer>
            )
        }
    }
}