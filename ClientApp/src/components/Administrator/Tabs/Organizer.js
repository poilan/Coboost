import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { PageModal } from '../../Services/PageModal';
import { Input, InputDetails } from './Components/Input';
import { Group } from './Components/Group';
import { Column } from './Components/Column';
import { ResultBackground, ResultItem, ResultSlider } from './Components/Results';
import { CreateTaskModal } from './Components/CreateModal';
import { ContextMenu } from './Components/ContextMenu';
import { Tooltip, Collapse, IconButton, Menu, MenuItem } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

const MainContainer = styled.div`
    width: 100%;
    height: calc(100% - 75px);
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
    scrollbar-color: #575b75 #fff;
`;

const ButtonToolbar = styled.div`
    display: flex;
    flex-direction: row;
    z-index: 10;
    position: fixed;
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
    background: #575b75;
    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    border: solid #fff;
    border-width: 2px 1px;
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
                type: 1,
            },
            anchor: null,

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
                            Description: title,
                            UserID: user,
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
                open: (type) => {
                    this.setState({
                        modal: {
                            create: true,
                            type: type,
                        },
                        anchor: null,
                    });
                },

                close: (success) => {
                    this.setState({
                        modal: {
                            create: false,
                            type: 1,
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
                    let answer = this.props.tasks[this.props.active].Groups[key[0]].Members[key[1]];
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
                let selected = getSelected();
                for (var i = 0; i < selected.length; i++) {
                    var key = selected[i];
                    var answer = task.Groups[key[0]].Members[key[1]];
                    var data = {
                        UserID: answer.UserID,
                        Index: options.length,
                        Description: answer.Description,
                        Title: answer.Title,
                    }
                    options.push(data);
                }
                console.log(options);
                console.log(selected);
                console.log("Returning...");
                return options;
            }

            const getSelected = () => {
                let selected = [];
                let keys = [];
                for (let i = 0; i < this.state.selected.length; i++) {
                    let key = this.state.selected[i].split("-");
                    var answer = task.Groups[key[0]].Members[key[1]];
                    if (answer !== undefined) {
                        selected.push(this.state.selected[i]);
                        keys.push(key);
                    }
                }

                this.setState({ selected: selected });

                const compare = (a, b) => {
                    let group = b[0] - a[0];

                    if (group == 0)
                        return b[1] - a[1];
                    else
                        return group;
                }
                return keys.sort(compare);
            }

            const merge = async () => {
                if (this.state.selected == undefined || this.state.selected.length <= 1)
                    return;

                const code = sessionStorage.getItem("code");
                const selected = getSelected();

                const master = selected[selected.length - 1];

                //let change = [];

                for (var i = 0; i < (selected.length - 1); i++) {
                    var subject = selected[i];

                    await setTimeout(axios.post(`admin/${code}/question-merge${master[0]}-${master[1]}with${subject[0]}-${subject[1]}`), 500);
                }

                this.setState({
                    selected: [],
                })
            }

            const archive = {
                members: async () => {
                    const code = sessionStorage.getItem('code');

                    const selected = getSelected();

                    //let change = []

                    for (let i = 0; i < selected.length; i++) {
                        let subject = selected[i];

                        await setTimeout(axios.post(`admin/${code}/question-archive-member-${subject[0]}-${subject[1]}`), 500);
                    }

                    this.setState({
                        selected: [],
                    });
                }
            }

            const duplicate = async () => {
                const code = sessionStorage.getItem("code");
                const options = getOptions();

                options.forEach(async option => {
                    await setTimeout(axios.post(`client/${code}/add-opentext`, option), 500);
                });
            }

            const menu = [
                { "label": "Write input", "callback": this.modal.answer.open },
                { "label": "Duplicate selected input", "callback": duplicate },
                { "label": "Merge selected inputs", "callback": merge },
                { "label": "Create vote from selected inputs", "callback": this.modal.create.open },
                { "label": "Remove selected inputs", "callback": archive.members },
            ];

            return (
                <MainContainer>
                    <ButtonToolbar>
                        <AnswerButton onClick={this.modal.answer.open}>Write input</AnswerButton>
                        <Tooltip title="Creates a new task using the selected answer"><SendToMC onClick={(e) => this.setState({ anchor: e.currentTarget })}>Send selected to vote</SendToMC></Tooltip>
                        <MergeButton onClick={merge.bind(this)}>Merge selected inputs</MergeButton>
                        <Menu anchorOrigin={{ vertical: "center", horizontal: "center" }} transformOrigin={{ vertical: "bottom", horizontal: "center" }} id="CreateMenu" anchorEl={this.state.anchor} open={Boolean(this.state.anchor)} onClose={() => this.setState({ anchor: null })}>
                            <MenuItem onClick={() => this.modal.create.open(1)}>Multiple Choice</MenuItem>
                            <MenuItem onClick={() => this.modal.create.open(2)}>Points</MenuItem>
                            <MenuItem onClick={() => this.modal.create.open(3)}>Slider</MenuItem>
                        </Menu>
                    </ButtonToolbar>

                    {this.props.columns !== undefined && this.props.columns.map(column =>

                        <Column column={column.index} width={column.width} last={column.index + 1 == this.props.columns.length}
                            grow={() => grow(column.index)}
                            shrink={() => shrink(column.index)}>

                            {task.Groups !== undefined &&
                                task.Groups.map(group => {
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
                                    group="new" column={column.index} title="Create New Group" size={column.width}
                                    onClick={createGroup.bind(this)}
                                />
                            }
                        </Column>
                    )
                    }
                    <ContextMenu x={this.state.menu.x} y={this.state.menu.y} visible={this.state.menu.visible} items={menu} />
                    {this.state.modal.answer && <PageModal title="Send Input" body={this.modal.answer.content()} onClose={this.modal.answer.close.bind(this)} />}
                    {this.state.modal.rename && <PageModal title="Rename" body={this.modal.rename.content()} onClose={this.modal.rename.close.bind(this)} />}
                    {this.state.modal.create && <CreateTaskModal type={this.state.modal.type} options={getOptions} onClose={this.modal.create.close.bind(this)} />}
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
                    {this.state.modal.create && <CreateTaskModal type="0" title={task.Options[parseInt(this.state.selected)].Description} onClose={this.modal.create.close.bind(this)} />}

                    <ButtonToolbar>
                        <Tooltip title="Creates a new task using the selected answer">
                            <SendToT disabled={this.state.selected.length !== 1} onClick={() => this.modal.create.open(0)}>Send to Tasks</SendToT>
                        </Tooltip>
                    </ButtonToolbar>
                    <ResultBackground style={{ width: "95%", height: "70%" }} />
                    {task.Options !== undefined && task.Options.map(option =>
                        <ResultItem id={option.Index} id={option.Index} index={option.Index} title={option.Title}
                            vote percentage={((option.Votes.length / task.TotalVotes) * 100)} height="70%" total={task.Options.length}
                            checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                            onCheck={select.bind(this)}
                        />
                    )}
                </MainContainer>
            );
        }

        const points = (task) => {
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
                    {this.state.modal.create && <CreateTaskModal type="0" title={task.Options[parseInt(this.state.selected)].Description} onClose={this.modal.create.close.bind(this)} />}

                    <ButtonToolbar>
                        <Tooltip title="Creates a new task using the selected answer">
                            <SendToT disabled={this.state.selected.length !== 1} onClick={() => this.modal.create.open(0)}>Send to Tasks</SendToT>
                        </Tooltip>
                    </ButtonToolbar>
                    <ResultBackground style={{ width: "95%", height: "70%" }} />
                    {task.Options !== undefined && task.Options.map(option =>
                        <ResultItem id={option.Index} id={option.Index} index={option.Index} title={option.Title}
                            vote percentage={((option.Points / (task.Votes.length * task.Amount)) * 100)} height="70%" total={task.Options.length}
                            checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                            onCheck={select.bind(this)}
                        />
                    )}
                </MainContainer>
            );
        }

        const slider = (task) => {
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
                    {this.state.modal.create && <CreateTaskModal type="0" title={task.Options[parseInt(this.state.selected)].Description} onClose={this.modal.create.close.bind(this)} />}
                    <ButtonToolbar>
                        <Tooltip title="Creates a new task using the selected answer">
                            <SendToT disabled={this.state.selected.length !== 1} onClick={(e) => this.modal.create.open(0)}>Send to Tasks</SendToT>
                        </Tooltip>
                    </ButtonToolbar>
                    {task.Options !== undefined && task.Options.map(option =>
                        <ResultSlider id={option.Index} index={option.Index} title={option.Title} vote
                            average={option.Average} min={task.Min} max={task.Max}
                            checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                            onCheck={select.bind(this)}
                        />
                    )}
                </MainContainer>
            );
        }

        if (!this.state.overview && this.props.tasks[this.props.active] != undefined) {
            let task = this.props.tasks[this.props.active];

            if (task.Type == 0) {
                return text(task);
            } else if (task.Type == 1) {
                return multipleChoice(task);
            }
            else if (task.Type == 2) {
                return points(task);
            }
            else {
                return slider(task);
            }
        } else {
            return (
                <MainContainer>
                    {this.props.tasks.map(task =>
                        <ItemTask id={task.Index} onClick={this.clickTask}>{task.Index + 1}. {task.Title}</ItemTask>
                    )}
                </MainContainer>
            )
        }
    }
}