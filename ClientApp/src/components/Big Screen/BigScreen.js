import React, {Component} from "react";
import Axios from "axios";
import {Button, Nav, Col, Row} from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import {Ico_Loading, Ico_Group152, IconLogo} from "../Classes/Icons";
import {Column} from "../Administrator/Tabs/Components/Column";
import {Group} from "../Administrator/Tabs/Components/Group";
import {Input} from "../Administrator/Tabs/Components/Input";
import {ResultBackground, ResultItem, ResultSlider} from "../Administrator/Tabs/Components/Results";
import {Facilitator} from "./Facilitator";
import {SSE} from "../Core/SSE";
import {Typography, Box} from "@material-ui/core";



const MainContainer = Styled(Col)`
    display: table;
    height: 100%;
    width: 100%;
    background: #FFFFFF;
    position: absolute;
    font-Size: 1.5rem;
    padding: 0px;
`;

const Banner = Styled(Col)`
    position: fixed;
    background: transparent;
    min-height: 100px;
    height: 10%;
    top: 0;
    left: 0;
    z-index: 10;
    border-bottom: 1px dotted black;
    font-Size: 1.5rem;
`;

const ContentContainer = Styled(Col)`
    position: absolute;
    width: 100%;
    height: 80%;
    max-height: calc(100% - 100px);
    left: 0;
    top: calc(max(10%, 100px));
    overflow: hidden;
    overflow-y: auto;

    display: table-cell;
    vertical-align: middle;
    text-align: center;

    scrollbar-width: thin;
    scrollbar-color: #374785 #fff;
    font-Size: 1.5rem;
`;

const Title = Styled.h1`
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
    font-Size: 1.5rem;
`;

const EventCode = Styled.h1`
    font-family: CircularStd;
    text-align: center;
    color: #4C7AD3;
    color: #374785;
    font-Size: 1.5rem;
    font-weight: 600;
`;

const WelcomeContainer = Styled.div`
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    position: absolute;
    font-Size: 1.5rem;
    margin: 0 auto;
    padding: ${props => props.text ?
                        "1rem" :
                        "0 1rem"};
    column-count: ${props => props.text ?
                             "auto" :
                             "initial"};
    column-width: ${props => props.text ?
                             "400px" :
                             "initial"};
    column-gap: ${props => props.text ?
                           "20px" :
                           "initial"};
`;

const BottomBanner = Styled(Col)`
    position: fixed;
    background: transparent;
    border-top: 1px solid black;
    min-height: 50px;
    height: 100px;
    bottom: 0;
    left: 0;
    z-index: 10;
    font-Size: 1.5rem;
`;

const BottomBannerText = Styled.h1`
    font-family: CircularStd;
    font-Size: 1.5rem;
    color: #374785;
    padding: 0 35px;
    float: left;
    top:50%;
    transform: translateY(-50%);
    position: relative;

    :not(:first-child) {
        padding: 0px 5px;
        /*color: #4C7AD3;*/
        color: black;
    }
`;

export class BigScreen extends Component {
    constructor(props)
    {
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
            tool: {
                hide: false
            },

            resultsAsPercentage: false
        };

