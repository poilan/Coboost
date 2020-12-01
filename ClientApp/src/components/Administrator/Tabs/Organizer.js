import React, {Component, useRef, createRef} from "react";
import Axios from "axios";
import {Modal, InputGroup, Form, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown} from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import {PageModal} from "../../Services/PageModal";
import {Input, InputDetails} from "./Components/Input";
import {Group} from "./Components/Group";
import {Column} from "./Components/Column";
import {ResultBackground, ResultItem, ResultSlider} from "./Components/Results";
import {CreateTaskModal} from "./Components/CreateModal";
import {ContextMenu} from "./Components/ContextMenu";
import {Tooltip, Collapse, IconButton, Button, Menu, MenuItem, TextField, Typography, ButtonGroup, createMuiTheme, ThemeProvider, Popper, Grow, Paper, ClickAwayListener, MenuList, Box} from "@material-ui/core";
import {InputModal} from "./Components/InputModal";
import CreateIcon from "@material-ui/icons/Create";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import AllOutIcon from "@material-ui/icons/AllOut";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CallMergeIcon from "@material-ui/icons/CallMerge";
import ArchiveIcon from "@material-ui/icons/Archive";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import TimerIcon from "@material-ui/icons/Timer";
import {width, height} from "@material-ui/system";
import {green, red} from "@material-ui/core/colors";


const MainContainer = Styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0;
    background: #E4E4E4;
    top: 0;
    left 0;

    scrollbar-width: thin;
    scrollbar-color: #374785 #fff;
`;

const ButtonToolbar = Styled.div`
    display: flex;
    flex-direction: row;
    z-index: 10;
    position: absolute;
    height: 75px;
    left: 50%;
    min-width: 300px;
    bottom: 0;
    transform: translateX(-50%);

    ${props => props.disabled ?
               "" :
               `&&& {
            &:hover {
                filter: brightness(150%);
                cursor: pointer;
            }
            &:active {
                filter: brightness(75%);
            }
        }`
    }
`;

const Tools = Styled.div`
    display: flex;
    flex-direction: row;
    z-index: 10;
    position: absolute;
    height: 50px;
    min-width: 300px;
`;

const Countdown = Styled.div`
    display: flex;
    flex-direction: row;
    z-index: 10;
    position: absolute;
    height: 50px;
    right: 0px;
    min-width: 350px;
    outline: none !important;

`;

const AnswerButton = Styled(Nav.Link)`
    color: #fff;
    background: #24305E;
    font-family: CircularStd;
    font-weight: 400;
    font-size: 1rem;
    padding: 0 1rem;
    text-align: center;
    border: 2px solid #fff;
    border-right: 0;
    border-radius: 5px;
    min-width: 150px;
    flex: 1 1 auto;
    height: 100%;
    line-height: 25px;
    transition-duration: 0.5s;

    &:hover {
        background: #a8d0e6;
        color: #000;
        cursor: pointer;
    }

`;

const SendToMC = Styled(Nav.Link)`
    color: #fff;
    background: #374785;
    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    border-top: 1px solid #fff;
    flex: 1 1 auto;
    height: 100%;
    line-height: 75px;

    &:hover {
        color: #ddd;
    }

    &:active {
        color: #fff;
    }
`;

const MergeButton = Styled(AnswerButton)`
`;

const CancelButton = Styled(Nav.Link)`
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

const CreateButton = Styled.input`
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

const NewOptionNumber = Styled.h2`
    opacity: 50%;
    font-family: CircularStd;
    font-size: 1rem;
`;

const ContentHeader = Styled(Card.Header)`
    width: 100%;
    background: #fff;
    height: 50px;
    left: 0;
    top: 0;
    position: absolute;
    margin: 0;
    padding: 0;
    border: 0;
`;

const ContentBody = Styled(Card.Body)`
    border: 0;
    background: #E4E4E4;
    position: absolute;
    top: 50px;
    width: 100%;
    height: calc(100% - 50px);
    padding: 50px;
    padding-top: calc(50px + 2rem);
`;

const TaskTitle = Styled(Typography)`
    font-weight: 600 !important;
    position: absolute;
    left: 50%;
    top: 1rem;
    transform: translateX(-50%);
    font-size: 2rem !important;
