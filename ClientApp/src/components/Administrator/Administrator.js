import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Tasks } from './Tabs/Tasks';
import { Organizer } from './Tabs/Organizer';
import { Presentation } from './Presentation';
import { Breadcrumbs, Link, Typography, Tooltip, Menu, MenuItem, Divider } from '@material-ui/core';
import { Facilitator } from '../Big Screen/Facilitator';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { BsJustify } from 'react-icons/bs';
import BannerDropdown, { BannerLink } from '../Classes/Dropdown';
import { CreateTaskModal } from './Tabs/Components/CreateModal';
import { Collection, Task } from './Tabs/Components/Task';
import { BigScreen } from '../Big Screen/BigScreen';

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
    background: #575b75;
    height: 5%;
    width: 100%;
    min-height: 50px;
    top: 0;
    left: 0;
    z-index: 11;
`;

const BreadCrumb = styled(Breadcrumbs)`
     &&& {
        font-family: CircularStd;
        font-Size: 1.25rem;
        color: #fff;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
    }
`;

const BreadText = styled(Link)`
    color: #fff;
    font-size: 1.25rem;
`;

const BannerCode = styled.div`
    font-family: CircularStd;
    font-Size: 1.25rem;
    display: inline-block;
    color: #fff;
    top: 50%;
    left: 50%;
    position: absolute;
    margin-right: 20px;
    transform: translate(-50%, -50%);
    text-align: center;
