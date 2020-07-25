﻿import React, { Component } from 'react';
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
    background: #424355;
    height: 5%;
    width: 100%;
    min-height: 50px;
    top: 0;
    left: 0;
    z-index: 11;
`;

const BannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 1.25em;
    color: #fff;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 1%;
    position: absolute;
`;

const BannerCode = styled(BannerText)`
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
    font-size: 1em;
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
        font-size: 1em;

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
        font-size: 1em;
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

        this.update();
        axios.post(`admin/${code}/active-${this.state.active}`);
    }

    componentWillUnmount() {
        this.SSE.close();
        axios.post(`admin/save-${this.state.code}`)
    }

    update = async () => {
        this.SSE.close();
        const code = sessionStorage.getItem('code');
        await axios.get(`admin/${code}/questions-all`).then(res => {
            if (res.status === 202) {
                this.setState({
                    tasks: res.data,
                });

                if (this.state.active < this.state.tasks.length)
                    this.SSE.start(this.state.active);
                else if (this.state.tasks.length > 0)
                    this.SSE.start(0);
            } else if (res.status === 404) {
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
            if (target >= this.state.tasks.length)
                return;

            this.SSE.close();
            const code = sessionStorage.getItem('code');
            this.setState({
                active: target,
            });

            this.SSE.source = new EventSource(`admin/${code}/stream-question-${target}`);
            this.SSE.source.addEventListener("Groups", (e) => {
                try {
                    var data = JSON.parse(e.data);
                    var tasks = this.state.tasks;
                    tasks[target].groups = data;
                    let columns = this.state.columns;
                    this.state.columns = [];
                    if (tasks[target].groups !== undefined) {
                        for (let i = 0; i < tasks[target].groups.length; i++) {
                            while (tasks[target].groups[i].Column + 1 >= this.state.columns.length) {
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
                    tasks[target].options = data;
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

            this.SSE.source.addEventListener("Archive", (e) => {
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

    render() {
        return (
            <MainContainer>

                <Banner>
                    <BannerText>Sessions &#187; {this.state.title} &#187; {this.state.tab == "task" ? "Tasks" : "Organize"}</BannerText>
                    <BannerCode>{this.state.code > 0 ? "Event code: " + this.state.code.substr(0, 3) + " " + this.state.code.substr(3, 3) : ""}</BannerCode>

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