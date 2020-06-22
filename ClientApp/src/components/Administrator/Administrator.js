import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Tasks } from './Tabs/Tasks';
import { Organizer } from './Tabs/Organizer';
import { Presentation } from './Presentation';

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

const ContentCard = styled(Card)`
    position: absolute;
    top: 5vh;
    width: 100%;
    left: 0;
    height: 95vh;
    padding:0;
    background: #e4e4e4;
    min-height: calc(720px - 9vh);
`;

const ContentHeader = styled(Card.Header)`
    width: 100%;
    background: #fff;
    height: 4vh;
    top: 0;
    position: absolute;
`;

const ContentBody = styled(Card.Body)`
    background: #E4E4E4;
    position: absolute;
    top: 4vh;
    width: 100%;
    min-height: 89vh;
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

            tab: 'task',
            presentor: null,
        }

        this.present = this.present.bind(this);
    }

    componentDidMount() {
        let code = sessionStorage.getItem("code");
        let title = sessionStorage.getItem("title");

        let presentManager = new Presentation(code);

        this.setState({
            title: title,
            code: code,
            presentor: presentManager,
        })

        this.getTasks();
        this.addColumn();
    }

    componentWillUnmount() {
    }

    getTasks = async () => {
        const code = sessionStorage.getItem('code');
        await axios.get(`admin/${code}/questions-all`).then(res => {
            if (res.status === 202) {
                this.setState({ tasks: res.data });
            } else if (res.status === 404) {
                //session not found
            }
        })
    }

    startEventSource = (target) => {
        const code = sessionStorage.getItem("code");

        if (this.eventSource !== undefined)
            this.eventSource.close();

        this.eventSource = new EventSource(`admin/${code}/stream-question-${target}`);

        this.eventSource.addEventListener("Groups", (e) => {
            try {
                var data = JSON.parse(e.data);
                var tasks = this.state.tasks;
                tasks[target].groups = data;
                let columns = this.state.columns;
                this.state.columns = [];
                if (tasks[target].groups !== undefined) {
                    for (let i = 0; i < tasks[target].groups.length; i++) {
                        while (tasks[target].groups[i].Column + 1 >= this.state.columns.length) {
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
                    tasks: tasks,
                })
            } catch (e) {
                console.log("Failed to parse server event: " + e.data);
                console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("Options", (e) => {
            try {
                var data = JSON.parse(e.data);
                var tasks = this.state.tasks;
                tasks[target].options = data;
                if (tasks[target].options !== undefined) {
                    tasks[target].options.sort((a, b) => (a.Votes.length > b.Votes.length) ? -1 : 1);
                }
                this.setState({
                    tasks: tasks,
                })
            } catch (e) {
                console.log("Failed to parse server event: " + e.data);
                console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("Total", (e) => {
            try {
                var data = JSON.parse(e.data);
                var tasks = this.state.tasks;
                tasks[target].TotalVotes = data;
                this.setState({
                    questions: tasks,
                })
            } catch (e) {
                console.log("Failed to parse server event: " + e.data);
                console.log(e);
            }
        }, false);

        this.eventSource.addEventListener("Archive", (e) => {
            try {
                var data = JSON.parse(e.data);
                var tasks = this.state.tasks;
                tasks[target].archive = data;
                this.setState({
                    tasks: tasks,
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

    selectTab(key) {
        this.getTasks();
        this.setState({
            tab: key,
        });
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

    createTask = () => {
        const tasks = this.state.tasks;
        var count = tasks.length;

        var question = {
            questionType: -1,
            title: 'New Task',
            index: count,
        };

        this.setState({
            tasks: tasks.concat(question),
        });
    }

    present = () => {
        let state = this.state;
        let presentor = state.presentor;

        presentor.PresentInNewWindow();
    }

    render() {
        return (
            <MainContainer>

                <Banner>
                    <BannerArrow onClick={this.backToProjects}>⟵</BannerArrow>
                    <BannerText>{this.state.title}</BannerText>
                    <BannerCode>{this.state.code > 0 ? "#" + this.state.code.substr(0, 3) + " " + this.state.code.substr(3, 3) : ""}</BannerCode>

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

                <ContentCard>
                    <Tab.Container activeKey={this.state.tab} onSelect={(k) => this.selectTab(k)}>
                        <ContentHeader>
                            <HeaderTabs variant="tabs">
                                <Nav.Link eventKey="task">Tasks</Nav.Link>
                                <Nav.Link eventKey="organize">Organize</Nav.Link>
                            </HeaderTabs>
                        </ContentHeader>
                        <ContentBody>
                            <Tab.Content>
                                <Tab.Pane eventKey="task">
                                    <Tasks tasks={this.state.tasks} startEventSource={this.startEventSource.bind(this)} updateTasks={this.getTasks.bind(this)} changeTab={this.selectTab.bind(this)} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="organize">
                                    <Organizer tasks={this.state.tasks} columns={this.state.columns} startEventSource={this.startEventSource.bind(this)} updateTasks={this.getTasks.bind(this)} changeTab={this.selectTab.bind(this)} />
                                </Tab.Pane>
                            </Tab.Content>
                        </ContentBody>
                    </Tab.Container>
                </ContentCard>
            </MainContainer>
        );
    }
}