import React, { Component, useRef, createRef } from "react";
import Axios from "axios";
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import { PageModal } from "../../Services/PageModal";
import { Input, InputDetails } from "./Components/Input";
import { Group } from "./Components/Group";
import { Column } from "./Components/Column";
import { ResultBackground, ResultItem, ResultSlider } from "./Components/Results";
import { CreateTaskModal } from "./Components/CreateModal";
import { ContextMenu } from "./Components/ContextMenu";
import { Tooltip, Collapse, IconButton, Menu, MenuItem } from "@material-ui/core";
import { InputModal } from "./Components/InputModal";
import CreateIcon from "@material-ui/icons/Create";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import AllOutIcon from "@material-ui/icons/AllOut";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import CallMergeIcon from "@material-ui/icons/CallMerge";
import ArchiveIcon from "@material-ui/icons/Archive";

const MainContainer = Styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 0;
    background: #E4E4E4;
    top: 0;
    left 0;

    scrollbar-width: thin;
    scrollbar-color: #575b75 #fff;
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

    ${props => props.disabled
        ? ""
        : `&&& {
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

const AnswerButton = Styled(Nav.Link)`
    color: #fff;
    background: #575b75;
    font-family: CircularStd;
    font-weight: 400;
    font-size: 1rem;
    padding: 0 1rem;
    text-align: center;
    border: 2px solid #fff;
    border-right: 0;
    min-width: 150px;
    flex: 1 1 auto;
    height: 100%;
    line-height: 25px;

    &:hover {
        color: #ddd;
        filter: brightness(150%);
        cursor: pointer;
    }

    &:active {
        color: #fff;
        filter: brightness(75%);
    }

    &:disabled {
        color: #fff;
        border-width: 1px
    }
`;

const SendToMC = Styled(Nav.Link)`
    color: #fff;
    background: #575b75;
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
    left:0;
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
`;

export class Organizer extends Component {
    constructor(props) {
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
            anchor: null,

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

        //Contains all the modal's
        this.modal = {
            answer: {
                open: () => {
                    this.setState({
                        modal: {
                            answer: true
                        }
                    });
                },

                close: () => {
                    this.setState({
                        modal: {
                            string: "",
                            answer: false
                        }
                    });
                }
            },

            rename: {
                open: (event) => {
                    const Key = event.target.id.split("-");
                    let Title;

                    if (Key.indexOf("title") !== -1) {
                        Title = this.props.tasks[this.props.active].Groups[Key[0]].Title;
                    }
                    else {
                        Title = this.props.tasks[this.props.active].Groups[Key[0]].Members[Key[1]].Title;
                    }

                    this.setState({
                        modal: {
                            rename: true,
                            key: Key,
                            string: Title
                        }
                    });
                },

                content: () => {
                    const Rename = (e) => {
                        e.preventDefault();
                        const Code = sessionStorage.getItem("code");
                        const Key = this.state.modal.key;
                        const Title = {
                            Title: this.state.modal.string
                        };
                        if (Key.indexOf("title") !== -1) {
                            Axios.post(`admin/${Code}/question-rename-group-${Key[0]}`, Title);
                        }
                        else {
                            Axios.post(`admin/${Code}/question-rename-member-${Key[0]}-${Key[1]}`, Title);
                        }

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
                        <Form autoComplete="off"
                            onSubmit={Rename.bind(this)}>
                            <NewOptionNumber>Title</NewOptionNumber>
                            <Form.Group controlId="validateTitle">
                                <InputGroup>
                                    <Form.Control defaultValue={this.state.modal.string
                                    }
                                        name="title"
                                        onChange={HandleTitle.bind(this)}
                                        placeholder="Input Title.."
                                        ref="title"
                                        required />
                                </InputGroup>
                            </Form.Group>
                            <CancelButton onClick={this.modal.rename.close}>Cancel</CancelButton>
                            <CreateButton type="submit"
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
                        anchor: null
                    });
                },

                close: (success) => {
                    this.setState({
                        modal: {
                            create: false,
                            type: 1
                        },
                        selected: []
                    });

                    if (success === true) {
                        this.props.update(true);
                    }
                }
            },

            details: {
                open: (id) => {
                    console.log(id);
                    const Key = id.split("-");
                    console.log(Key);
                    const Answer = this.props.tasks[this.props.active].Groups[Key[0]].Members[Key[1]];
                    Answer.group = Key[0];
                    this.setState({
                        details: {
                            answer: Answer,
                            open: true
                        }
                    });
                },

                close: () => {
                    this.setState({
                        details: {
                            answer: null,
                            open: false
                        }
                    });
                }
            }
        };
    }

    async componentDidMount() {
        document.addEventListener("contextmenu",
            (event) => {
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
                    (event.key === "R" || event.key === "r")) {
                    this.setState({
                        selected: [],
                        anchor: null
                    });
                }
            });
        this.AutoResultToggle();
    }

    async AutoResultToggle() {
        await setTimeout(() => {
            this.setState({
                resultsAsPercentage: !this.state.resultsAsPercentage
            });
            this.AutoResultToggle();
        },
            6660);
    }

    componentWillUnmount() { }

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

    render() {
        const Text = (task) => {
            const Shrink = (key) => {
                const Columns = this.props.columns;

                if (Columns[key] !== undefined) {
                    Columns[key].width !== undefined
                        ? Columns[key].width -= 1
                        : Columns[key].width = 1;
                }

                this.setState({
                    columns: Columns
                });
            };

            const Grow = (key) => {
                const Columns = this.props.columns;

                if (Columns[key] !== undefined) {
                    Columns[key].width !== undefined
                        ? Columns[key].width += 1
                        : Columns[key].width = 1;
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
                if (this.state.selected.indexOf(Key) === -1) {
                    let Selected = this.state.selected;

                    Selected
                        ? Selected.push(Key)
                        : Selected = [Key];
                    this.setState({
                        selected: Selected
                    });
                }
                else {
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

                    if (this.state.selected.indexOf(Key) === -1) {
                        Select(Key);
                    }
                    else {
                        CountSelected += 1;
                    }
                });

                if (task.Groups[id].Members.length === CountSelected) {
                    task.Groups[id].Members.forEach((member) => {
                        const Key = `${id}-${member.Index}`;
                        Select(Key);
                    });
                }
            };

            const GetSelected = () => {
                const Selected = [];
                const Keys = [];
                for (let I = 0; I < this.state.selected.length; I++) {
                    const Key = this.state.selected[I].split("-");
                    const Answer = task.Groups[Key[0]].Members[Key[1]];
                    if (Answer !== undefined) {
                        Selected.push(this.state.selected[I]);
                        Keys.push(Key);
                    }
                }

                this.setState({ selected: Selected });

                const Compare = (a, b) => {
                    const Group = b[0] - a[0];

                    if (Group === 0) {
                        return b[1] - a[1];
                    }
                    else {
                        return Group;
                    }
                };
                return Keys.sort(Compare);
            };

            const GetOptions = () => {
                const Options = [];
                const Selected = GetSelected();
                for (let I = 0; I < Selected.length; I++) {
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
                if (!this.state.selected || this.state.selected.length <= 1) {
                    return;
                }

                const Code = sessionStorage.getItem("code");
                const Selected = GetSelected();

                const Master = Selected[Selected.length - 1];

                //let change = [];

                for (let I = 0; I < (Selected.length - 1); I++) {
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

                    //let change = []

                    for (let I = 0; I < Selected.length; I++) {
                        const Subject = Selected[I];

                        await setTimeout(
                            Axios.post(`admin/${Code}/question-archive-member-${Subject[0]}-${Subject[1]}`),
                            500);
                    }

                    this.setState({
                        selected: []
                    });
                }
            };

            const Duplicate = async () => {
                const Code = sessionStorage.getItem("code");
                const Options = GetOptions();

                Options.forEach(async option => {
                    await setTimeout(Axios.post(`client/${Code}/add-text-open`, option), 500);
                });

                this.setState({
                    selected: []
                });
            };

            const Meny = [
                { "label": "Write input", "callback": this.modal.answer.open },
                { "label": "Duplicate selected input", "callback": Duplicate },
                { "label": "Merge selected inputs", "callback": Merge },
                { "label": "Create vote from selected inputs", "callback": this.modal.create.open },
                { "label": "Remove selected inputs", "callback": Archive.members }
            ];

            return (
                <MainContainer>
                    <ContentHeader>
                        <Tools showControls={this.props.showControls}>
                            <AnswerButton draggable="false"
                                onClick={this.modal.answer.open
                                }>
                                <CreateIcon className="icon" />
                                <br />Write input
                            </AnswerButton>
                            <MergeButton disabled
                                draggable="false">
                                <AllInclusiveIcon className="icon" />
                                <br />Select All
                            </MergeButton>
                            <AnswerButton draggable="false"
                                onClick={() => this.setState({ selected: [] })
                                }>
                                <AllOutIcon className="icon" />
                                <br />Deselect All
                            </AnswerButton>
                            <MergeButton draggable="false"
                                onClick={Merge}>
                                <CallMergeIcon className="icon" />
                                <br />Merge
                            </MergeButton>
                            <AnswerButton draggable="false"
                                onClick={Duplicate}>
                                <FileCopyIcon className="icon" />
                                <br />Duplicate
                            </AnswerButton>
                            <MergeButton draggable="false"
                                onClick={Archive.members}>
                                <ArchiveIcon className="icon" />
                                <br />Archive
                            </MergeButton>
                        </Tools>
                    </ContentHeader>
                    <ContentBody>
                        <ButtonToolbar disabled={this.state.selected.length < 1}>
                            <SendToMC disabled={this.state.selected.length < 1}
                                draggable="false"
                                onClick={(e) => this.setState({ anchor: e.currentTarget })}>
                                Send selected to new task
                            </SendToMC>
                            <div style={{
                                position: "absolute",
                                left: "-64px",
                                bottom: "-79px",
                                height: "150px",
                                width: "75px",
                                transform: "rotate(45deg)",
                                backgroundColor: "#575b75",
                                border: "1px solid #fff",
                                zIndex: "-1"
                            }} />
                            <div style={{
                                position: "absolute",
                                right: "-64px",
                                bottom: "-79px",
                                height: "150px",
                                width: "75px",
                                transform: "rotate(-45deg)",
                                backgroundColor: "#575b75",
                                border: "1px solid #fff",
                                zIndex: "-1"
                            }} />

                            <Menu anchorEl={this.state.anchor}
                                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                                id="CreateMenu"
                                onClose={() => this.setState({ anchor: null })}
                                open={
                                    Boolean(this.state.anchor)}
                                transformOrigin={
                                    { vertical: "bottom", horizontal: "center" }}>
                                {this.state.selected.length < 2 &&
                                    <MenuItem onClick={() => this.modal.create.open(0)}>Open Text</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(1)}>Multiple Choice</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(2)}>Points</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(3)}>Slider</MenuItem>}
                            </Menu>
                        </ButtonToolbar>

                        {this.props.columns !== undefined &&
                            this.props.columns.map(column =>
                                <Column column={column.index} width={column.width}
                                    last={column.index + 1 === this.props.columns.length}
                                    grow={() => Grow(column.index)}
                                    shrink={() => Shrink(column.index)}>

                                    {task.Groups !== undefined &&
                                        task.Groups.map(group => {
                                            if (column.index === group.Column) {
                                                return (
                                                    <Group id={group.Index} key={group.Index} onClick={GroupSelect}
                                                        group={group.Index} column={group.Column}
                                                        title={group.Title} size={column.width}
                                                        double={this.modal.rename.open}
                                                        color={group.Color} collapsed={group.Collapsed}>

                                                        {group.Members !== undefined &&
                                                            group.Members.map(member =>
                                                                <Input id={group.Index + "-" + member.Index} key={member.Index}
                                                                    member={member.Index} group={group.Index}
                                                                    column={group.Column} title={member.Title} size={column.width}
                                                                    double={this.modal.details.open} description={member.Description}
                                                                    checked={this.state.selected.indexOf(group.Index + "-" + member.Index) !== -1}
                                                                    onClick={Select}
                                                                    isMerged={member.Children != undefined
                                                                        ? member.Children.length
                                                                        : 0}
                                                                />
                                                            )}
                                                    </Group>
                                                );
                                            }
                                            else {
                                                return null;
                                            }
                                        }
                                        )}

                                    {column.index + 1 === this.props.columns.length &&
                                        <Group id="new" color="#575b75"
                                            group="new" column={column.index} title="CREATE NEW GROUP" size={column.width}
                                            onClick={CreateGroup.bind(this)}
                                        />
                                    }
                                </Column>
                            )
                        }
                        <ContextMenu items={Meny}
                            visible={this.state.menu.visible}
                            x={this.state.menu.x}
                            y={this.state.menu.y} />
                        {this.state.modal.answer &&
                            <InputModal title="Write Input" onClose={this.modal.answer.close.bind(this)} />}
                        {this.state.modal.rename &&
                            <PageModal title="Rename" body={this.modal.rename.content()} onClose={this.modal.rename.close.bind(this)} />}
                        {this.state.modal.create &&
                            <CreateTaskModal type={this.state.modal.type}
                                title={task.Groups[this.state.selected[0].split("-")[0]].Members[this.state.selected[0].split("-")[1]].Title}
                                options={GetOptions} onClose={this.modal.create.close.bind(this)} />}
                        {this.state.details.open &&
                            <InputDetails answer={this.state.details.answer} close={this.modal.details.close} rename={this.modal.rename.open} />}
                    </ContentBody>
                </MainContainer >
            );
        };

        const MultipleChoice = (task) => {
            const Select = (key) => {
                if (this.state.selected.indexOf(key) === -1) {
                    const Selected = this.state.selected;
                    Selected.push(key);
                    this.setState({
                        selected: Selected
                    });
                }
                else {
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

                for (let I = 0; I < Selected.length; I++) {
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

            return (
                <MainContainer>
                    <ContentHeader>
                    </ContentHeader>
                    <ContentBody>
                        {this.state.modal.create &&
                            <CreateTaskModal type={this.state.modal.type} title={
                                task.Options[parseInt(this.state.selected[0])].Description} options={GetOptions} onClose={
                                    this.modal.create.close.bind(this)} />}

                        <ButtonToolbar disabled={this.state.selected.length < 1}>
                            <SendToMC disabled={this.state.selected.length < 1}
                                draggable="false"
                                onClick={(e) =>
                                    this.setState({ anchor: e.currentTarget })}>
                                Send selected to new task
                            </SendToMC>
                            <div style={{
                                position: "absolute",
                                left: "-64px",
                                bottom: "-79px",
                                height: "150px",
                                width: "75px",
                                transform: "rotate(45deg)",
                                backgroundColor: "#575b75",
                                border: "1px solid #fff",
                                zIndex: "-1"
                            }} />
                            <div style={{
                                position: "absolute",
                                right: "-64px",
                                bottom: "-79px",
                                height: "150px",
                                width: "75px",
                                transform: "rotate(-45deg)",
                                backgroundColor: "#575b75",
                                border: "1px solid #fff",
                                zIndex: "-1"
                            }} />

                            <Menu anchorEl={this.state.anchor}
                                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                                id="CreateMenu"
                                onClose={() => this.setState({ anchor: null })}
                                open={
                                    Boolean(this.state.anchor)}
                                transformOrigin={
                                    { vertical: "bottom", horizontal: "center" }}>
                                {this.state.selected.length < 2 &&
                                    <MenuItem onClick={() => this.modal.create.open(0)}>Open Text</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(1)}>Multiple Choice</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(2)}>Points</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(3)}>Slider</MenuItem>}
                            </Menu>
                        </ButtonToolbar>
                        <ResultBackground style={{ width: "95%", height: "80%" }} />
                        {task.Options !== undefined &&
                            task.Options.map(option =>
                                <ResultItem id={option.Index} id={option.Index} index={option.Index} title={option.Title
                                } color={option.Color} description={option.Description}
                                    vote height="80%" total={task.Options.length}
                                    checked={this.state.selected.indexOf(option.Index.toString()) !== -1} onClick={Select}
                                    percentage={((option.Votes.length / task.TotalVotes) * 100)} points={option.Votes.length
                                    } showPercentage={this.state.resultsAsPercentage}
                                />
                            )}
                    </ContentBody>
                </MainContainer>
            );
        };

        const Points = (task) => {
            const Select = (key) => {
                if (this.state.selected.indexOf(key) === -1) {
                    const Selected = this.state.selected;
                    Selected.push(key);
                    this.setState({
                        selected: Selected
                    });
                }
                else {
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
                for (let I = 0; I < Selected.length; I++) {
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

            return (
                <MainContainer>
                    <ContentHeader>
                    </ContentHeader>
                    <ContentBody>
                        {this.state.modal.create &&
                            <CreateTaskModal type={this.state.modal.type} title={
                                task.Options[parseInt(this.state.selected[0])].Description} options={GetOptions} onClose={
                                    this.modal.create.close.bind(this)} />}

                        <ButtonToolbar disabled={this.state.selected.length < 1}>
                            <SendToMC disabled={this.state.selected.length < 1}
                                draggable="false"
                                onClick={(e) =>
                                    this.setState({ anchor: e.currentTarget })}>
                                Send selected to new task
                            </SendToMC>
                            <div style={{
                                position: "absolute",
                                left: "-64px",
                                bottom: "-79px",
                                height: "150px",
                                width: "75px",
                                transform: "rotate(45deg)",
                                backgroundColor: "#575b75",
                                border: "1px solid #fff",
                                zIndex: "-1"
                            }} />
                            <div style={{
                                position: "absolute",
                                right: "-64px",
                                bottom: "-79px",
                                height: "150px",
                                width: "75px",
                                transform: "rotate(-45deg)",
                                backgroundColor: "#575b75",
                                border: "1px solid #fff",
                                zIndex: "-1"
                            }} />

                            <Menu anchorEl={this.state.anchor}
                                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                                id="CreateMenu"
                                onClose={() => this.setState({ anchor: null })}
                                open={
                                    Boolean(this.state.anchor)}
                                transformOrigin={
                                    { vertical: "bottom", horizontal: "center" }}>
                                {this.state.selected.length < 2 &&
                                    <MenuItem onClick={() => this.modal.create.open(0)}>Open Text</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(1)}>Multiple Choice</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(2)}>Points</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(3)}>Slider</MenuItem>}
                            </Menu>
                        </ButtonToolbar>
                        <ResultBackground style={{ width: "95%", height: "80%" }} />
                        {task.Options !== undefined &&
                            task.Options.map(option =>
                                <ResultItem id={option.Index} id={option.Index} index={option.Index} title={option.Title
                                } color={option.Color} description={option.Description}
                                    vote height="80%" total={task.Options.length}
                                    checked={this.state.selected.indexOf(option.Index.toString()) !== -1} onClick={Select}
                                    percentage={((option.Points / (task.Votes.length * task.Amount)) * 100)} points={
                                        option.Points} showPercentage={this.state.resultsAsPercentage}
                                />
                            )}
                    </ContentBody>
                </MainContainer>
            );
        };

        const Slider = (task) => {
            const Select = (key) => {
                if (this.state.selected.indexOf(key) === -1) {
                    const Selected = this.state.selected;
                    Selected.push(key);
                    this.setState({
                        selected: Selected
                    });
                }
                else {
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
                for (let I = 0; I < Selected.length; I++) {
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
            return (
                <MainContainer>
                    <ContentHeader>
                    </ContentHeader>
                    <ContentBody>
                        {this.state.modal.create &&
                            <CreateTaskModal type={this.state.modal.type} title={
                                task.Options[parseInt(this.state.selected[0])].Description} options={GetOptions} onClose={
                                    this.modal.create.close.bind(this)} />}
                        <ButtonToolbar disabled={this.state.selected.length < 1}>
                            <SendToMC disabled={this.state.selected.length < 1}
                                draggable="false"
                                onClick={(e) =>
                                    this.setState({ anchor: e.currentTarget })}>
                                Send selected to new task
                            </SendToMC>
                            <div style={{
                                position: "absolute",
                                left: "-64px",
                                bottom: "-79px",
                                height: "150px",
                                width: "75px",
                                transform: "rotate(45deg)",
                                backgroundColor: "#575b75",
                                border: "1px solid #fff",
                                zIndex: "-1"
                            }} />
                            <div style={{
                                position: "absolute",
                                right: "-64px",
                                bottom: "-79px",
                                height: "150px",
                                width: "75px",
                                transform: "rotate(-45deg)",
                                backgroundColor: "#575b75",
                                border: "1px solid #fff",
                                zIndex: "-1"
                            }} />

                            <Menu anchorEl={this.state.anchor}
                                anchorOrigin={{ vertical: "center", horizontal: "center" }}
                                id="CreateMenu"
                                onClose={() => this.setState({ anchor: null })}
                                open={Boolean(this.state.anchor)}
                                transformOrigin={{ vertical: "bottom", horizontal: "center" }}>
                                {this.state.selected.length < 2 &&
                                    <MenuItem onClick={() => this.modal.create.open(0)}>Open Text</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(1)}>Multiple Choice</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(2)}>Points</MenuItem>}
                                {this.state.selected.length > 1 &&
                                    <MenuItem onClick={() => this.modal.create.open(3)}>Slider</MenuItem>}
                            </Menu>
                        </ButtonToolbar>
                        {task.Options !== undefined &&
                            task.Options.map(option =>
                                <ResultSlider id={option.Index} index={option.Index} title={option.Title} description={
                                    option.Description} vote
                                    average={option.Average} min={task.Min} max={task.Max} color={option.Color}
                                    checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                                    onClick={Select} minDescription={task.MinDescription} maxDescription={task.MaxDescription}
                                />
                            )}
                    </ContentBody>
                </MainContainer>
            );
        };

        if (!this.state.overview && this.props.tasks[this.props.active]) {
            const Task = this.props.tasks[this.props.active];
            if (this.props.active !== this.state.previous) {
                this.setState({
                    selected: [],
                    previous: this.props.active
                });
            }

            if (Task.Type === 0) {
                return Text(Task);
            }
            else if (Task.Type === 1) {
                return MultipleChoice(Task);
            }
            else if (Task.Type === 2) {
                return Points(Task);
            }
            else {
                return Slider(Task);
            }
        }
        else {
            if (this.state.overview) {
                this.setState({ overview: false });
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