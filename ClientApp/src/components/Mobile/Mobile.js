import React, {Component, useRef, createRef} from "react";
import {Redirect} from "react-router-dom";
import Axios from "axios";
import {Button, Nav, Col, ToggleButton, Dropdown, ToggleButtonGroup, NavLink, DropdownButton, Form} from
    "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import {Ico_Loading, Ico_Group152} from "../Classes/Icons";
import {SSE} from "../Core/SSE";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Rating from "@material-ui/lab/Rating";
import {BannerLink} from "../Classes/Dropdown";
import {TextField, Snackbar, createMuiTheme, ThemeProvider} from "@material-ui/core";
import {height} from "@material-ui/system";
import MuiAlert from "@material-ui/lab/Alert";


function Alert(props) {
    return <MuiAlert
               elevation={6}
               variant="filled"
               {...props} />;
}


const Theme = createMuiTheme({
    palette: {
        primary: {
            main: "#24305E",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#374785",
            contrastText: "#ffffff"
        },
        error: {
            main: "#F76C6C"
        },
        warning: {
            main: "#f8e9a1"
        },
        info: {
            main: "#4C7AD3"
        },
        success: {
            main: "#6CF76C"
        }
    }
});


const MainContainer = Styled(Col)`
    display: table;
    height: 100%;
    width: 100%;
    background: #E4E4E4;
    position: absolute;
    padding: 0;
    margin: 0;
    overflow: hidden;
`;

const Header = Styled(Col)`
    background: #fff;
    position: absolute;
    height: 50px;
    left: 0px;
    top: 0px;

    display: flex;
    flex-direction: row;
    /*box-shadow: inset 0px -4px 0px 0px #cfcfcf;*/
    z-index: 10;
`;

const HeaderText = Styled.h1`
    text-align: center;
    font-family: CircularStd;
    font-weight: 525;
    line-height: 50px;
    font-size: 1.5rem;
    border-bottom: 4px ${props => props.active === props.id ?
                                  "solid" :
                                  "hidden"} #374785;
    cursor: pointer;
    box-sizing: border-box;
    &:hover {
        border-bottom: 4px solid ${props => props.active === props.id ?
                                            "#374785" :
                                            "#4f4f4f"};
    }

    flex: 1 1 auto;
    margin-bottom: 0px;
`;

const ContentContainer = Styled(Col)`
    background: #fff;
    box-shadow: 0px 0px 10px 0px #cfcfcf;
    position: absolute;
    width: 100%;
    height: calc(100% - 50px);
    left: 0;
    top: 50px;
    padding: 15px 0;
    overflow: auto;
    overflow-x: hidden;
`;

const ContentTitle = Styled.h3`
    font-size: 1rem;
    font-family: CircularStd;
    font-weight: 500;
    text-align: center;

    position: relative;
    padding: 10px 30px;
    padding-bottom: 0;

    color: ${props => props.blue ?
                      "#4C7AD3" :
                      "black"};
`;

const ContentBody = Styled.p`
    font-family: CircularStd;
    font-size: ${props => props.boxed ?
                          "0.8rem" :
                          "1rem"};
    text-align: center;

    position: relative;
    padding: 30px;

    background: ${props => props.boxed ?
                           "#4C7ADC" :
                           "transparent"};
    color: ${props => props.boxed ?
                      "white" :
                      "black"};
    border-radius: 10px;
`;

const ContentQuestion = Styled.p`
    font-family: CircularStd;
    text-align: center;
    color: #100E0E;

    position: relative;
    padding: 5px 0;
    border-bottom: 2px solid #374785;
    height: 30px;
`;

const ContentInput = Styled(TextField)`
    display: block;
    position: relative;

    font-family: CircularStd;
    font-size: 1rem;
    text-align: ${props => props.isTitle ?
                           "center" :
                           "left"};
    color: black;
    border: 0;
    border-bottom: 1px solid ${props => props.isTitle ?
                                        "#4C7AD3" :
                                        "#cfcfcf"};
    opacity: ${props => props.isTitle ?
                        "80%" :
                        "100%"};
    resize: none;
    outline: none;
`;

const ContentButton = Styled(Button)`
    background: #374785;
    color: #fff;

    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    border: 4px solid #4C7AD3;
    outline: none;
    border-radius: 0;

    display: block;
    position: fixed;
    width: 100%;
    height: 50px;
    left: 0;
    bottom: 0;

    &:disabled {
        background: #374785;
        opacity: 100%;
        border: 4px solid rgb(93, 97, 107);
    }
`;