`;

export class Organizer extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            overview: true,
            selected: [],
            collapse: [],
            previous: -1,

            modal: {
                string: "",
                key: "",
                answer: false,
                rename: false,
                description: "",
                create: false,
                remove: false,
                type: 1
            },
            anchor: {
                time: false,
                task: null
            },

            details: {
                open: false,
                answer: null
            },

            menu: {
                x: 0,
                y: 0,
                visible: false
            },
            resultsAsPercentage: false
        };
        this.timeAnchor = createRef();
        //Contains all the modal's
        this.modal = {
            answer: {
                open: () => {
                    this.setState({
                        modal: {
                            answer: true
                        }
                    });
                    this.props.popOpen();
                },

                close: () => {
                    this.setState({
                        modal: {
                            string: "",
                            answer: false
                        }
                    });
                    this.props.popClosed();
                }
            },

            rename: {
                open: (event, titleKey) => {
                    const Key = event.target.id.split("-");
                    let Title;

                    if (titleKey)
                        Title = this.props.tasks[this.props.active].Groups[titleKey[0]].Members[titleKey[1]].Title;
                    else if (Key.indexOf("title") !== -1)
                        Title = this.props.tasks[this.props.active].Groups[Key[0]].Title;
                    else
                        Title = this.props.tasks[this.props.active].Groups[Key[0]].Members[Key[1]].Title;

                    this.setState({
                        modal: {
                            rename: true,
                            key: Key,
                            string: Title
                        }
                    });
                    this.props.popOpen();
                },

                content: () => {
                    const Rename = (e) => {
                        e.preventDefault();
                        const Code = sessionStorage.getItem("code");
                        const Key = this.state.modal.key;
                        const Title = {
                            Title: this.state.modal.string
                        };
                        if (Key.indexOf("title") !== -1)
                            Axios.post(`admin/${Code}/question-rename-group-${Key[0]}`, Title);
                        else
                            Axios.post(`admin/${Code}/question-rename-member-${Key[0]}-${Key[1]}`, Title);

                        this.modal.rename.close();
                    };

                    const HandleTitle = (event) => {
                        event.preventDefault();
                        var Modal = this.state.modal;
                        Modal.string = this.refs.title.value;
                        this.setState({
                            modal: Modal
                        });
                    };

                    return (
                        <Form
                            autoComplete="off"
                            onSubmit={Rename.bind(this)} >
                            <NewOptionNumber>Title</NewOptionNumber>
                            <Form.Group
                                controlId="validateTitle" >
                                <InputGroup>
                                    <Form.Control
                                        defaultValue={this.state.modal.string
                                        }
                                        name="title"
                                        onChange={HandleTitle.bind(this)}
                                        placeholder="Input Title.."
                                        ref="title"
                                        required />
                                </InputGroup>
                            </Form.Group>
                            <CancelButton
                                onClick={this.modal.rename.close} >
                                Cancel
                            </CancelButton>
                            <CreateButton
                                type="submit"
                                value="Submit" />
                        </Form>
                    );
                },

                close: () => {
                    this.setState({
                        modal: {
                            rename: false,
                            key: "",
                            string: ""
                        }
                    });
                    this.props.popClosed();
                    this.modal.details.close();
                }
            },

            create: {
                open: (type) => {
                    this.setState({
                        modal: {
                            create: true,
                            type: type
                        },
                        anchor: {
                            task: null
                        }
                    });
                    this.props.popOpen();
                },

                close: (success) => {
                    this.setState({
                        modal: {
                            create: false,
                            type: 1
                        },
                        selected: []
                    });

                    if (success === true)
                        this.props.update(true);
                    this.props.popClosed();
                }
            },

            details: {
                open: (id) => {
                    const Key = id.split("-");
                    console.log(Key);
                    const Answer = this.props.tasks[this.props.active].Groups[Key[0]].Members[Key[1]];
                    Answer.Group = Key[0];
                    this.setState({
                        details: {
                            answer: Answer,
                            open: true
                        }
                    });
                    this.props.popOpen();
                },

                close: () => {
                    this.setState({
                        details: {
                            answer: null,
                            open: false
                        }
                    });
                    this.props.popClosed();
                }
            }
        };
    }


    async componentDidMount()
    {
        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            const ClickX = event.clientX;
            const ClickY = event.clientY;
            this.setState({
                menu: {
                    x: ClickX,
                    y: ClickY,
                    visible: true
                }
            });
        });

        document.addEventListener("click",
            () => {
                this.setState({
                    menu: {
                        x: 0,
                        y: 0,
                        visible: false
                    }
                });
            });

        document.addEventListener("keydown",
            (event) => {
                if (!this.state.modal.create &&
                    !this.state.modal.answer &&
                    !this.state.modal.rename &&
                    !this.state.modal.answer &&
                    !this.state.modal.rename &&
                    !this.state.details.open &&
                    (event.key === "R" || event.key === "r"))
                {
                    this.setState({
                        selected: [],
                        anchor: {
                            task: null
                        }
                    });
                }
            });
        this.AutoResultToggle();
    }


    async AutoResultToggle()
    {
        await setTimeout(() => {
                this.setState({
                    resultsAsPercentage: !this.state.resultsAsPercentage
                });
                this.AutoResultToggle();
            },
            6660);
    }


    componentWillUnmount()
    {
    }


    clickTask = (event) => {
        this.setState({
            overview: false
        });
        this.loadTask(event);
    }


    loadTask = (event) => {
        const Key = event.target.id;

        this.setState({
            overview: false,
            selected: []
        });
        this.props.SSE(Key);
    }


    toOverview = () => {
        this.setState({
            overview: true,
            selected: []
        });
    }


    secondsToMinutes = (countdown) => {
        let Seconds = countdown, Minutes = 0;
        while (Seconds >= 60)
        {
            Minutes += 1;
            Seconds -= 60;
        }
        return `${Minutes}:${Seconds < 10 ?
                             `0${Seconds}` :
                             Seconds}`;
    }


    render()
    {
        const Text = (task) => {
            const ColShrink = (key) => {
                const Columns = this.props.columns;

                if (Columns[key] !== undefined)
                {
                    Columns[key].width !== undefined ?
                        Columns[key].width -= 1 :
                        Columns[key].width = 1;
                }

                this.setState({
                    columns: Columns
                });
            };

            const ColGrow = (key) => {
                const Columns = this.props.columns;

                if (Columns[key] !== undefined)
                {
                    Columns[key].width !== undefined ?
                        Columns[key].width += 1 :
                        Columns[key].width = 1;
                }

                this.setState({
                    columns: Columns
                });
            };

            const CreateGroup = () => {
                const Code = sessionStorage.getItem("code");
                Axios.post(`admin/${Code}/question-create-group-C${this.props.columns.length - 1}`);
            };

            const Select = (id) => {
                const Key = id;
                if (this.state.selected.indexOf(Key) === -1)
                {
                    let Selected = this.state.selected;

                    Selected ?
                        Selected.push(Key) :
                        Selected = [Key];
                    this.setState({
                        selected: Selected
                    });
                }
                else
                {
                    const Selected = this.state.selected;
                    const Index = Selected.indexOf(Key);
                    Selected.splice(Index, 1);
                    this.setState({
                        selected: Selected
                    });
                }
            };

            const GroupSelect = (id) => {
                let CountSelected = 0; //This counts every input in the group that was selected, deselects all only if all were already selected.
                task.Groups[id].Members.forEach((member) => {
                    const Key = `${id}-${member.Index}`;

                    if (this.state.selected.indexOf(Key) === -1)
                        Select(Key);
                    else
                        CountSelected += 1;
                });

                if (task.Groups[id].Members.length === CountSelected)
                {
                    task.Groups[id].Members.forEach((member) => {
                        const Key = `${id}-${member.Index}`;
                        Select(Key);
                    });
                }
            };

            const GetSelected = () => {
                const Selected = [];
                const Keys = [];
                for (let I = 0; I < this.state.selected.length; I++)
                {
                    const Key = this.state.selected[I].split("-");
                    const Answer = task.Groups[Key[0]].Members[Key[1]];
                    if (Answer !== undefined && !task.Groups[Key[0]].Collapsed)
                    {
                        Selected.push(this.state.selected[I]);
                        Keys.push(Key);
                    }
                }

                this.setState({
                    selected: Selected
                });

                const Compare = (a, b) => {
                    const Group = b[0] - a[0];

                    if (Group === 0)
                        return b[1] - a[1];
                    else
                        return Group;
                };
                return Keys.sort(Compare);
            };

            const GetOptions = () => {
                const Options = [];
                const Selected = GetSelected();
                for (let I = 0; I < Selected.length; I++)
                {
                    const Key = Selected[I];
                    const Answer = task.Groups[Key[0]].Members[Key[1]];
                    const Data = {
                        UserID: Answer.UserID,
                        Index: Options.length,
                        Description: Answer.Description,
                        Title: Answer.Title
                    };
                    Options.push(Data);
                }
                return Options;
            };

            const Merge = async () => {
                if (!this.state.selected || this.state.selected.length <= 1)
                    return;

                const Code = sessionStorage.getItem("code");
                const Selected = GetSelected();

                const Master = Selected[Selected.length - 1];

                //let change = [];

                for (let I = 0; I < (Selected.length - 1); I++)
                {
                    const Subject = Selected[I];

                    await setTimeout(Axios.post(
                            `admin/${Code}/question-merge${Master[0]}-${Master[1]}with${Subject[0]}-${Subject[1]}`),
                        500);
                }

                this.setState({
                    selected: []
                });
            };

            const Archive = {
                members: async () => {
                    const Code = sessionStorage.getItem("code");

                    const Selected = GetSelected();
                    const Keys = [];

                    Selected.forEach(select => {
                        const Key = {
                            Group: select[0],
                            Member: select[1]
                        };
                        Keys.push(Key);
                    });

                    Axios.post(`admin/${Code}/question-archive-members`, Keys);
                    this.setState({
                        selected: []
                    });
                }
            };

            const Duplicate = async () => {
                const Code = sessionStorage.getItem("code");
                const Options = GetOptions();

                //Options.forEach(async option => {
                //    await setTimeout(Axios.post(`client/${Code}/add-text-open`, option), 500);
                //});

                Axios.post(`admin/${Code}/text-duplicate`, Options);

                this.setState({
                    selected: []
                });
            };

            const Meny = [
                {
                    "label": "Write input",
                    "callback": this.modal.answer.open
                },
                {
                    "label": "Duplicate selected input",
                    "callback": Duplicate
                },
                {
                    "label": "Merge selected inputs",
                    "callback": Merge
                },
                {
                    "label": "Create vote from selected inputs",
                    "callback": this.modal.create.open
                },
                {
                    "label": "Remove selected inputs",
                    "callback": Archive.members
                }
            ];

            const Clear = () => {
                this.setState({
                    selected: []
                });
            };


            const TimeToggle = () => {
                this.setState({
                    anchor: {
                        time: !this.state.anchor.time
                    }
                });
            };
            const TimeClose = (event) => {
                if (this.timeAnchor.current && this.timeAnchor.current.contains(event.target))
                    return;

                this.setState({
                    anchor: {
                        time: false
                    }
                });
            };

            return (
                <MainContainer>
                    <ContentHeader>
                        <Tools
                            showControls={this.props.showControls} >
                            <AnswerButton
                                draggable="false"
                                onClick={this.modal.answer.open} >
                                <CreateIcon
                                    className="icon" />
                                <br />
                                Write input
                            </AnswerButton>
                            <MergeButton
                                disabled
                                draggable="false" >
                                <AllInclusiveIcon
                                    className="icon" />
                                <br />
                                Select All
                            </MergeButton>
                            <AnswerButton
                                draggable="false"
                                onClick={() => this.setState({ selected: [] })} >
                                <AllOutIcon
                                    className="icon" />
                                <br />
                                Deselect All
                            </AnswerButton>
                            <MergeButton
                                draggable="false"
                                onClick={Merge} >
                                <CallMergeIcon
                                    className="icon" />
                                <br />Merge
                            </MergeButton>
                            <AnswerButton
                                draggable="false"
                                onClick={Duplicate} >
                                <FileCopyIcon
                                    className="icon" />
                                <br />
                                Duplicate
                            </AnswerButton>
                            <MergeButton
                                draggable="false"
                                onClick={Archive.members} >
                                <ArchiveIcon
                                    className="icon" />
                                <br />
                                Archive
                            </MergeButton>
                        </Tools>

                        <Countdown>
                            {
                                !task.InProgress ?
                                    <Button
                                        onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                        style={{ minWidth: "150px", color: "#fff", display: "block", paddingTop: "2px", outline: "0 !important", backgroundColor: "red" }} >
                                        <LockIcon
                                            className="icon"
                                            style={{ color: "white" }} />
                                        <br />
                                        Task Closed
                                    </Button> :
                                    <Button
                                        onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                        style={{ minWidth: "150px", color: "#fff", display: "block", paddingTop: "2px", outline: "0 !important", backgroundColor: "green" }} >
                                        <LockOpenIcon
                                            className="icon"
                                            style={{ color: "white" }} />
                                        <br />
                                        Task Open
                                    </Button>
                            }
                            {
                                <React.Fragment>
                                    <ButtonGroup
                                        color="secondary"
                                        ref={this.timeAnchor}
                                        variant="contained" >
                                        {
                                            !task.InProgress || task.Countdown < 0 ?
                                                <Button
                                                    color="secondary"
                                                    onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/start-countdown`)}
                                                    style={{ minWidth: "150px", paddingTop: "2px", display: "block", outline: "0 !important" }} >
                                                    <TimerIcon
                                                        className="icon" />
                                                    <br />
                                                    Start Timer
                                                </Button> :
                                                <Button
                                                    color="secondary"

                                                    onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                                    style={{ minWidth: "150px", paddingTop: "2px", display: "block", outline: "0 !important" }} >
                                                    <TimerIcon
                                                        className="icon" />
                                                    <br />
                                                    {this.secondsToMinutes(task.Countdown)}
                                                </Button>

                                        }
                                        <Button
                                            aria-controls={this.state.anchor.time ?
                                                               "split-button menu" :
                                                               undefined}
                                            aria-expanded={this.state.anchor.time ?
                                                               "true" :
                                                               undefined}
                                            aria-haspopup="menu"
                                            color="secondary"
                                            onClick={TimeToggle}
                                            size="small"
                                            style={{ minWidth: "50px" }} >
                                            <ArrowDropDownIcon />
                                        </Button>
                                    </ButtonGroup>
                                    <Popper
                                        anchorEl={this.timeAnchor.current}
                                        disablePortal
                                        open={this.state.anchor.time}
                                        role={undefined}
                                        style={{ zIndex: "15" }} >
                                        <Paper>
                                            <ClickAwayListener
                                                onClickAway={TimeClose} >
                                                <Box
                                                    m={1}
                                                    mb={2}
                                                    p={1} >
                                                    <TextField
                                                        label="Timer in Seconds"
                                                        margin="none"
                                                        onChange={(e) => this.props.handleTimer(e, task.Index)}
                                                        style={{ width: "150px" }}
                                                        type="number"
                                                        value={task.Timer}
                                                        variant="standard" />
                                                </Box>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Popper>
                                </React.Fragment>
                            }
                        </Countdown>
                    </ContentHeader>

                    <ContentBody>
                        <TaskTitle>
                            {task.Title}
                        </TaskTitle>

                        <ButtonToolbar
                            disabled={this.state.selected.length < 1} >

                            <SendToMC
                                disabled={this.state.selected.length < 1}
                                draggable="false"
                                onClick={(e) => this.setState({ anchor: { task: e.currentTarget } })} >
                                Send selected to new task
                            </SendToMC>

                            <div
                                style={{
                                    position: "absolute",
                                    left: "-64px",
                                    bottom: "-79px",
                                    height: "150px",
                                    width: "75px",
                                    transform: "rotate(45deg)",
                                    backgroundColor: "#374785",
                                    border: "1px solid #fff",
                                    zIndex: "-1"
                                }} />

                            <div
                                style={{
                                    position: "absolute",
                                    right: "-64px",
                                    bottom: "-79px",
                                    height: "150px",
                                    width: "75px",
                                    transform: "rotate(-45deg)",
                                    backgroundColor: "#374785",
                                    border: "1px solid #fff",
                                    zIndex: "-1"
                                }} />

                            <Menu
                                anchorEl={this.state.anchor.task}
                                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                                id="CreateMenu"
                                onClose={() => this.setState({ anchor: { task: null } })}
                                open={Boolean(this.state.anchor.task)}
                                transformOrigin={{ vertical: "bottom", horizontal: "center" }} >

                                {
                                    this.state.selected.length < 2 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(0)} >
                                            Open Text
                                        </MenuItem>
                                }
                                {
                                    this.state.selected.length > 1 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(1)} >
                                            Multiple Choice
                                        </MenuItem>
                                }
                                {
                                    this.state.selected.length > 1 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(2)} >
                                            Points
                                        </MenuItem>
                                }
                                {
                                    this.state.selected.length > 1 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(3)} >
                                            Slider
                                        </MenuItem>
                                }
                            </Menu>
                        </ButtonToolbar>

                        {this.props.columns !== undefined &&
                            this.props.columns.map(column =>
                                <Column
                                    clearSelect={Clear}
                                    column={column.index}
                                    grow={() => ColGrow(column.index)}
                                    last={column.index + 1 === this.props.columns.length}
                                    selected={GetSelected}
                                    shrink={() => ColShrink(column.index)}
                                    width={column.width} >

                                    {task.Groups !== undefined &&
                                        task.Groups.map(group => {
                                                if (column.index === group.Column)
                                                {
                                                    return (
                                                        <Group
                                                            clearSelect={Clear}
                                                            collapsed={group.Collapsed}
                                                            color={group.Color}
                                                            column={group.Column}
                                                            double={this.modal.rename.open}
                                                            group={group.Index}
                                                            id={group.Index}
                                                            key={group.Index}
                                                            onClick={GroupSelect}
                                                            selected={GetSelected}
                                                            size={column.width}
                                                            title={group.Title} >

                                                            {group.Members !== undefined &&
                                                                group.Members.map(member =>
                                                                    <Input
                                                                        checked={this.state.selected.indexOf(group.Index + "-" + member.Index) !== -1}
                                                                        column={group.Column}
                                                                        description={member.Description}
                                                                        double={this.modal.details.open}
                                                                        group={group.Index}
                                                                        id={group.Index + "-" + member.Index}
                                                                        isMerged={member.Children != undefined ?
                                                                                      member.Children.length :
                                                                                      0}
                                                                        key={member.Index}
                                                                        member={member.Index}
                                                                        onClick={Select}
                                                                        size={column.width}
                                                                        title={member.Title} />
                                                                )}
                                                        </Group>
                                                    );
                                                }
                                                else
                                                    return null;
                                            }
                                        )}

                                    {column.index + 1 === this.props.columns.length &&
                                        <Group
                                            clearSelect={Clear}
                                            color="#374785"
                                            column={column.index}
                                            group="new"
                                            id="new"
                                            onClick={CreateGroup.bind(this)}
                                            selected={GetSelected}
                                            size={column.width}
                                            title="CREATE NEW GROUP" />
                                    }
                                </Column>
                            )
                        }
                        <ContextMenu
                            items={Meny}
                            visible={this.state.menu.visible}
                            x={this.state.menu.x}
                            y={this.state.menu.y} />
                        {this.state.modal.answer &&
                            <InputModal
                                onClose={this.modal.answer.close.bind(this)}
                                title="Write Input" />}
                        {this.state.modal.rename &&
                            <PageModal
                                body={this.modal.rename.content()}
                                onClose={this.modal.rename.close.bind(this)}
                                title="Rename" />}
                        {this.state.modal.create &&
                            <CreateTaskModal
                                onClose={this.modal.create.close.bind(this)}
                                options={GetOptions}
                                title={task.Groups[this.state.selected[0].split("-")[0]].Members[this.state.selected[0].split("-")[1]].Title}
                                type={this.state.modal.type} />}
                        {this.state.details.open &&
                            <InputDetails
                                answer={this.state.details.answer}
                                close={this.modal.details.close}
                                rename={this.modal.rename.open} />}
                    </ContentBody>
                </MainContainer >
            );
        };

        const MultipleChoice = (task) => {
            const Select = (key) => {
                if (this.state.selected.indexOf(key) === -1)
                {
                    const Selected = this.state.selected;
                    Selected.push(key);
                    this.setState({
                        selected: Selected
                    });
                }
                else
                {
                    const Selected = this.state.selected;
                    const Index = Selected.indexOf(key);
                    Selected.splice(Index, 1);
                    this.setState({
                        selected: Selected
                    });
                }
            };

            const GetOptions = () => {
                const Options = [];
                const Selected = this.state.selected;

                for (let I = 0; I < Selected.length; I++)
                {
                    const Key = Selected[I];
                    const Answer = task.Options[Key];

                    const Data = {
                        UserID: Answer.UserID,
                        Index: Options.length,
                        Description: Answer.Description,
                        Title: Answer.Title
                    };

                    Options.push(Data);
                }

                return Options;
            };

            const TimeToggle = () => {
                this.setState({
                    anchor: {
                        time: !this.state.anchor.time
                    }
                });
            };
            const TimeClose = (event) => {
                if (this.timeAnchor.current && this.timeAnchor.current.contains(event.target))
                    return;

                this.setState({
                    anchor: {
                        time: false
                    }
                });
            };



            return (
                <MainContainer>
                    <ContentHeader>
                        <Countdown>
                            {
                                !task.InProgress ?
                                    <Button
                                        onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                        style={{ minWidth: "150px", color: "#fff", display: "block", paddingTop: "2px", outline: "0 !important", backgroundColor: "red" }} >
                                        <LockIcon
                                            className="icon"
                                            style={{ color: "white" }} />
                                        <br />
                                        Task Closed
                                    </Button> :
                                    <Button
                                        onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                        style={{ minWidth: "150px", color: "#fff", display: "block", paddingTop: "2px", outline: "0 !important", backgroundColor: "green" }} >
                                        <LockOpenIcon
                                            className="icon"
                                            style={{ color: "white" }} />
                                        <br />
                                        Task Open
                                    </Button>
                            }
                            {
                                <React.Fragment>
                                    <ButtonGroup
                                        color="secondary"
                                        ref={this.timeAnchor}
                                        variant="contained" >
                                        {
                                            !task.InProgress || task.Countdown < 0 ?
                                                <Button
                                                    color="secondary"
                                                    onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/start-countdown`)}
                                                    style={{ minWidth: "150px", paddingTop: "2px", display: "block", outline: "0 !important" }} >
                                                    <TimerIcon
                                                        className="icon" />
                                                    <br />
                                                    Start Timer
                                                </Button> :
                                                <Button
                                                    color="secondary"

                                                    onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                                    style={{ minWidth: "150px", paddingTop: "2px", display: "block", outline: "0 !important" }} >
                                                    <TimerIcon
                                                        className="icon" />
                                                    <br />
                                                    {this.secondsToMinutes(task.Countdown)}
                                                </Button>

                                        }
                                        <Button
                                            aria-controls={this.state.anchor.time ?
                                                               "split-button menu" :
                                                               undefined}
                                            aria-expanded={this.state.anchor.time ?
                                                               "true" :
                                                               undefined}
                                            aria-haspopup="menu"
                                            color="secondary"
                                            onClick={TimeToggle}
                                            size="small"
                                            style={{ minWidth: "50px" }} >
                                            <ArrowDropDownIcon />
                                        </Button>
                                    </ButtonGroup>
                                    <Popper
                                        anchorEl={this.timeAnchor.current}
                                        disablePortal
                                        open={this.state.anchor.time}
                                        role={undefined}
                                        style={{ zIndex: "15" }} >
                                        <Paper>
                                            <ClickAwayListener
                                                onClickAway={TimeClose} >
                                                <Box
                                                    m={1}
                                                    mb={2}
                                                    p={1} >
                                                    <TextField
                                                        label="Timer in Seconds"
                                                        margin="none"
                                                        onChange={(e) => this.props.handleTimer(e, task.Index)}
                                                        style={{ width: "150px" }}
                                                        type="number"
                                                        value={task.Timer}
                                                        variant="standard" />
                                                </Box>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Popper>
                                </React.Fragment>
                            }
                        </Countdown>
                    </ContentHeader>
                    <ContentBody>
                        <TaskTitle>
                            {task.Title}
                        </TaskTitle>

                        {this.state.modal.create &&
                            <CreateTaskModal
                                onClose={this.modal.create.close}
                                options={GetOptions}
                                title={task.Options[parseInt(this.state.selected[0])].Description}
                                type={this.state.modal.type} />}

                        <ButtonToolbar
                            disabled={this.state.selected.length < 1} >
                            <SendToMC
                                disabled={this.state.selected.length < 1}
                                draggable="false"
                                onClick={(e) => this.setState({ anchor: { task: e.currentTarget } })} >
                                Send selected to new task
                            </SendToMC>
                            <div
                                style={{
                                    position: "absolute",
                                    left: "-64px",
                                    bottom: "-79px",
                                    height: "150px",
                                    width: "75px",
                                    transform: "rotate(45deg)",
                                    backgroundColor: "#374785",
                                    border: "1px solid #fff",
                                    zIndex: "-1"
                                }} />
                            <div
                                style={{
                                    position: "absolute",
                                    right: "-64px",
                                    bottom: "-79px",
                                    height: "150px",
                                    width: "75px",
                                    transform: "rotate(-45deg)",
                                    backgroundColor: "#374785",
                                    border: "1px solid #fff",
                                    zIndex: "-1"
                                }} />

                            <Menu
                                anchorEl={this.state.anchor.task}
                                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                                id="CreateMenu"
                                onClose={() => this.setState({ anchor: { task: null } })}
                                open={Boolean(this.state.anchor.task)}
                                transformOrigin={{ vertical: "bottom", horizontal: "center" }} >
                                {
                                    this.state.selected.length < 2 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(0)} >
                                            Open Text
                                        </MenuItem>
                                }
                                {
                                    this.state.selected.length > 1 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(1)} >
                                            Multiple Choice
                                        </MenuItem>
                                }
                                {
                                    this.state.selected.length > 1 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(2)} >
                                            Points
                                        </MenuItem>
                                }
                                {
                                    this.state.selected.length > 1 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(3)} >
                                            Slider
                                        </MenuItem>
                                }
                            </Menu>
                        </ButtonToolbar>
                        <ResultBackground
                            style={{ width: "95%", height: "80%" }} />
                        {
                            task.Options !== undefined &&
                                task.Options.map(option =>
                                    <ResultItem
                                        checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                                        color={option.Color}
                                        description={option.Description}
                                        height="80%"
                                        id={option.Index}
                                        id={option.Index}
                                        index={option.Index}
                                        onClick={Select}
                                        percentage={((option.Votes.length / task.TotalVotes) * 100)}
                                        points={option.Votes.length}
                                        showPercentage={this.state.resultsAsPercentage}
                                        title={option.Title}
                                        total={task.Options.length}
                                        vote />
                                )
                        }
                    </ContentBody>
                </MainContainer>
            );
        };

        const Points = (task) => {
            const Select = (key) => {
                if (this.state.selected.indexOf(key) === -1)
                {
                    const Selected = this.state.selected;
                    Selected.push(key);
                    this.setState({
                        selected: Selected
                    });
                }
                else
                {
                    const Selected = this.state.selected;
                    const Index = Selected.indexOf(key);
                    Selected.splice(Index, 1);
                    this.setState({
                        selected: Selected
                    });
                }
            };

            const GetOptions = () => {
                const Options = [];
                const Selected = this.state.selected;
                for (let I = 0; I < Selected.length; I++)
                {
                    const Key = Selected[I];
                    const Answer = task.Options[Key];
                    const Data = {
                        UserID: Answer.UserID,
                        Index: Options.length,
                        Description: Answer.Description,
                        Title: Answer.Title
                    };
                    Options.push(Data);
                }
                return Options;
            };

            const TimeToggle = () => {
                this.setState({
                    anchor: {
                        time: !this.state.anchor.time
                    }
                });
            };
            const TimeClose = (event) => {
                if (this.timeAnchor.current && this.timeAnchor.current.contains(event.target))
                    return;

                this.setState({
                    anchor: {
                        time: false
                    }
                });
            };



            return (
                <MainContainer>
                    <ContentHeader>
                        <Countdown>
                            {
                                !task.InProgress ?
                                    <Button
                                        onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                        style={{ minWidth: "150px", color: "#fff", display: "block", paddingTop: "2px", outline: "0 !important", backgroundColor: "red" }} >
                                        <LockIcon
                                            className="icon"
                                            style={{ color: "white" }} />
                                        <br />
                                        Task Closed
                                    </Button> :
                                    <Button
                                        onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                        style={{ minWidth: "150px", color: "#fff", display: "block", paddingTop: "2px", outline: "0 !important", backgroundColor: "green" }} >
                                        <LockOpenIcon
                                            className="icon"
                                            style={{ color: "white" }} />
                                        <br />
                                        Task Open
                                    </Button>
                            }
                            {
                                <React.Fragment>
                                    <ButtonGroup
                                        color="secondary"
                                        ref={this.timeAnchor}
                                        variant="contained" >
                                        {
                                            !task.InProgress || task.Countdown < 0 ?
                                                <Button
                                                    color="secondary"
                                                    onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/start-countdown`)}
                                                    style={{ minWidth: "150px", paddingTop: "2px", display: "block", outline: "0 !important" }} >
                                                    <TimerIcon
                                                        className="icon" />
                                                    <br />
                                                    Start Timer
                                                </Button> :
                                                <Button
                                                    color="secondary"

                                                    onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                                    style={{ minWidth: "150px", paddingTop: "2px", display: "block", outline: "0 !important" }} >
                                                    <TimerIcon
                                                        className="icon" />
                                                    <br />
                                                    {this.secondsToMinutes(task.Countdown)}
                                                </Button>

                                        }
                                        <Button
                                            aria-controls={this.state.anchor.time ?
                                                               "split-button menu" :
                                                               undefined}
                                            aria-expanded={this.state.anchor.time ?
                                                               "true" :
                                                               undefined}
                                            aria-haspopup="menu"
                                            color="secondary"
                                            onClick={TimeToggle}
                                            size="small"
                                            style={{ minWidth: "50px" }} >
                                            <ArrowDropDownIcon />
                                        </Button>
                                    </ButtonGroup>
                                    <Popper
                                        anchorEl={this.timeAnchor.current}
                                        disablePortal
                                        open={this.state.anchor.time}
                                        role={undefined}
                                        style={{ zIndex: "15" }} >
                                        <Paper>
                                            <ClickAwayListener
                                                onClickAway={TimeClose} >
                                                <Box
                                                    m={1}
                                                    mb={2}
                                                    p={1} >
                                                    <TextField
                                                        label="Timer in Seconds"
                                                        margin="none"
                                                        onChange={(e) => this.props.handleTimer(e, task.Index)}
                                                        style={{ width: "150px" }}
                                                        type="number"
                                                        value={task.Timer}
                                                        variant="standard" />
                                                </Box>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Popper>
                                </React.Fragment>
                            }
                        </Countdown>
                    </ContentHeader>
                    <ContentBody>
                        <TaskTitle>
                            {task.Title}
                        </TaskTitle>

                        {
                            this.state.modal.create &&
                                <CreateTaskModal
                                    onClose={this.modal.create.close.bind(this)}
                                    options={GetOptions}
                                    title={task.Options[parseInt(this.state.selected[0])].Description}
                                    type={this.state.modal.type} />
                        }

                        <ButtonToolbar
                            disabled={this.state.selected.length < 1} >
                            <SendToMC
                                disabled={this.state.selected.length < 1}
                                draggable="false"
                                onClick={(e) => this.setState({ anchor: { task: e.currentTarget } })} >
                                Send selected to new task
                            </SendToMC>

                            <div
                                style={{
                                    position: "absolute",
                                    left: "-64px",
                                    bottom: "-79px",
                                    height: "150px",
                                    width: "75px",
                                    transform: "rotate(45deg)",
                                    backgroundColor: "#374785",
                                    border: "1px solid #fff",
                                    zIndex: "-1"
                                }} />

                            <div
                                style={{
                                    position: "absolute",
                                    right: "-64px",
                                    bottom: "-79px",
                                    height: "150px",
                                    width: "75px",
                                    transform: "rotate(-45deg)",
                                    backgroundColor: "#374785",
                                    border: "1px solid #fff",
                                    zIndex: "-1"
                                }} />

                            <Menu
                                anchorEl={this.state.anchor.task}
                                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                                id="CreateMenu"
                                onClose={() => this.setState({ anchor: { task: null } })}
                                open={Boolean(this.state.anchor.task)}
                                transformOrigin={{ vertical: "bottom", horizontal: "center" }} >

                                {
                                    this.state.selected.length < 2 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(0)} >
                                            Open Text
                                        </MenuItem>
                                }
                                {
                                    this.state.selected.length > 1 &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(1)} >
                                            Multiple Choice
                                        </MenuItem> &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(2)} >
                                            Points
                                        </MenuItem> &&
                                        <MenuItem
                                            onClick={() => this.modal.create.open(3)} >
                                            Slider
                                        </MenuItem>
                                }
                            </Menu>
                        </ButtonToolbar>
                        <ResultBackground
                            style={{ width: "95%", height: "80%" }} />
                        {task.Options !== undefined &&
                            task.Options.map(option =>
                                <ResultItem
                                    checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                                    color={option.Color}
                                    description={option.Description}
                                    height="80%"
                                    id={option.Index}
                                    index={option.Index}
                                    onClick={Select}
                                    percentage={((option.Points / (task.Votes.length * task.Amount)) * 100)}
                                    points={option.Points}
                                    showPercentage={this.state.resultsAsPercentage}
                                    title={option.Title}
                                    total={task.Options.length}
                                    vote />
                            )}
                    </ContentBody>
                </MainContainer>
            );
        };

        const Slider = (task) => {
            const Select = (key) => {
                if (this.state.selected.indexOf(key) === -1)
                {
                    const Selected = this.state.selected;
                    Selected.push(key);
                    this.setState({
                        selected: Selected
                    });
                }
                else
                {
                    const Selected = this.state.selected;
                    const Index = Selected.indexOf(key);
                    Selected.splice(Index, 1);
                    this.setState({
                        selected: Selected
                    });
                }
            };

            const GetOptions = () => {
                const Options = [];
                const Selected = this.state.selected;
                for (let I = 0; I < Selected.length; I++)
                {
                    const Key = Selected[I];
                    const Answer = task.Options[Key];
                    const Data = {
                        UserID: Answer.UserID,
                        Index: Options.length,
                        Description: Answer.Description,
                        Title: Answer.Title
                    };
                    Options.push(Data);
                }
                return Options;
            };

            const TimeToggle = () => {
                this.setState({
                    anchor: {
                        time: !this.state.anchor.time
                    }
                });
            };
            const TimeClose = (event) => {
                if (this.timeAnchor.current && this.timeAnchor.current.contains(event.target))
                    return;

                this.setState({
                    anchor: {
                        time: false
                    }
                });
            };



            return (
                <MainContainer>
                    <ContentHeader>
                        <Countdown>
                            {
                                !task.InProgress ?
                                    <Button
                                        onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                        style={{ minWidth: "150px", color: "#fff", display: "block", paddingTop: "2px", outline: "0 !important", backgroundColor: "red" }} >
                                        <LockIcon
                                            className="icon"
                                            style={{ color: "white" }} />
                                        <br />
                                        Task Closed
                                    </Button> :
                                    <Button
                                        onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                        style={{ minWidth: "150px", color: "#fff", display: "block", paddingTop: "2px", outline: "0 !important", backgroundColor: "green" }} >
                                        <LockOpenIcon
                                            className="icon"
                                            style={{ color: "white" }} />
                                        <br />
                                        Task Open
                                    </Button>
                            }
                            {
                                <React.Fragment>
                                    <ButtonGroup
                                        color="secondary"
                                        ref={this.timeAnchor}
                                        variant="contained" >
                                        {
                                            !task.InProgress || task.Countdown < 0 ?
                                                <Button
                                                    color="secondary"
                                                    onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/start-countdown`)}
                                                    style={{ minWidth: "150px", paddingTop: "2px", display: "block", outline: "0 !important" }} >
                                                    <TimerIcon
                                                        className="icon" />
                                                    <br />
                                                    Start Timer
                                                </Button> :
                                                <Button
                                                    color="secondary"

                                                    onClick={() => Axios.post(`admin/${sessionStorage.getItem("code")}/task-toggle${task.Index}`)}
                                                    style={{ minWidth: "150px", paddingTop: "2px", display: "block", outline: "0 !important" }} >
                                                    <TimerIcon
                                                        className="icon" />
                                                    <br />
                                                    {this.secondsToMinutes(task.Countdown)}
                                                </Button>

                                        }
                                        <Button
                                            aria-controls={this.state.anchor.time ?
                                                               "split-button menu" :
                                                               undefined}
                                            aria-expanded={this.state.anchor.time ?
                                                               "true" :
                                                               undefined}
                                            aria-haspopup="menu"
                                            color="secondary"
                                            onClick={TimeToggle}
                                            size="small"
                                            style={{ minWidth: "50px" }} >
                                            <ArrowDropDownIcon />
                                        </Button>
                                    </ButtonGroup>
                                    <Popper
                                        anchorEl={this.timeAnchor.current}
                                        disablePortal
                                        open={this.state.anchor.time}
                                        role={undefined}
                                        style={{ zIndex: "15" }} >
                                        <Paper>
                                            <ClickAwayListener
                                                onClickAway={TimeClose} >
                                                <Box
                                                    m={1}
                                                    mb={2}
                                                    p={1} >
                                                    <TextField
                                                        label="Timer in Seconds"
                                                        margin="none"
                                                        onChange={(e) => this.props.handleTimer(e, task.Index)}
                                                        style={{ width: "150px" }}
                                                        type="number"
                                                        value={task.Timer}
                                                        variant="standard" />
                                                </Box>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Popper>
                                </React.Fragment>
                            }
                        </Countdown>

                    </ContentHeader>

                    <ContentBody>
                        <TaskTitle>
                            {task.Title}
                        </TaskTitle>
                        {
                            this.state.modal.create &&
                                <CreateTaskModal
                                    onClose={this.modal.create.close}
                                    options={GetOptions}
                                    title={task.Options[parseInt(this.state.selected[0])].Description}
                                    type={this.state.modal.type} />
                        }
                        <ButtonToolbar
                            disabled={this.state.selected.length < 1} >
                            <SendToMC
                                disabled={this.state.selected.length < 1}
                                draggable="false"
                                onClick={(e) => this.setState({ anchor: { task: e.currentTarget } })} >
                                Send selected to new task
                            </SendToMC>
                            <div
                                style={{
                                    position: "absolute",
                                    left: "-64px",
                                    bottom: "-79px",
                                    height: "150px",
                                    width: "75px",
                                    transform: "rotate(45deg)",
                                    backgroundColor: "#374785",
                                    border: "1px solid #fff",
                                    zIndex: "-1"
                                }} />
                            <div
                                style={{
                                    position: "absolute",
                                    right: "-64px",
                                    bottom: "-79px",
                                    height: "150px",
                                    width: "75px",
                                    transform: "rotate(-45deg)",
                                    backgroundColor: "#374785",
                                    border: "1px solid #fff",
                                    zIndex: "-1"
                                }} />

                            <Menu
                                anchorEl={this.state.anchor.task}
                                anchorOrigin={{
                                    vertical: "center",
                                    horizontal: "center"
                                }}
                                id="CreateMenu"
                                onClose={() => this.setState({ anchor: { task: null } })}
                                open={Boolean(this.state.anchor.task)}
                                transformOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center"
                                }} >
                                {this.state.selected.length < 2 &&
                                    <MenuItem
                                        onClick={() => this.modal.create.open(0)} >
                                        Open Text
                                    </MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem
                                        onClick={() => this.modal.create.open(1)} >
                                        Multiple Choice
                                    </MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem
                                        onClick={() => this.modal.create.open(2)} >
                                        Points
                                    </MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem
                                        onClick={() => this.modal.create.open(3)} >
                                        Slider
                                    </MenuItem>}
                            </Menu>
                        </ButtonToolbar>
                        {task.Options !== undefined &&
                            task.Options.map(option =>
                                <ResultSlider
                                    average={option.Average}
                                    checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                                    color={option.Color}
                                    description={
                                        option.Description}
                                    id={option.Index}
                                    index={option.Index}
                                    max={task.Max}
                                    maxDescription={task.MaxDescription}
                                    min={task.Min}
                                    minDescription={task.MinDescription}
                                    onClick={Select}
                                    title={option.Title}
                                    vote />
                            )}
                    </ContentBody>
                </MainContainer>
            );
        };

        if (!this.state.overview && this.props.tasks[this.props.active])
        {
            const Task = this.props.tasks[this.props.active];
            if (this.props.active !== this.state.previous)
            {
                this.setState({
                    selected: [],
                    previous: this.props.active
                });
            }

            if (Task.Type === 0)
                return Text(Task);
            else if (Task.Type === 1)
                return MultipleChoice(Task);
            else if (Task.Type === 2)
                return Points(Task);
            else
                return Slider(Task);
        }
        else
        {
            if (this.state.overview)
            {
                this.setState({
                    overview: false
                });
            }

            return (
                <MainContainer>
                    <ContentHeader>
                    </ContentHeader>
                    <ContentBody>
                        Hey
                    </ContentBody>
                </MainContainer>
            );
        }
    }
}