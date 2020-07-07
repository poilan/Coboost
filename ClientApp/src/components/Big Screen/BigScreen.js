import React, { Component } from 'react';
import axios from 'axios';
import { Button, Nav, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Ico_Loading, Ico_Group152, IconLogo } from "../Classes/Icons";
import { Column } from "../Administrator/Tabs/Components/Column";
import { Group } from "../Administrator/Tabs/Components/Group";
import { Input } from "../Administrator/Tabs/Components/Input";
import { ResultBackground, ResultItem } from "../Administrator/Tabs/Components/Results";
import { Facilitator } from "./Facilitator";

import SSE from "../Core/SSE";

const MainContainer = styled(Col)`
    display: table;
    height: 100%;
    width: 100%;
    background: #FFFFFF;
    position: absolute;
    padding: 0px;
`;

const Banner = styled(Col)`
    position: sticky;
    background: transparent;
    min-height: 50px;
    height: 10%;
    top: 0;
    left: 0;
    z-index: 10;
`;

const BannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 1.5rem;
    /*color: #4C7AD3;*/
    color: rgb(53, 57, 67);
    padding: 25px 5px;
    position: absolute;
`;

const ContentContainer = styled(Col)`
    position: absolute;
    width: 100%;
    height: 80%;
    max-height: calc(100% - 100px);
    left: 0;
    top: calc(max(10%, 100px));
    overflow: hidden;

    display: table-cell;
    veritical-align: middle;
    text-align: center;
`;

const Title = styled.h1`
    font-family: CircularStd;
    font-weight: 400;
    b {
        font-weight: 500;
    }
    position: absolute;
    left: 50%;
    z-index: 11;
    top: 50%;
    transform: translate(-50%, -50%);

    text-align: center;
`;

const IconLoader = styled(Ico_Loading)`
    display: block;
    margin: 0 auto;
    margin-top: 20px;
    height: 128px;

    @keyframes rotation {
        0% {
            transform: rotate(0deg), scale(1)
        }
        50% {
            transform: rotate(-180deg) scale(0.5);
        }
        100% {
            transform: rotate(-360deg) scale(1);
        }
    }

    animation: rotation 1.5s infinite linear;
`;

const Code = styled.h1`
    font-family: CircularStd;
    text-align: center;
    /*color: #4C7AD3;*/
    color: rgb(53, 57, 67);
    font-weight: 600;
`;

const WelcomeContainer = styled.div`
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    position: absolute;
    margin: 0 auto;
`;

const BottomBanner = styled(Col)`
    position: fixed;
    background: transparent;
    border-top: 1px solid black;
    min-height: 50px;
    height: 100px;
    bottom: 0;
    left: 0;
    z-index: 10;
`;

const BottomBannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 1.5rem;
    color: black;
    padding: 0 35px;
    float: left;
    top:50%;
    transform: translateY(-50%);
    position: relative;

    :not(:first-child) {
        padding: 35px 5px;
        /*color: #4C7AD3;*/
        color: rgb(53, 57, 67);
    }
`;

const Logo = styled(IconLogo)`
    padding: 20px;
    height: 100%;
`;