const ContentFooter = Styled.p`
    font-family: CircularStd;
    text-align: center;

    position: relative;
    top: 40px;
`;

const IconLoader = Styled(Ico_Loading)`
    display: block;
    margin: 0 auto;
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

    animation: rotation 2.5s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
`;

const IconDone = Styled(Ico_Group152)`
    display: block;
    margin: 5px auto;
    margin-bottom: 32px;
    height: 48px;

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(-360deg);
        }
    }

    animation: rotation 5s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
`;

const MultipleChoiceGroup = Styled(ToggleButtonGroup)`
    display: block;
    padding: 20px;
`;

const TickStem = Styled.div`
    position: relative;
    width: 2px;
    height: 12px;
    background-color: rgb(71, 114, 224);
    border-radius: 11px;
    left: 12px;
    top: 6px;
    transform: rotate(45deg);
`;

const TickKick = Styled.div`
    position: relative;
    width: 6px;
    height: 2px;
    background-color: rgb(71, 114, 224);
    left: 5px;
    top: 1px;
    transform: rotate(45deg)
`;

const Tick = Styled.div`
    width: 24px;
    height: 24px;

    float: left;

    border-radius: 12px;
    border: 1px solid black;

    margin-top: 3px;
    margin-right: 20px;

    display: inline-block;
`;

const MultipleChoiceButton = Styled(ToggleButton)`
    background-color: transparent !important;
    border-radius: 10px !important;
    border-color: black !important;
    color: black !important;

    text-align: left;
    padding-left: 20px;

    :not(:first-child) {
        margin-top: 10px !important;
    }

    ${Tick} {
        ${TickKick} {
            background-color: transparent;
        };

        ${TickStem} {
            background-color: transparent;
        };
    };

    &.active {
        color: white !important;
        background-color: #006BDD !important;
        border-color: #006BDD !important;

        ${Tick} {
            display: inline;
            background-color: white;
            border-color: white;

            ${TickKick} {
                background-color: #006BDD;
            }

            ${TickStem} {
                background-color: #006BDD;
            }
        };
    };
`;