        this.facilitatorToggleResults = this.facilitatorToggleResults.bind(this);
    }


    async componentDidMount()
    {
        const Code = await sessionStorage.getItem("code");

        this.setState({
            code: Code
        });

        Axios.get(`presentation/info-${Code}`).then(res => {
            const Data = `${res.data.title}`;

            this.beginSSE = this.beginSSE.bind(this);
            var DataSource = new SSE(`presentation/${Code}/data`);

            this.setState({
                title: Data.toString(),
                sse: DataSource
            });

            this.beginSSE();
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


    beginSSE()
    {
        const State = this.state;
        var Server = State.sse;

        Server.startEventSource(() => {
            Server.addListener("Question", (e) => {
                try
                {
                    const QuestionData = JSON.parse(e.data);

                    this.setState({
                        activeQuestion: QuestionData.Index,
                        task: QuestionData
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Question");
                }
            });

            Server.addListener("Groups", (e) => {
                try
                {
                    const Groups = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.Groups = Groups;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Group");
                }
            });

            Server.addListener("Options", (e) => {
                try
                {
                    const Options = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.Options = Options;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Options");
                }
            });

            Server.addListener("Votes", (e) => {
                try
                {
                    const Votes = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.Votes = Votes;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Votes");
                }
            });

            Server.addListener("Total", (e) => {
                try
                {
                    const TotalVotes = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.TotalVotes = TotalVotes;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Total");
                }
            });

            Server.addListener("Results", (e) => {
                try
                {
                    const Result = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.ShowResults = Result;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Results");
                }
            });

            Server.addListener("FavoriteGroups", (e) => {
                try
                {
                    const FavGroups = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.FavoriteGroups = FavGroups;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: FavoriteGroups");
                    Server.log(e);
                }
            });

            Server.addListener("FavoriteMembers", (e) => {
                try
                {
                    const FavMembers = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.FavoriteMembers = FavMembers;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: FavoriteMembers");
                    Server.log(e);
                }
            });

            Server.addListener("Favorites", (e) => {
                try
                {
                    const Favorites = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.Favorites = Favorites;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Favorites");
                    Server.log(e);
                }
            });

            Server.addListener("Status", (e) => {
                try
                {
                    const Status = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.InProgress = Status;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Status");
                }
            });

            Server.addListener("Countdown", (e) => {
                try
                {
                    const Countdown = JSON.parse(e.data);
                    const Task = this.state.task;
                    Task.Countdown = Countdown;
                    this.setState({
                        task: Task
                    });
                }
                catch (e)
                {
                    Server.log("Failed to parse server event: Countdown");
                }
            });
        });
    }


    facilitatorToggleResults()
    {
        const OldState = this.state.showResults;
        const NewState = !OldState;

        this.setState({
            showResults: NewState
        });
    }


    renderWaiting()
    {
        const State = this.state;
        const Code = State.code;
        return (
            <React.Fragment>
                <ContentContainer>
                    <WelcomeContainer>
                        <Title>
                            Join in by going to
                            <br />
                            <b>innonor.no</b>
                            with the code:
                        </Title>

                        <EventCode>#{Code}</EventCode>
                    </WelcomeContainer>
                    {!this.props.admin &&
                        <Facilitator
                            active={State.activeQuestion}
                            allTasks
                            code={Code}
                            fullscreen
                            hide={true}
                            onResultToggle={this.facilitatorToggleResults}
                            showingResult={State.showResults}
                            style={{
                                left: "0",
                                bottom: "15px",
                                position: "fixed",
                                height: "100px",
                                width: "60%"
                            }}
                            toggle={true} />
                    }
                </ContentContainer>
                <BottomBanner>
                    <BottomBannerText> Waiting on participants...</BottomBannerText>
                </BottomBanner>
            </React.Fragment>
        );
    }


    renderWelcome()
    {
        const State = this.state;
        const Code = State.code;
        const Headline = State.title;
        return (
            <React.Fragment>
                <ContentContainer>
                    <Title>
                        <b>{Headline}</b>
                    </Title>
                    <WelcomeContainer>
                    </WelcomeContainer>
                    {!this.props.admin &&
                        <Facilitator
                            active={State.activeQuestion}
                            allTasks
                            code={Code}
                            fullscreen
                            hide={true}
                            onResultToggle={this.facilitatorToggleResults}
                            showingResult={State.showResults}
                            style={{
                                left: "0",
                                bottom: "100px",
                                position: "fixed",
                                height: "100px",
                                width: "60%"
                            }}
                            toggle={true} />
                    }
                </ContentContainer>
                <BottomBanner>
                    <BottomBannerText>#{Code}</BottomBannerText>
                    <BottomBannerText>Coboost</BottomBannerText>
                </BottomBanner>
            </React.Fragment>);
    }


    viewResult()
    {
        const State = this.state;
        const Question = State.task;

        if (Question.ShowResults === true)
        {
            if (Question.Type === 0)
            {
                return this.renderOpenTextResult();

                //return <p>Open Text</p>;
            }
            else if (Question.Type === 1)
            {
                //return <p>Multiple Choice</p>;
                return this.renderMultipleChoiceResult();
            }
            else if (Question.Type === 2)
                return this.renderPoints();
            else if (Question.Type === 3)
                return this.renderSlider();
        }
        return this.renderHidden();
    }


    renderQuestion()
    {
        const State = this.state;
        const Code = State.code;
        return (
            <React.Fragment>
                <ContentContainer>
                    <WelcomeContainer
                        text={this.state.task.Type === 0} >
                        {this.viewResult()}
                    </WelcomeContainer>
                    {!this.props.admin &&
                        <Facilitator
                            active={State.activeQuestion}
                            allTasks
                            code={Code}
                            fullscreen
                            hide={true}
                            onResultToggle={this.facilitatorToggleResults}
                            showingResult={State.showResults}
                            style={{
                                left: "0",
                                bottom: "15px",
                                position: "fixed",
                                height: "100px",
                                width: "60%"
                            }}
                            toggle={true} />
                    }
                </ContentContainer>

                { /*<BottomBanner>
                    <BottomBannerText>Coboost</BottomBannerText>
                    <BottomBannerText>#{code}</BottomBannerText>
                </BottomBanner>*/
                }

            </React.Fragment>);
    }


    renderOpenTextResult()
    {
        const Task = this.state.task;
        const Results = Task.Groups;

        return (
            <React.Fragment>
                {this.props.columns.slice(1).map(column =>
                    <Column
                        column={column.index}
                        empty
                        width={column.width} >
                        {Results && Results.slice(1).map(group => {
                                if (column.index === group.Column && (!group.Collapsed || this.props.tool === "hide"))
                                {
                                    return(
                                        <Group
                                            collapsed={group.Collapsed}
                                            color={group.Color}
                                            column={group.Column}
                                            favorite={Task.FavoriteGroups.indexOf(group.Index) !== -1}
                                            group={group.Index}
                                            id={group.Index}
                                            key={group.Index}
                                            showcase
                                            size={column.width}
                                            title={group.Title}
                                            toolFavorite={this.props.tool === "favorite"}
                                            toolHide={this.props.tool === "hide"} >

                                            {group.Members && group.Members.map(member =>
                                                <Input
                                                    column={group.Column}
                                                    description={member.Description}
                                                    favorite={Task.FavoriteMembers.indexOf(`${group.Index}-${member.Index}`) !== -1}
                                                    group={group.Index}
                                                    id={group.Index + "-" + member.Index}
                                                    isMerged={0}
                                                    key={member.Index}
                                                    member={member.Index}
                                                    showcase
                                                    size={column.width}
                                                    title={member.Title}
                                                    toolFavorite={this.props.tool === "favorite"} />
                                            )}
                                        </Group>
                                    );
                                }
                                else
                                    return null;
                            }
                        )}
                    </Column>
                )}

            </React.Fragment>
        );
    }
    // TODO: Delete this Old Function
    //renderOpenTextResult()
    //{
    //    const Results = this.state.task.Groups;
    //    return (
    //        <React.Fragment>


    //            {Results[0].Members.length > 0 &&
    //                !Results[0].Collapsed &&
    //                <Column
    //                    empty
    //                    key="C0"
    //                    width={1} >

    //                    <Group
    //                        group={0}
    //                        id={0}
    //                        key={0}
    //                        showcase
    //                        size={1}
    //                        title="Stack" >

    //                        {Results[0].Members.map(member =>
    //                            <Input
    //                                description={member.Description}
    //                                isMerged={0}
    //                                key={member.Index}
    //                                showcase
    //                                size={1}
    //                                title={member.Title} />
    //                        )}
    //                    </Group>
    //                </Column>
    //            }
    //            {Results.slice(1).map(group =>
    //                <React.Fragment>

    //                    {group.Members.length > 0 &&
    //                        !group.Collapsed &&
    //                        <Column
    //                            column={group.Column}
    //                            empty
    //                            key={`C${group.Index}`}
    //                            width={1} >

    //                            <Group
    //                                color={group.Color}
    //                                group={group.Index}
    //                                id={group.Index}
    //                                key={group.Index}
    //                                showcase
    //                                size={1}
    //                                title={group.Title} >

    //                                {group.Members.map(member =>
    //                                    <Input
    //                                        description={member.Description}
    //                                        isMerged={0}
    //                                        key={member.Index}
    //                                        showcase
    //                                        size={1}
    //                                        title={member.Title} />
    //                                )}
    //                            </Group>
    //                        </Column>
    //                    }
    //                </React.Fragment>
    //            )}
    //        </React.Fragment>
    //    );
    //}


    renderMultipleChoiceResult()
    {
        const Task = this.state.task;

        return (
            <React.Fragment>
                <ResultBackground
                    style={{ width: "98%", height: "85%" }} />

                {Task.Options.map(option =>
                    <ResultItem
                        color={option.Color}
                        description={option.Description}
                        favorite={Task.Favorites && Task.Favorites.includes(option.Index)}
                        height="85%"
                        id={option.Index}
                        index={option.Index}
                        key={option.Index}
                        percentage={((option.Votes.length / Task.TotalVotes) * 100)}
                        points={option.Votes.length}
                        showcase
                        showPercentage={this.state.resultsAsPercentage}
                        title={option.Title}
                        total={Task.Options.length}
                        vote />
                )}
            </React.Fragment>
        );
    }


    renderPoints()
    {
        const Task = this.state.task;
        const Total = Task.Votes.length * Task.Amount;

        return (
            <React.Fragment>
                <ResultBackground
                    style={{ width: "98%", height: "85%" }} />

                {Task.Options.map(option =>
                    <ResultItem
                        color={option.Color}
                        description={option.Description}
                        favorite={Task.Favorites && Task.Favorites.includes(option.Index)}
                        height="85%"
                        id={option.Index}
                        index={option.Index}
                        key={option.Index}
                        percentage={((option.Points / Total) * 100)}
                        points={option.Points}
                        showcase
                        showPercentage={this.state.resultsAsPercentage}
                        title={option.Title}
                        total={Task.Options.length}
                        vote />
                )}
            </React.Fragment>
        );
    }


    renderSlider()
    {
        const Task = this.state.task;

        return (
            <React.Fragment>
                {Task.Options.map(option =>
                    <ResultSlider
                        average={option.Average}
                        color={option.Color}
                        description={option.Description}
                        favorite={Task.Favorites && Task.Favorites.includes(option.Index)}
                        id={option.Index}
                        index={option.Index}
                        max={Task.Max}
                        maxDescription={Task.MaxDescription}
                        min={Task.Min}
                        minDescription={Task.MinDescription}
                        showcase
                        title={option.Title}
                        vote />
                )}
            </React.Fragment>
        );
    }


    renderHidden()
    {
        const Task = this.state.task;
        return (
            Task.Type === 0 ?
                <React.Fragment>
                    <Box
                        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} >

                        <Typography
                            align="center"
                            display="block"
                            variant="h2" >
                            Keep working on your task!
                        </Typography>

                        <Typography
                            align="center"
                            display="block"
                            variant="h2" >
                            Inputs will soon be shown
                        </Typography>
                    </Box>
                </React.Fragment> :
                Task.Type === 3 ?
                <React.Fragment>
                    {Task.Options.map(option =>
                        <ResultSlider
                            average={(Task.Max + Task.Min) / 2}
                            color={option.Color}
                            description={option.Description}
                            id={option.Index}
                            index={option.Index}
                            max={Task.Max}
                            maxDescription={Task.MaxDescription}
                            min={Task.Min}
                            minDescription={Task.MinDescription}
                            showcase
                            title={option.Title}
                            vote />
                    )}
                </React.Fragment> :
                <React.Fragment>

                    <Typography
                        align="center"
                        display="block"
                        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                        variant="h2" >
                        Votes will soon be shown!
                    </Typography>

                    {Task.Options.map(option =>
                        <ResultItem
                            color={option.Color}
                            description={option.Description}
                            height="85%"
                            id={option.Index}
                            index={option.Index}
                            key={option.Index}
                            percentage={0}
                            points={0}
                            showcase
                            showPercentage={this.state.resultsAsPercentage}
                            title={option.Title}
                            total={Task.Options.length}
                            vote />
                    )}

                </React.Fragment>
        );
    }


    handleRender()
    {
        const Headline = this.state.title;
        const Task = this.state.task;

        if (Headline === null)
            return this.renderWaiting();
        else
        {
            if (Task && Task.Index !== undefined && Task.Index !== -1)
                return this.renderQuestion();
            else
                return this.renderWelcome();
        }
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
        return (
            <React.Fragment>
                <MainContainer>
                    <Banner>

                        <BottomBannerText>
                            Coboost
                        </BottomBannerText>

                        <BottomBannerText>
                            #{this.state.code}
                        </BottomBannerText>

                        {this.state.task &&
                            <Title>
                                <b>{this.state.task.Title}</b>
                            </Title>
                        }
                    </Banner>
                    {this.handleRender()}

                    {this.state.task &&
                        <div
                            style={{
                                position: "absolute",
                                height: "50px",
                                lineHeight: "50px",
                                textAlign: "center",
                                minWidth: "150px",
                                border: "1px solid black",
                                borderRadius: "15px",
                                right: "50px",
                                top: "25px",
                                color: this.state.task.Countdown < 11 && this.state.task.Countdown > -1 ?
                                           "red" :
                                           "black"
                            }} >
                            {this.state.task.InProgress ?
                                 this.state.task.Countdown < 0 ?
                                 "Task Open!" :
                                 `Time: ${this.secondsToMinutes(this.state.task.Countdown)}` :
                                 "Task Closed"}
                        </div>
                    }
                </MainContainer>
            </React.Fragment>
        );
    }
}