`;

const BannerButton = styled(DropdownButton)`
    background: #fff;
    border-radius: 5%;
    color: #100E0E;

    font-family: CircularStd;
    font-weight: 450;
    font-size: 1rem;
    width: 8%;
    height: 50%;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
    position: relative;
    float: right;

    margin: 0px 1%;

    button {
        text-align:center;
        vertical-align: center;
        background: none;
        border: none;

        font-family: CircularStd;
        font-weight: 450;
        font-size: 1rem;

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

const HeaderTabs = styled(Nav)`
    position: relative;
    height: 100%;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    padding-left: 2.5%;
    .nav-link {
        min-width: 200px;
        position: relative;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
        height: 100%;
        color: black;
        font-family: CircularStd;
        font-weight: 600;
        font-size: 1rem;
        margin: 0;
        padding: 0;
        line-height: 50px;

        &:hover {
            border: 0;
            background: #575b75;
            color: #fff;
            border-top: 2px solid #fff;
        }

        &.active {
            border: 0;
            opacity: 100%;
            color: black;
            border-bottom: 3px solid #575b75;
            cursor: default;
            background: #FFF;
        };
    };
`;

const ContentCard = styled(Card)`
    position: absolute;
    top: calc(max(5%, 50px));
    width: 100%;
    left: 0;
    height: calc(100% - 50px);
    padding: 0;
    background: #e4e4e4;
    max-height: 95%;
    border: 0;
`;

const ContentHeader = styled(Card.Header)`
    width: 100%;
    background: #fff;
    height: 50px;
    top: 0;
    position: absolute;
    margin: 0;
    padding: 0;
    border: 0;
`;

const ContentBody = styled(Card.Body)`
    border: 0;
    background: #E4E4E4;
    position: absolute;
    top: 50px;
    width: 100%;
    height: calc(100% - 50px);
    padding: 0;
`;

const SlideContainer = styled.div`
    top: 2%;
    transform: translateY(-1%);
    display: inline-block;
    position: absolute;
    left: max(27%, calc(400px + 2%));
    width: calc(97% - max(400px, 25%));
    height: 98%;
    border: 1px solid #575b75;
    overflow: hidden;
`;

const SelectedSlide = styled.div`
    position: relative;
    width: 100%;
    background: #fff;
    height: 100%;
    border-radius: 10px;
`;

const Viewer = styled(BigScreen)`
    position: absolute;
`;

const DivButton = styled.div`
    &:hover {
        color: #ddd;
        filter: brightness(150%);
        cursor: pointer;
    }

    &:active {
        color: #fff;
        filter: brightness(75%);
    }
`;

export class Administrator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            code: 0,
            tasks: [],
            columns: [],
            active: 0,

            tab: 'organize',
            presentor: null,

            results: true,
            showList: true,
            showControls: true,

            modal: {
                create: false,
                type: 0,
            }
        }

        this.present = this.present.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        let code = sessionStorage.getItem("code");
        let title = sessionStorage.getItem("title");
        let presentManager = new Presentation(code);

        document.addEventListener("keypress", (e) => {
            if (e.key == "|") {
                this.setState({
                    showList: !this.state.showList,
                    showControls: !this.state.showList
                });
            }
        })

        this.setState({
            title: title,
            code: code,
            presentor: presentManager,
        });
        this.update();
    }

    componentWillUnmount() {
        this.SSE.close();
        const code = sessionStorage.getItem('code');
        axios.post(`admin/${code}/close`);
    }

    update = async () => {
        this.SSE.close();
        const code = sessionStorage.getItem('code');
        await axios.get(`admin/${code}/questions-all`).then((res) => {
            if (res.status === 202) {
                this.setState({
                    tasks: res.data,
                });

                axios.post(`admin/${code}/save`);

                if (this.state.active < this.state.tasks.length)
                    this.SSE.start(this.state.active);
                else if (this.state.tasks.length > 0)
                    this.SSE.start(0);
            } else if (res.status === 412) {

                //session not found
            }
        })
    }

    SSE = {
        source: undefined,

        addColumn: () => {
            let column = {
                index: this.state.columns.length,
                width: 1,
            }

            let columns = this.state.columns;

            columns !== undefined ? columns.push(column) : columns = [column];
            this.setState({
                columns: columns,
            });
        },

        start: (target) => {
            if (target >= this.state.tasks.length || target < 0)
                return;

            this.SSE.close();
            const code = sessionStorage.getItem('code');
            this.setState({
                active: target,
            });

            axios.post(`admin/${code}/active-${target}`);
            this.SSE.source = new EventSource(`admin/${code}/stream-question-${target}`);
            this.SSE.source.addEventListener("Groups", (e) => {
                try {
                    var data = JSON.parse(e.data);
                    var tasks = this.state.tasks;
                    tasks[target].Groups = data;
                    let columns = this.state.columns;
                    this.state.columns = [];
                    if (tasks[target].Groups !== undefined) {
                        for (let i = 0; i < tasks[target].Groups.length; i++) {
                            while (tasks[target].Groups[i].Column + 1 >= this.state.columns.length) {
                                this.SSE.addColumn();
                            }
                        }
                    } else {
                        this.SSE.addColumn();
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
                        tasks: tasks,
                    })
                } catch (e) {
                    console.log("Failed to parse server event: " + e.data);
                    console.log(e);
                }
            }, false);

            this.SSE.source.addEventListener("Options", (e) => {
                try {
                    var data = JSON.parse(e.data);
                    var tasks = this.state.tasks;
                    tasks[target].Options = data;

                    //if (tasks[target].options !== undefined) {
                    //    tasks[target].options.sort((a, b) => (a.Votes.length > b.Votes.length) ? -1 : 1);
                    //}
                    this.setState({
                        tasks: tasks,
                    })
                } catch (e) {
                    console.log("Failed to parse server event: " + e.data);
                    console.log(e);
                }
            }, false);

            this.SSE.source.addEventListener("Total", (e) => {
                try {
                    var data = JSON.parse(e.data);
                    var tasks = this.state.tasks;
                    tasks[target].TotalVotes = data;
                    this.setState({
                        tasks: tasks,
                    })
                } catch (e) {
                    console.log("Failed to parse server event: " + e.data);
                    console.log(e);
                }
            }, false);

            this.SSE.source.addEventListener("Votes", (e) => {
                try {
                    let votes = JSON.parse(e.data);
                    let tasks = this.state.tasks;
                    tasks[target].Votes = votes;
                    this.setState({
                        tasks: tasks,
                    });
                } catch (e) {
                    console.log("Failed to parse server event: Votes");
                    console.log(e);
                }
            });

            this.SSE.source.addEventListener("Amount", (e) => {
                try {
                    let amount = JSON.parse(e.data);
                    let tasks = this.state.tasks;
                    tasks[target].Amount = amount;
                    this.setState({
                        tasks: tasks,
                    });
                } catch (e) {
                    console.log("Failed to parse server event: Votes");
                    console.log(e);
                }
            });

            this.SSE.source.addEventListener("Archive", (e) => {
                try {
                    var data = JSON.parse(e.data);
                    var tasks = this.state.tasks;
                    tasks[target].Archive = data;
                    this.setState({
                        tasks: tasks,
                    })
                } catch (e) {
                    console.log("Failed to parse server event: " + e.data);
                    console.log(e);
                }
            }, false);

            this.SSE.source.addEventListener("error", (e) => {
                if (e.readyState == EventSource.CLOSED) {
                    console.log("SSE: connection closed");
                    this.SSE.start(this.state.active);
                } else {
                    console.log(e);
                }
            }, false);

            this.SSE.source.addEventListener("open", (e) => {
                console.log("SSE: connection opened");
            }, false);
        },

        close: () => {
            if (this.SSE.source !== undefined && this.SSE.source.readyState != EventSource.CLOSED)
                this.SSE.source.close();
        },
    }

    selectTab(key) {
        this.setState({
            tab: key,
        });
    }

    present = () => {
        let state = this.state;
        let presentor = state.presentor;

        presentor.PresentInNewWindow();
    }

    logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
    }

    controls = {
        next: () => {
            let index = this.state.active + 1;
            if (index < this.state.tasks.length) {
                this.SSE.start(index);
            }
        },

        back: () => {
            let index = this.state.active - 1;
            if (index >= 0) {
                this.SSE.start(index);
            }
        },
    }

    create = {
        close: (success) => {
            this.setState({
                modal: {
                    create: false,
                    type: null,
                }
            });

            if (success == true) {
                this.update();
            }
        },

        text: () => {
            this.setState({
                modal: {
                    create: true,
                    type: 0,
                },
                anchor: null,
            })
        },

        multipleChoice: () => {
            this.setState({
                modal: {
                    create: true,
                    type: 1,
                },
                anchor: null,
            })
        },

        points: () => {
            this.setState({
                modal: {
                    create: true,
                    type: 2,
                },
                anchor: null,
            })
        },

        slider: () => {
            this.setState({
                modal: {
                    create: true,
                    type: 3,
                },
                anchor: null,
            })
        },

        menu: (event) => {
            this.setState({
                anchor: event.currentTarget,
            });
        }
    }

    render() {
        return (
            <MainContainer>

                <Banner>
                    <BreadCrumb aria-label="Breadcrumb" separator="&#187;">
                        <BreadText color="initial" href="/">Coboost</BreadText>
                        <BreadText color="initial" href="/dashboard">Sessions</BreadText>
                        <BreadText color="initial" href="#" onClick={(e) => { e.preventDefault(); this.state.tab == "task" ? this.selectTab("organize") : this.selectTab("task") }}>{this.state.title}</BreadText>
                    </BreadCrumb>

                    <BannerDropdown title={<BsJustify />} style={{ float: "right", position: "relative", top: "50%", transform: "translateY(-50%)" }}>
                        <BannerLink onClick={this.logout}>Logout</BannerLink>
                    </BannerDropdown>

                    <BannerDropdown title="Presentation" style={{ float: "right", position: "relative", top: "50%", transform: "translateY(-50%)" }}>
                        <BannerLink disabled>Presentation Mode</BannerLink>
                        <BannerLink onClick={this.present}>Present in a new window</BannerLink>
                        <BannerLink disabled>Mirror Screen</BannerLink>
                        <BannerLink disabled>Get Presentation Link</BannerLink>
                    </BannerDropdown>
                    <BannerCode>{this.state.code > 0 ? "Event code: " + this.state.code.substr(0, 3) + " " + this.state.code.substr(3, 3) : null}</BannerCode>
                </Banner>

                <ContentCard>
                    <Tab.Container activeKey={this.state.tab} onSelect={(k) => this.selectTab(k)}>

                        <ContentHeader>
                            <div style={{ width: this.state.showList || this.state.showControls ? "calc(25% + 50px)" : "50px", left: "0", position: "absolute", height: "100%", overflow: "hidden" }}>
                                <Facilitator style={{ position: "absolute", top: "0px", left: "0", height: "50px", width: this.state.showList || this.state.showControls ? "calc(100% - 50px)" : "0" }} next={this.controls.next} back={this.controls.back} active={this.state.active} showingResult={this.state.results} onResultToggle={() => { this.setState({ results: !this.state.results, }) }} code={this.state.code} />
                                <DivButton onClick={() => { this.state.showList ? this.setState({ showList: false, showControls: false }) : this.setState({ showControls: !this.state.showControls }) }} style={{ width: "50px", right: "0", position: "absolute", height: "100%", backgroundColor: "#414458", color: "#ffffff", border: "1px solid #fff" }}>{this.state.showList || this.state.showControls ? <MenuOpenIcon style={{ width: "100%", height: "100%", position: "absolute", top: "0", left: "0" }} className="icon" /> : <MenuIcon style={{ width: "100%", height: "100%", position: "absolute", top: "0", left: "0" }} className="icon" />}</DivButton>
                            </div>

                            <DivButton onClick={() => { this.state.tab == "task" ? this.selectTab("organize") : this.selectTab("task") }} style={{ width: "200px", right: "0", bottom: "0", position: "absolute", height: "100%", backgroundColor: "#414458", color: "#ffffff", fontSize: "1rem", fontWeight: "600", lineHeight: "50px", textAlign: "center", border: "1px solid #fff" }}>Presenter Screen</DivButton>
                        </ContentHeader>
                        <ContentBody>

                            { /* This is the task list */}
                            <div style={{ width: this.state.showList ? "calc(25% + 50px)" : "50px", left: "0", position: "absolute", height: "100%" }}>
                                {this.state.modal.create && <CreateTaskModal type={this.state.modal.type} onClose={this.create.close} />}
                                <Menu anchorOrigin={{ vertical: "bottom", horizontal: "center" }} transformOrigin={{ vertical: "bottom", horizontal: "center" }} id="CreateMenu" anchorEl={this.state.anchor} open={Boolean(this.state.anchor)} onClose={() => this.setState({ anchor: null })}
                                >
                                    <MenuItem onClick={this.create.text}>Input: Open Text</MenuItem>
                                    <Divider />
                                    <MenuItem onClick={this.create.multipleChoice}>Vote: Multiple Choice</MenuItem>
                                    <Divider />
                                    <MenuItem onClick={this.create.points}>Vote: Points</MenuItem>
                                    <Divider />
                                    <MenuItem onClick={this.create.slider}>Vote: Slider</MenuItem>
                                </Menu>
                                <Collection shown={this.state.showList} createTask={(event) => this.create.menu(event)} update={this.update.bind(this)}>
                                    {this.state.tasks != undefined && this.state.tasks.map(task =>
                                        <Task key={task.Index} id={task.Index} update={this.update.bind(this)}
                                            onClick={(e) => this.SSE.start(e.target.id)} active={this.state.active == task.Index}
                                            type={task.Type} title={task.Title}
                                        />
                                    )}
                                </Collection>
                                <DivButton onClick={() => { this.state.showList ? this.setState({ showList: false, showControls: true }) : this.setState({ showList: !this.state.showList }) }} style={{ width: "50px", right: "0", position: "absolute", height: "100%", backgroundColor: "#414458", color: "#ffffff", borderRight: "1px solid #fff" }}>{this.state.showList ? <KeyboardArrowLeftIcon style={{ width: "100%", height: "auto", position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)" }} className="icon" /> : <KeyboardArrowRightIcon style={{ width: "100%", height: "auto", position: "absolute", top: "50%", left: "0", transform: "translateY(-50%)" }} className="icon" />}</DivButton>
                            </div>
                            { /* This is the end of the task list */}

                            <div style={{ width: this.state.showList ? "calc(75% - 50px)" : "calc(100% - 50px)", left: this.state.showList ? "calc(25% + 50px)" : "50px", position: "absolute", height: "100%" }}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="task">
                                        <Tasks tasks={this.state.tasks} active={this.state.active} SSE={this.SSE.start} update={this.update.bind(this)} changeTab={this.selectTab.bind(this)} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="organize">
                                        <Organizer tasks={this.state.tasks} active={this.state.active} columns={this.state.columns} SSE={this.SSE.start} update={this.update.bind(this)} changeTab={this.selectTab.bind(this)} showControls={this.state.showList ? true : this.state.showControls} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </ContentBody>
                    </Tab.Container>
                </ContentCard>
            </MainContainer>
        );
    }
}