export class Mobile extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            activeHeader: "inputs",
            currentInput: 0,
            lastInput: 0,

            answers: [],
            inputs: [],
            title: "",
            snackbar: false,

            loggedIn: false,
            sessionState: 1, // 0: Not started, 1: Answering, 2: Finished
            SSE: null
        };

        //this.eventSource = undefined;
        this.headerClick = this.headerClick.bind(this);
        this.questionChange = this.questionChange.bind(this);
        this.choicePick = this.choicePick.bind(this);
        this.inputsClick = this.inputsClick.bind(this);
        this.inputsEdit = this.inputsEdit.bind(this);
        this.logout = this.logout.bind(this);

        //DOM References
        this.TextTitle = createRef();
        this.TextDescription = createRef();
        this.TextForm = createRef();
    }


    componentWillMount()
    {
        if (localStorage.getItem("user") !== null)
        {
            this.setState({
                loggedIn: true
            });
        }

        const Code = sessionStorage.getItem("code");

        Axios.get(`admin/${Code}/questions-all`).then(res => {
            if (res.status === 202)
            {
                const Data = res.data;

                this.setState({
                    inputs: Data
                });

                this.parseAnswers();
            }
        });

        var EventSource = new SSE(`client/${Code}/question`);

        this.setState({
            SSE: EventSource
        });

        EventSource.startEventSource(() => {
            EventSource.addListener("question", (e) => {
                try
                {
                    const Data = JSON.parse(e.data); // Question data

                    const Index = parseInt(Data.Index);

                    const Inputs = this.state.inputs;
                    const Spent = Inputs[Index].Spent;

                    Inputs[Index] = Data;

                    if (Index === this.state.currentInput)
                        Inputs[Index].Spent = Spent;

                    this.setState({
                        inputs: Inputs
                    });

                    if (Index !== this.state.currentInput)
                    {
                        this.parseAnswers();

                        this.setState({
                            currentInput: Index,
                            sessionState: 1
                        });
                    }
                }
                catch (Event)
                {
                    EventSource.log(`Failed to parse server event${Event}`);
                }
            });
        });
    }


    componentWillUnmount()
    {
        if (this.eventSource)
            this.eventSource.close();
    }


    parseAnswers()
    {
        var Answers = [];

        const Questions = this.getTasks();
        Questions.forEach((question, index) => {
            var Answer = {
                index: index,
                value: question.Type === 0 ?
                           "" :
                           []
            };

            if (question.Options !== undefined)
            {
                if (question.Type === 2)
                {
                    const Values = [];

                    for (let I = 0; I < question.Options.length; I++)
                        Values.push(0);
                    Answer.value = Values;
                    question.Spent = 0;
                }
                else if (question.Type === 3)
                {
                    const Values = [];

                    for (let I = 0; I < question.Options.length; I++)
                        Values.push(question.Min);

                    Answer.value = Values;
                }
            }

            if (Answers[index] !== undefined)
                Answers[index] = Answer;
            else
                Answers.push(Answer);
        });

        this.setState({
            answers: Answers
        });
    }


    getTasks()
    {
        return this.state.inputs;
    }


    getTaskIndex()
    {
        return this.state.currentInput;
    }


    getTaskAnswers()
    {
        const Index = this.getTaskIndex();
        const Type = this.getTaskType();
        const AnswerData = this.state.answers[Index];

        if (AnswerData)
            return AnswerData.value;
        else
        {
            switch (Type)
            {
                case 0:
                    return "";
                default:
                    return [];
            }
        }
    }


    setTaskAnswers(answer)
    {
        const State = this.state;
        const Index = this.getTaskIndex();
        const Answers = State.answers;
        Answers[Index].value = answer;

        this.setState({
            answers: Answers
        });
    }


    getCurrentTask()
    {
        const Inputs = this.getTasks();
        return Inputs[this.getTaskIndex()];
    }


    getLastTask()
    {
        const Inputs = this.getTasks();
        return Inputs[this.state.lastInput];
    }


    getTaskType()
    {
        return this.getCurrentTask().Type;
    }


    getTaskTitle()
    {
        return this.getCurrentTask().Title;
    }


    getTaskOptions()
    {
        return this.getCurrentTask().Options;
    }


    getOptionMax()
    {
        return this.getCurrentTask().Max;
    }


    headerClick(target)
    {
        const Id = target.id;

        this.setState({
            activeHeader: Id
        });
    }


    welcomeRender()
    {
        return (
            <ContentContainer>
                <ContentTitle>Welcome!</ContentTitle>
                <ContentBody>Wait for the remaining participants, or until the administrator starts the presentation</ContentBody>
                <IconLoader />
                <ContentFooter>2 Participants</ContentFooter>
            </ContentContainer>
        );
    }


    finishedRender()
    {
        const LastInput = this.getLastTask();
        const LastType = LastInput.Type;

        let Word;

        switch (LastType)
        {
            case 0:
                Word = "Input";
                this.inputsEdit();
                break;
            default:
                Word = "Vote";
                break;
        }

        return (
            <ContentContainer>
                <ContentTitle
                    blue >
                    {Word} sent!
                </ContentTitle>
                <IconDone />
                <ContentBody
                    boxed >
                    You may send another {Word}! or you can take it easy while waiting for the next task.
                </ContentBody>
                <ContentButton
                    onClick={this.inputsEdit} >
                    New {Word}
                </ContentButton>
            </ContentContainer>
        );
    }


    closedRender()
    {
        return (
            <ContentContainer>
                <ContentTitle
                    blue >
                    Task Closed
                </ContentTitle>

                <IconDone />

                <ContentBody
                    boxed >
                    This task appears to be closed, please remain patient.
                </ContentBody>

                <ContentButton>Nothing at all</ContentButton>
            </ContentContainer>
        );
    }


    questionChange(e)
    {
        const Target = e.target;
        const Value = Target.value;
        Target.style.height = "inherit";
        Target.style.height = `${Target.scrollHeight + 1}px`;

        this.setTaskAnswers(Value);
    }


    questionRender()
    {
        const TitleChange = (e) => {
            const Target = e.target;
            const Value = Target.value;

            this.setState({
                title: Value
            });
        };
        const HandleInvalid = () => {
            const Description = this.getTaskAnswers();

            if (Description.length < 3)
            {
                if (this.TextDescription.current)
                    this.TextDescription.current.focus();

                return;
            }
            else if (Description.length > 30)
            {
                const Title = this.state.title;

                if (Title.length < 3)
                {
                    if (this.TextTitle.current)
                        this.TextTitle.current.focus();

                    return;
                }
            }
        };

        const HandleEnter = (e) => {
            if (e.key === "Enter")
            {
                e.preventDefault();
                e.stopPropagation();
                if (this.TextForm.current)
                    this.TextForm.current.click();
            }
        };

        const OnTitleFocus = () => {
            if (this.state.title.trim() === "")
            {
                let Title = this.getTaskAnswers().substring(0, 30).trim();
                let Index = Title.lastIndexOf(" ");

                if (Index !== -1)
                {
                    Index = 0;
                    for (let I = 0; I < 3; I++)
                    {
                        const Check = Title.indexOf(" ", Index + 1);

                        if (Check === -1)
                        {
                            if (Index > 0)
                                break;
                            else
                            {
                                Index = 30;
                                break;
                            }
                        }
                        else
                            Index = Check;
                    }

                    Title = Title.substring(0, Index);
                }
                this.setState({
                    title: Title
                });
            }
        };

        return (
            <ContentContainer>
                <Form
                    autoComplete="off"
                    onInvalid={HandleInvalid}
                    onSubmit={this.inputsClick}
                    style={{ height: "100%" }} >
                    <ContentQuestion>{this.getTaskTitle()}</ContentQuestion>

                    <Box
                        height="calc(100% - 50px)"
                        m={1}
                        mb={2}
                        p={1}
                        position="relative"
                        width="100%" >
                        <ContentInput
                            disabled={this.getTaskAnswers().length <= 30}
                            fullWidth
                            helperText={`${this.state.title.length}/30`}
                            inputProps={{
                                minlength: 3,
                                maxlength: 30,
                                autocomplete: "off"
                            }}
                            inputRef={this.TextTitle}
                            isTitle
                            label="Title"
                            margin="none"
                            onChange={TitleChange}
                            onFocus={(e) => OnTitleFocus(e)}
                            required
                            value={this.state.title}
                            variant="outlined" />

                        <ContentInput
                            autoFocus={true}
                            fullWidth
                            helperText={`${this.getTaskAnswers().length}/250`}
                            inputProps={{ minlength: 3, maxlength: 250, autofocus: true, autocomplete: "off" }}
                            inputRef={this.TextDescription}
                            label="Description"
                            margin="none"
                            multiline
                            name="description"
                            onChange={(e) => this.questionChange(e)}
                            required
                            rows={5}
                            rowsMax={10}
                            value={this.getTaskAnswers()}
                            variant="outlined" />
                    </Box>

                    <ContentButton
                        ref={this.TextForm}
                        type="submit"
                        value="Submit" >
                        {this.getTaskAnswers().length < 3 ?
                             "Write an input to send!" :
                             (this.getTaskAnswers().length > 30 && this.state.title < 3) ?
                             "Write a title before sending!" :
                             "Send Input!"}
                    </ContentButton>
                </Form>
            </ContentContainer>
        );
    }


    choicePick(picked)
    {
        const Index = this.getTaskIndex();
        const Max = this.getOptionMax();

        if (picked.length >= this.getTaskAnswers().length && picked.length > Max)
            return;

        var Chosen = [];

        picked.forEach(pick => {
            var PickData = pick.split("-");
            var ChoiceIndex = parseInt(PickData[0]);

            if (ChoiceIndex === Index)
            {
                Chosen.push(pick);

                if (Chosen.length >= Max)
                {
                    this.setTaskAnswers(Chosen);
                    return;
                }
            }
        });

        this.setTaskAnswers(Chosen);
    }


    pointsChange(index, value)
    {
        const Answers = this.getTaskAnswers();
        let Spent = 0;
        const Tasks = this.getTasks();
        let Value = parseInt(value);
        const Change = Value - Answers[index];

        if (Tasks[this.getTaskIndex()].Amount < Tasks[this.getTaskIndex()].Spent + Change)
        {
            const Maximum = Tasks[this.getTaskIndex()].Amount - Tasks[this.getTaskIndex()].Spent;

            if (Maximum < 1)
                return false;
            else
                Value = Maximum;
        }


        for (let I = 0; I < this.getTaskOptions().length; I++)
        {
            if (Answers[I] == undefined)
                Answers[I] = 0;

            if (index === I)
                Answers[I] = Value;

            if (Answers[I] > 0)
                Spent += Answers[I];
        }

        Tasks[this.getTaskIndex()].Spent = Spent;
        this.setState({
            inputs: Tasks
        });
        this.setTaskAnswers(Answers);
        return true;
    }


    sliderChange(index, value)
    {
        const Answers = this.getTaskAnswers();
        Answers[index] = value;
        this.setTaskAnswers(Answers);
    }


    inputsClick(e)
    {
        e.preventDefault();
        const State = this.state;
        const Current = this.getTaskIndex();

        const Type = this.getTaskType();
        const Answer = this.getTaskAnswers();

        // Send the input
        const Code = sessionStorage.getItem("code");
        let User = "anonymous";
        if (State.loggedIn)
            User = localStorage.getItem("user");

        var Data = {
            UserID: User
        };

        // Send
        if (Type === 0)
        { // Open Text
            Data.Description = Answer.trim();

            if (Data.Description.length > 30)
            {
                if (this.state.title.trim().length < 3)
                    return false;
                Data.Title = this.state.title.trim();
            }

            Axios.post(`client/${Code}/add-text-open`, Data);
        }
        else if (Type === 1)
        { // Multiple Choice
            Answer.forEach(option => {
                var OptionData = option.split("-");
                var Index = parseInt(OptionData[1]);
                Data.Option = Index;

                Axios.post(`client/${Code}/add-vote-multi`, Data);
            });
        }
        else if (Type === 2)
        { // Points
            Data.Points = Answer;
            Axios.post(`client/${Code}/add-vote-points`, Data);
        }
        else if (Type === 3)
        { // Slider
            Data.Ratings = Answer;
            Axios.post(`client/${Code}/add-vote-slider`, Data);
        }

        this.parseAnswers();

        this.setState({
            lastInput: Current,
            sessionState: 2,
            title: ""
        });
        return true;
    }


    inputsEdit()
    {
        const LastInput = this.state.lastInput;
        this.setState({
            currentInput: LastInput,
            sessionState: 1
        });
    }


    logout()
    {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
    }


    choiceRender()
    {
        return (
            <ContentContainer>

                <ContentQuestion>
                    {this.getTaskTitle()}
                </ContentQuestion>

                <MultipleChoiceGroup
                    name={`group-${this.getTaskIndex()}`}
                    onChange={this.choicePick}
                    toggle
                    type="checkbox"
                    value={this.getTaskAnswers()}
                    vertical >

                    {this.getTaskOptions().map((choice) =>
                        <MultipleChoiceButton
                            key={choice.Index}
                            name={`${this.getTaskIndex()}-${choice.Title}-${choice.Index}`}
                            size="lg"
                            value={`${this.getTaskIndex()}-${choice.Index}`} >

                            <Tick>
                                <TickStem />
                                <TickKick />
                            </Tick>

                            {choice.Title}
                        </MultipleChoiceButton>
                    )}
                </MultipleChoiceGroup>

                <ContentButton
                    onClick={this.inputsClick} >
                    Send Vote
                </ContentButton>
            </ContentContainer>
        );
    }


    pointsRender()
    {
        const Task = this.getCurrentTask();
        const Answers = this.state.answers[this.getTaskIndex()];
        return (
            <ContentContainer>
                <ContentQuestion>{Task.Title}</ContentQuestion>
                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={2}
                    px={2} >
                    {Task.Options.map((point) =>
                        <Box
                            borderColor="transparent"
                            component="fieldset"
                            key={point.Index}
                            mb={3}
                            pt={1}
                            px={1} >
                            <Typography
                                component="legend" >
                                {point.Title}
                            </Typography>
                            <Rating
                                max={Task.Max}
                                name={point.Title}
                                onChange={(e, value) =>
                                    this.pointsChange(point.Index, value)}
                                value={Answers !== undefined ?
                                           Answers.value[point.Index] :
                                           0
                                } />
                        </Box>
                    )}
                </Box>
                <ContentButton
                    disabled={Task.Spent !== Task.Amount}
                    onClick={this.inputsClick} >
                    {Task.Spent !== Task.Amount ?
                         (Task.Amount - Task.Spent) + " points left!" :
                         "Send Vote"}
                </ContentButton>
            </ContentContainer>
        );
    }


    sliderRender()
    {
        const Task = this.getCurrentTask();
        const Answers = this.state.answers[this.getTaskIndex()];
        const Marks = [
            {
                value: Task.Min,
                label: `${Task.Min}`
            },
            {
                value: Task.Max,
                label: `${Task.Max}`
            }
        ];

        return (
            <ContentContainer>
                <ContentQuestion>{Task.Title}</ContentQuestion>
                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={2}
                    pt={1}
                    px={2} >
                    {Task.Options.map((slider) =>
                        <Box
                            borderColor="transparent"
                            component="fieldset"
                            key={slider.Index}
                            mb={4}
                            pt={2}
                            px={1} >
                            <Typography
                                component="legend" >
                                {slider.Title}
                            </Typography>
                            <Slider
                                aria-labledby="discrete-slider"
                                marks={Marks}
                                max={Task.Max}
                                min={Task.Min}
                                name={slider.Title}
                                onChange={(e, value) => this.sliderChange(slider.Index, value)}
                                step={1}
                                value={Answers !== undefined ?
                                           Answers.value[slider.Index] :
                                           Task.Min}
                                valueLabelDisplay="on" />
                        </Box>
                    )}
                </Box>
                <ContentButton
                    onClick={this.inputsClick} >
                    Send Vote
                </ContentButton>
            </ContentContainer>
        );
    }


    processScreens()
    {
        const State = this.state.sessionState;

        switch (State)
        {
            case 0: // Start Screen
                return this.welcomeRender();
            case 1: // Answer Screen
                if (this.getCurrentTask() !== undefined)
                {
                    const Type = this.getTaskType();
                    const Answer = this.getTaskAnswers();

                    if (Answer !== 0 && this.getCurrentTask().InProgress)
                    {
                        if (Type === 0)
                            return this.questionRender();
                        else if (Type === 1)
                            return this.choiceRender();
                        else if (Type === 2)
                            return this.pointsRender();
                        else if (Type === 3)
                            return this.sliderRender();
                    }
                    else if (!this.getCurrentTask().InProgress)
                        return this.closedRender();
                }
                else
                {
                    if (this.getTaskIndex() > 0)
                        return this.finishedRender();
                    else
                        return this.welcomeRender();
                }

            default: // Wait for more questions
                return this.finishedRender();
        }
    }


    renderPage()
    {
        const Tab = this.state.activeHeader;

        switch (Tab)
        {
            default:
                return this.processScreens();
        }
    }


    tabTitle(type)
    {
        let Title;
        const Task = this.getCurrentTask();

        switch (type)
        {
            case 0:
                Title = "Open Text";
                break;
            case 1:
                Title = `Pick your ${this.getOptionMax() > 1 ?
                                     this.getOptionMax() + " favorites!" :
                                     "favorite!"}`;
                break;
            case 2:
                Title = `Give Points: ${Task.Spent == undefined ?
                                        Task.Amount :
                                        Task.Amount - Task.Spent} points left!`;
                break;
            case 3:
                Title = "Slider";
                break;
            default:
                Title = "Waiting";
                break;
        }

        if (Task.Countdown > -1)
            Title += `  |  Timer: ${Task.Countdown} seconds`;

        return Title;
    }


    secondsToMinutes = (countdown) => {
        let Seconds = countdown, Minutes = 0;
        while (Seconds >= 60)
        {
            Minutes += 1;
            Seconds -= 60;
        }
        return `Time: ${Minutes}:${Seconds < 10 ?
                                   `0${Seconds}` :
                                   Seconds}`;
    }


    render()
    {
        return (
            <React.Fragment>
                <MainContainer>
                    <ThemeProvider
                        theme={Theme} >
                        {
                        //    <Header>
                        //    <HeaderText
                        //        active={this.state.activeHeader}
                        //        id="inputs"
                        //        onClick={(e) => this.headerClick(e.target)} >
                        //        {this.getCurrentTask() !== undefined ?
                        //             this.tabTitle(this.getTaskType()) :
                        //             "Waiting"}
                        //    </HeaderText>
                        //</Header>
                    }
                        {this.getCurrentTask() && this.getCurrentTask().InProgress && this.getCurrentTask().Countdown > -1 &&
                        <div
                            style={{
                                zIndex: "10",
                                position: "absolute",
                                height: "50px",
                                lineHeight: "50px",
                                textAlign: "center",
                                minWidth: "150px",
                                border: "1px solid black",
                                borderRadius: "15px",
                                left: "50px",
                                top: "25px",
                                backgroundColor: "#fff",
                                color: this.getCurrentTask().Countdown < 11 && this.getCurrentTask().Countdown > -1 ?
                                           "red" :
                                           "black"
                            }} >
                            {this.secondsToMinutes(this.getCurrentTask().Countdown)}
                        </div>
                    }
                        {this.renderPage()}
                        <Snackbar
                            autoHideDuration={2000}
                            onClose={() => this.setState({ snackbar: false })}
                            open={this.state.snackbar} >
                            <MuiAlert
                                onClose={() => this.setState({ snackbar: false })}
                                severity="success" >
                                Message Sent
                            </MuiAlert>
                        </Snackbar>
                    </ThemeProvider>
                </MainContainer>
            </React.Fragment>
        );
    }
}