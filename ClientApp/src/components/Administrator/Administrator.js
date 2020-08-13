import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Tasks } from './Tabs/Tasks';
import { Organizer } from './Tabs/Organizer';
import { Presentation } from './Presentation';
import { Breadcrumbs, Link, Typography, Tooltip } from '@material-ui/core';
import { Facilitator } from '../Big Screen/Facilitator';

import { BsJustify } from 'react-icons/bs';
import BannerDropdown, { BannerLink } from '../Classes/Dropdown';

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
    background: #424355;
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
    color: #fff;
    top: 50%;
    position: absolute;
    width: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-left: 0;
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
            background: #4C7AD3;
        }

        &.active {
            border: 0;
            opacity: 100%;
            color: black;
            border-bottom: 3px solid #4C7AD3;
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

export class Administrator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            code: 0,
            tasks: [],
            columns: [],
            active: 0,

            tab: 'task',
            presentor: null,

            results: true,
        }

        this.present = this.present.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        let code = sessionStorage.getItem("code");
        let title = sessionStorage.getItem("title");
        let presentManager = new Presentation(code);

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

        toggleHide: () => {
        },
    }

    render() {
        return (
            <MainContainer>

                <Banner>
                    <BreadCrumb aria-label="Breadcrumb" separator="&#187;">
                        <BreadText color="initial" href="/">Coboost</BreadText>
                        <BreadText color="initial" href="/dashboard">Sessions</BreadText>
                        <BreadText color="initial" href="#" onClick={(e) => { e.preventDefault(); this.selectTab("task") }}>{this.state.title}</BreadText>
                        <BreadText color="initial" href="#" onClick={(e) => { e.preventDefault(); this.state.tab == "task" ? this.selectTab("organize") : this.selectTab("task") }}>{this.state.tab == "task" ? "Tasks" : "Organize"}</BreadText>
                        {this.state.tasks[this.state.active] != undefined && <Tooltip title="Organize"><BreadText color="initial" active={this.state.tab == "organize"} href="#" onClick={(e) => { e.preventDefault(); this.selectTab("organize") }}>{this.state.tasks[this.state.active].Title}</BreadText></Tooltip>}
                    </BreadCrumb>
                    <BannerCode>{this.state.code > 0 ? "Event code: " + this.state.code.substr(0, 3) + " " + this.state.code.substr(3, 3) : ""}</BannerCode>

                    <BannerDropdown title={<BsJustify />} style={{ float: "right", position: "relative", top: "50%", transform: "translateY(-50%)" }}>
                        <BannerLink onClick={this.logout}>Logout</BannerLink>
                    </BannerDropdown>

                    <BannerDropdown title="Presentation" style={{ float: "right", position: "relative", top: "50%", transform: "translateY(-50%)" }}>
                        <BannerLink disabled>Presentation Mode</BannerLink>
                        <BannerLink onClick={this.present}>Present in a new window</BannerLink>
                        <BannerLink disabled>Mirror Screen</BannerLink>
                        <BannerLink disabled>Get Presentation Link</BannerLink>
                    </BannerDropdown>
                </Banner>

                <ContentCard>
                    <Tab.Container activeKey={this.state.tab} onSelect={(k) => this.selectTab(k)}>

                        <ContentHeader>
                            <HeaderTabs variant="tabs">
                                <Nav.Link eventKey="task">Tasks</Nav.Link>
                                <Nav.Link eventKey="organize">Organize</Nav.Link>
                            </HeaderTabs>

                            <Facilitator style={{ position: "absolute", top: "0px", right: "0px", height: "50px", width: "40%" }} next={this.controls.next} back={this.controls.back} active={this.state.active} showingResult={this.state.results} onResultToggle={() => { this.setState({ results: !this.state.results, }) }} code={this.state.code} />

                        </ContentHeader>
                        <ContentBody>
                            <Tab.Content>
                                <Tab.Pane eventKey="task">
                                    <Tasks tasks={this.state.tasks} active={this.state.active} SSE={this.SSE.start} update={this.update.bind(this)} changeTab={this.selectTab.bind(this)} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="organize">
                                    <Organizer tasks={this.state.tasks} active={this.state.active} columns={this.state.columns} SSE={this.SSE.start} update={this.update.bind(this)} changeTab={this.selectTab.bind(this)} />
                                </Tab.Pane>
                            </Tab.Content>
                        </ContentBody>
                    </Tab.Container>
                </ContentCard>
            </MainContainer>
        );
    }
}