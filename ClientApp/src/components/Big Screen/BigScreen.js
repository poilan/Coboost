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
    height: 75px;
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
    height: 77%;
    left: 0;
    top: 75px;

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

    /*position: absolute;
    left: 50%;
    transform: translateX(-50%);*/

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
    position: absolute;
    margin: 0 auto;
`;

const BottomBanner = styled(Col)`
    position: fixed;
    background: transparent;
    border-top: 1px solid black;
    height: 100px;
    bottom: 0;
    left: 0;
    z-index: 10;
`;

const BottomBannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 1.5rem;
    color: black;
    padding: 35px;
    float: left;

    :not(:first-child) {
        padding: 35px 5px;
        /*color: #4C7AD3;*/
        color: rgb(53, 57, 67);
    }
`;

const AddOption = styled.div`
    display: ${props => props.possible ? "inline-block" : "none"};
    opacity: 50%;
    width: 100%;
    font-family: CircularStd;
    font-size: 0.8em;
    font:weight: 700;
    padding: .2em .5em .17em .26em;
    box-sizing: border-box;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;

    &:hover {
        opacity: 75%;
        cursor:pointer;
    }
`;

const VoteOption = styled(AddOption)`
    display: inline-block;
    width: 15%;
    margin: 0.5%;
    opacity: 100%;
`;

const Logo = styled(IconLogo)`
    padding: 20px;
    width: 15%;
`;

export class BigScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            code: 100001,
            title: null,

            // Facilitator Options
            isFullscreen: false,

            question: null,
            groups: [
                "item1",
                "item2",
                "item3",
                "item4",
                "item5",
                "item6",
                "item7",
                "item8",
                "item9",
                "item10",
            ],

            sse: null,
        };

        //this.eventSource = undefined;
        //this.beginSSE = this.beginSSE.bind(this);
    }

    componentDidMount() {
        const email = localStorage.getItem("user");
        const code = sessionStorage.getItem("present_code");

        this.setState({
            code: code,
        });

        console.log(`Code is ${code}`);

        axios.get(`presentation/info-${code}`).then(res => {
            const title = res.data.title;
            console.log(res.data);

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
            sse.addListener("Question", (data) => {
                try {
                    var questionData = JSON.parse(data);

                    var stateData = {
                        question: questionData,
                    };

                    switch (questionData.QuestionType) {
                        case 0:
                            stateData.groups = questionData.Groups;
                            break;
                        case 1:
                            stateData.options = questionData.Options;
                            break;
                    }

                    this.setState(stateData);
                } catch (e) {
                    sse.log("Failed to parse server event");
                }
            });

            sse.addListener("Groups", (data) => {
                try {
                    var groupData = JSON.parse(data);

                    this.setState({
                        groups: groupData
                    })
                } catch (e) {
                    sse.log("Failed to parse server event");
                }
            });

            sse.addListener("Options", (data) => {
                try {
                    var optionData = JSON.parse(data);

                    this.setState({
                        options: optionData
                    })
                } catch (e) {
                    sse.log("Failed to parse server event");
                }
            });

            sse.addListener("Total", (data) => {
                try {
                    var totalVotes = JSON.parse(data);

                    sse.log("Total votes: " + totalVotes);
                } catch (e) {
                    sse.log("Failed to parse server event");
                }
            });
        })
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
                <Facilitator />
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
                <Facilitator />
            </ContentContainer>
            <BottomBanner>
                <BottomBannerText>Coboost</BottomBannerText>
                <BottomBannerText>#{code}</BottomBannerText>
            </BottomBanner>
        </>);
    }

    viewResult() {
        const question = this.state.question;
        if (question.QuestionType === 0) {
            return this.renderOpenTextResult();
            //return <p>Open Text</p>;
        }
        else if (question.QuestionType === 1) {
            //return <p>Multiple Choice</p>;
            return this.renderMultipleChoiceResult();
        }
    }

    renderQuestion() {
        const state = this.state;
        const code = state.code;
        const question = state.question;

        const columnWidth = 1;

        return (<>
            <ContentContainer>
                <Title><b>{question.Index + 1}. {question.Title}</b></Title>
                <WelcomeContainer>
                    {this.viewResult()}
                </WelcomeContainer>
            </ContentContainer>
            <BottomBanner>
                <BottomBannerText>Coboost</BottomBannerText>
                <BottomBannerText>#{code}</BottomBannerText>
            </BottomBanner>
        </>);
    }

    renderOpenTextResult() {
        const results = this.state.groups;

        /*for (var i in results) {
            console.log(i);
        }*/
        return (
            <>
                {results.map(group =>
                    <>
                        {group.Members.length > 0 && <Column key={group.Title} column={group.Column} width={1}>
                            <Group title={group.Title} size={1}>
                                {group.Members.map(member => <Input key={member.Title} title={member.Title} size={1} />)}
                            </Group>
                        </Column>}
                    </>)}
            </>
        );
    }

    renderMultipleChoiceResult() {
        const state = this.state;
        const question = state.question;
        const options = state.options;

        return (
            <>
                <ResultBackground style={{ width: "95%", height: "70%" }} />
                {/*options.map(option =>
                    <Input key={option.Index} percentage={((option.Votes.length / question.TotalVotes) * 100)} organized vote id={option.Index} index={option.Index} title={option.Title} />)}
                */}
                {options.map(option =>
                    <ResultItem key={option.Index} id={option.Index} index={option.Index} title={option.Title} vote percentage={((option.Votes.length / question.TotalVotes) * 100)} height="79%" total={options.length} />
                )}
            </>
        );
    }

    handleRender() {
        const state = this.state;
        const title = state.title;
        const question = state.question;

        if (title === null) {
            return this.renderWaiting()
        } else {
            if (question !== null && question.Index !== -1) {
                return this.renderQuestion();
            } else {
                return this.renderWelcome()
            }
        }
    }

    render() {
        return (
            <MainContainer>
                <Banner>
                    <Logo/>
                </Banner>
                {this.handleRender()}
            </MainContainer>
        );
    }
}