export class BigScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: 100001,
            title: null,

            // Facilitator Options
            activeQuestion: 0,
            isFullscreen: false,
            showResults: true,

            task: null,
            sse: null,
        };

        this.facilitatorToggleResults = this.facilitatorToggleResults.bind(this);
    }

    componentDidMount() {
        const email = localStorage.getItem("user");
        let code = sessionStorage.getItem("present_code");

        if (code == null)
            code = sessionStorage.getItem("code");

        this.setState({
            code: code,
        });

        axios.get(`presentation/info-${code}`).then(res => {
            const title = res.data.title;

            this.beginSSE = this.beginSSE.bind(this);
            var dataSource = new SSE(`presentation/${code}/data`);

            this.setState({
                title: title,
                sse: dataSource,
            });

            this.beginSSE();
        });
    }

    beginSSE() {
        var state = this.state;
        var sse = state.sse;

        sse.startEventSource((e) => {
            sse.addListener("Question", (e) => {
                try {
                    var questionData = JSON.parse(e.data);

                    var task = this.state.task;
                    task = questionData;

                    this.setState({
                        activeQuestion: task.Index,
                        task: task,
                    })
                } catch (e) {
                    sse.log("Failed to parse server event: Question");
                }
            });

            sse.addListener("Groups", (e) => {
                try {
                    let groups = JSON.parse(e.data);
                    let task = this.state.task;
                    task.Groups = groups;
                    this.setState({
                        task: task
                    });
                } catch (e) {
                    sse.log("Failed to parse server event: Group");
                }
            });

            sse.addListener("Options", (e) => {
                try {
                    let options = JSON.parse(e.data);
                    let task = this.state.task;
                    task.Options = options;
                    this.setState({
                        task: task
                    });
                } catch (e) {
                    sse.log("Failed to parse server event: Options");
                }
            });

            sse.addListener("Total", (e) => {
                try {
                    let totalVotes = JSON.parse(e.data);
                    let task = this.state.task
                    task.TotalVotes = totalVotes;
                    this.setState({
                        task: task
                    });
                } catch (e) {
                    sse.log("Failed to parse server event: Total");
                }
            });
        })
    }

    facilitatorToggleResults() {
        const oldState = this.state.showResults;
        var newState = !oldState;

        this.setState({
            showResults: newState
        });
    }

    renderWaiting() {
        const state = this.state;
        const code = state.code;
        return (<>
            <ContentContainer>
                <WelcomeContainer>
                    <Title>Join in by going to<br /><b>innonor.no</b> with the code:</Title>
                    <Code>#{code}</Code>
                </WelcomeContainer>
                {!this.props.admin && <Facilitator onResultToggle={this.facilitatorToggleResults} showingResult={state.showResults} active={state.activeQuestion} code={code} />}
            </ContentContainer>
            <BottomBanner>
                <BottomBannerText>Waiting on participants...</BottomBannerText>
            </BottomBanner>
        </>);
    }

    renderWelcome() {
        const state = this.state;
        const code = state.code;
        const title = state.title;
        return (<>
            <ContentContainer>
                <Title><b>{title}</b></Title>
                <WelcomeContainer>
                    <IconLoader />
                </WelcomeContainer>
                {!this.props.admin && <Facilitator onResultToggle={this.facilitatorToggleResults} showingResult={state.showResults} active={state.activeQuestion} code={code} />}
            </ContentContainer>
            <BottomBanner>
                <BottomBannerText>Coboost</BottomBannerText>
                <BottomBannerText>#{code}</BottomBannerText>
            </BottomBanner>
        </>);
    }

    viewResult() {
        const state = this.state;
        const canShow = state.showResults;

        if (canShow === true) {
            const question = state.task;
            if (question.QuestionType === 0) {
                return this.renderOpenTextResult();
                //return <p>Open Text</p>;
            }
            else if (question.QuestionType === 1) {
                //return <p>Multiple Choice</p>;
                return this.renderMultipleChoiceResult();
            }   
        }
    }

    renderQuestion() {
        const state = this.state;
        const code = state.code;
        return (
            <>
                <ContentContainer>
                    <WelcomeContainer>
                        {this.viewResult()}
                    </WelcomeContainer>
                    {!this.props.admin && <Facilitator onResultToggle={this.facilitatorToggleResults} showingResult={state.showResults} active={state.activeQuestion} code={code} />}
                </ContentContainer>
                <BottomBanner>
                    <BottomBannerText>Coboost</BottomBannerText>
                    <BottomBannerText>#{code}</BottomBannerText>
                </BottomBanner>
            </>);
    }

    renderOpenTextResult() {
        const results = this.state.task.Groups;
        return (
            <>
                {results.slice(1).map(group =>
                    <>
                        {group.Members.length > 0 && <Column key={"C" + group.Index} column={group.Column} width={1} empty>
                            <Group key={group.Index} title={group.Title} size={1} showcase>
                                {group.Members.map(member => <Input key={member.Index} title={member.Title} size={1} showcase />)}
                            </Group>
                        </Column>}
                    </>)}
            </>
        );
    }

    renderMultipleChoiceResult() {
        const task = this.state.task;

        return (
            <>
                <ResultBackground style={{ width: "95%", height: "80%" }} />
                {task.Options.map(option =>
                    <ResultItem key={option.Index} id={option.Index} index={option.Index} title={option.Title} vote percentage={((option.Votes.length / task.TotalVotes) * 100)} height={80} total={task.Options.length} showcase />
                )}
            </>
        );
    }

    handleRender() {
        const title = this.state.title;
        const task = this.state.task;

        if (title === null) {
            return this.renderWaiting()
        } else {
            if (task !== null && task.Index !== -1) {
                return this.renderQuestion();
            } else {
                return this.renderWelcome()
            }
        }
    }

    render() {
        return (
            <>
                <MainContainer>
                    <Banner>
                        <Logo style={{height: "100%"}}/>
                        {this.state.task !== null && <Title><b>{this.state.task.Index + 1}. {this.state.task.Title}</b></Title>}
                    </Banner>
                    {this.handleRender()}
                </MainContainer>
            </>
        );
    }
}