import React, { Component } from 'react';
import axios from './Tabs/node_modules/axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "./Tabs/node_modules/circular-std";
import { useState } from 'react';
import { PageModal } from '../Services/PageModal';
import { Input } from './Tabs/Components/Input';
import { Group } from './Tabs/Components/Group';
import { Column } from './Tabs/Components/Column';
import { Collection, Task } from './Tabs/Components/Task';
import { ResultBackground, ResultItem } from './Tabs/Components/Results';
import { Ico_Text, Ico_MultipleChoice } from '../Classes/Icons';

const MainContainer = styled.div`
    display: table;
    height: 100%;
    width: 100%;
    left: 0;
    background: #E4E4E4;
    position: absolute;
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

            tab: 'task',
        }
    }

    componentWillMount() {
        let code = sessionStorage.getItem("code");
        let title = sessionStorage.getItem("title");

        this.setState({
            title: title,
            code: code,
        })
    }

    componentWillUnmount() {
    }

    selectTab(key) {
        this.setState({
            tab: key,
        });
    }

    render() {
        return (
            <MainContainer>

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
                                    {this.tabTasks()}
                                </Tab.Pane>
                                <Tab.Pane eventKey="organize">
                                    {this.tabOrganize()}
                                </Tab.Pane>
                            </Tab.Content>
                        </ContentBody>
                    </Tab.Container>
                </ContentCard>
            </MainContainer>
        );
    }
}