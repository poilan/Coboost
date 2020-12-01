import React from "react";
import Styled from "styled-components";
import Axios from "axios";
import {Presentation} from "./Presentation";
import {BannerDropdown, BannerLink} from "../Classes/Dropdown";
import {BsFullscreen, BsFullscreenExit, BsJustify} from "react-icons/bs";
import {Tab, Col, Card} from "react-bootstrap";
import {Facilitator} from "../Big Screen/Facilitator";
import {CreateTaskModal} from "./Tabs/Components/CreateModal";
import {Collection, Task} from "./Tabs/Components/Task";
import {Organizer} from "./Tabs/Organizer";
import {Tasks} from "./Tabs/Tasks";
import {Breadcrumbs, Link, Menu, MenuItem, Divider, createMuiTheme, ThemeProvider} from "@material-ui/core";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import {borderRadius, borderRight} from "@material-ui/system";


const Theme = createMuiTheme({
    palette: {
        primary: {
            main: "#374785",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#24305E",
            contrastText: "#ffffff"
        }

    }
});

const MainContainer = Styled.div`
    display: table;
    height: 100%;
    width: 100%;
    left: 0;
    background: #E4E4E4;
    position: absolute;
`;

const Banner = Styled(Col)`
    position: fixed;
    background: ${props => props.task ?
                           "#24305E" :
                           "#374785"};
    height: 5%;
    width: 100%;
    min-height: 50px;
    top: 0;
    left: 0;
    z-index: 11;
`;

const BreadCrumb = Styled(Breadcrumbs)`
     &&& {
        font-family: CircularStd;
        font-Size: 1.25rem;
        color: #fff;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
    }
`;

const BreadText = Styled(Link)`
    color: #fff;
    font-size: 1.25rem;
`;

const BannerCode = Styled.div`
    font-family: CircularStd;
    font-Size: 1.25rem;
    display: inline-block;
    color: #fff;
    top: 50%;
    float: right;
    position: relative;
    margin-right: 20px;
    transform: translateY(-50%);
    text-align: center;
`;

const ContentCard = Styled(Card)`
    position: absolute;
    top: max(5%, 50px);
    width: 100%;
    left: 0;
    height: calc(100% - max(50px, 5%));
    padding: 0;
    background: #e4e4e4;
    border: 0;
`;

const DivButton = Styled.div`
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
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

const FullscreenButton = Styled.button`
    background: #fff;
    border: none;
    border-radius: 10px;
    color: #100E0E;
    outline: none;
    position: relative;
    float: right;
    top: 50%;
    transform: translateY(-50%);

    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    padding: 7px 20px;

    :not(:first-child) {
        margin: 0px 2px;
    }

    :hover {
        /*background: none;*/
        border: none;

        color: #4C7AD3;
    };

    :focus {
        outline: none;
        box-shadow: 0 0 0px 3px rgba(76,122,211, 0.5); // Same color as text, just using RGB so opacity can be altered
    }
`;

export class Administrator extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            title: "",
            code: 0,
            tasks: [],
            columns: [],
            active: 0,

            tab: "organize",
            presenter: null,

            showList: true,
            fullscreen: false,

            modal: {
                create: false,
                type: 0
            },
            popup: false
        };

        this.present = this.present.bind(this);
        this.logout = this.logout.bind(this);
    }


    componentDidMount()
    {
        const Code = sessionStorage.getItem("code");
        const Title = sessionStorage.getItem("title");
        const PresentManager = new Presentation(Code);

        document.addEventListener("keypress", (e) => {
            if (!this.state.popup)
            {
                if (e.key === "|")
                {
                    this.setState({
                        showList: !this.state.showList
                    });
                }
                else if (e.key === " ")
                {
                    document.activeElement.blur();
                    if (this.state.tab === "task")
                        this.selectTab("organize");
                    else
                        this.selectTab("task");
                }
            }
        });

        document.addEventListener("keydown", (e) => {
            if (this.state.popup)
                return;

            if (e.keyCode === 37 || e.keyCode === 38)
            {
                e.preventDefault();
                this.controls.back();
            }
            else if (e.keyCode === 39 || e.keyCode === 40)
            {
                e.preventDefault();
                this.controls.next();
            }
        });

        document.addEventListener("fullscreenchange", (e) => {
            if (document.fullscreenElement)
            {
                this.setState({
                    fullscreen: true
                });
            }
            else
            {
                this.setState({
                    fullscreen: false
                });
            }
        });

        this.setState({
            title: Title,
            code: Code,
            presenter: PresentManager
        });
        this.update();
    }


    componentWillUnmount()
    {
        this.SSE.close();
        const Code = sessionStorage.getItem("code");
        Axios.post(`admin/${Code}/close`);
    }


    update = async () => {
        this.SSE.close();
        const Code = sessionStorage.getItem("code");
        await Axios.get(`admin/${Code}/questions-all`).then((res) => {
            if (res.status === 202)
            {
                const TaskList = res.data;
                this.setState({
                    tasks: TaskList
                });

                Axios.post(`admin/${Code}/save`);

                if (this.state.active < this.state.tasks.length)
                    this.SSE.start(this.state.active);
                else if (this.state.tasks.length > 0)
                    this.SSE.start(0);
            }
            else if (res.status === 412)
            {
                //session not found
            }
        });
    }


    SSE = {
        source: undefined,

        addColumn: () => {
            const Column = {
                index: this.state.columns.length,
                width: 1
            };

            let Columns = this.state.columns;

            Columns ?
                Columns.push(Column) :
                Columns = [Column];
            this.setState({
                columns: Columns
            });
        },

        start: (target) => {
            if (target >= this.state.tasks.length || target < 0)
                return;

            this.SSE.close();

            const Code = sessionStorage.getItem("code");
            this.setState({
                active: parseInt(target)
            });
            Axios.post(`admin/${Code}/active-${target}`);

            this.SSE.source = new window.EventSource(`admin/${Code}/stream-question-${target}`);

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Groups", (e) => {
                try
                {
                    const Data = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    const Columns = this.state.columns;

                    this.state.columns = [];
                    TaskList[target].Groups = Data;

                    if (TaskList[target].Groups !== undefined)
                    {
                        for (let I = 0; I < TaskList[target].Groups.length; I++)
                        {
                            while (TaskList[target].Groups[I].Column + 1 >= this.state.columns.length)
                                this.SSE.addColumn();
                        }
                    }
                    else
                        this.SSE.addColumn();

                    for (let I = 0; I < this.state.columns.length; I++)
                    {
                        if (Columns[I] !== undefined)
                            this.state.columns[I].width = Columns[I].width;
                        else
                            break;
                    }
                    this.setState(
                        {
                            tasks: TaskList
                        });
                }
                catch (e)
                {
                    console.log(`Failed to parse server event: ${e.data}`);
                    console.log(e);
                }
            }, false);

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Options", (e) => {
                try
                {
                    const Data = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].Options = Data;

                    //if (tasks[target].options !== undefined) {
                    //    tasks[target].options.sort((a, b) => (a.Votes.length > b.Votes.length) ? -1 : 1);
                    //}
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log(`Failed to parse server event: ${e.data}`);
                    console.log(e);
                }
            }, false);

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Total", (e) => {
                try
                {
                    const Data = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].TotalVotes = Data;
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log(`Failed to parse server event: ${e.data}`);
                    console.log(e);
                }
            }, false);

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Votes", (e) => {
                try
                {
                    const Votes = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].Votes = Votes;
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log("Failed to parse server event: Votes");
                    console.log(e);
                }
            });

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Amount", (e) => {
                try
                {
                    const Amount = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].Amount = Amount;
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log("Failed to parse server event: Amount");
                    console.log(e);
                }
            });

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Status", (e) => {
                try
                {
                    const InProgress = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].InProgress = InProgress;
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log("Failed to parse server event: Status");
                    console.log(e);
                }
            });

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Timer", (e) => {
                try
                {
                    const Timer = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].Timer = Timer;
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log("Failed to parse server event: Countdown");
                    console.log(e);
                }
            });

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Countdown", (e) => {
                try
                {
                    const Countdown = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].Countdown = Countdown;
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log("Failed to parse server event: Countdown");
                    console.log(e);
                }
            });

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Results", (e) => {
                try
                {
                    const Results = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].ShowResults = Results;
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log("Failed to parse server event: Results");
                    console.log(e);
                }
            });

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("Archive", (e) => {
                try
                {
                    const Data = JSON.parse(e.data);
                    const TaskList = this.state.tasks;
                    TaskList[target].Archive = Data;
                    this.setState({
                        tasks: TaskList
                    });
                }
                catch (e)
                {
                    console.log(`Failed to parse server event: ${e.data}`);
                    console.log(e);
                }
            }, false);

            this.SSE.source.addEventListener("error", (e) => {
                if (e.readyState === window.EventSource.CLOSED)
                    console.log("SSE: connection closed");
                else
                    console.log(e);
            }, false);

            // ReSharper disable once Html.EventNotResolved
            this.SSE.source.addEventListener("open", () => { console.log("SSE: connection opened"); }, false);
        },

        close: () => {
            if (this.SSE.source !== undefined && this.SSE.source.readyState !== window.EventSource.CLOSED)
                this.SSE.source.close();
        }
    }


    HandleTimer = (e, index) => {
        const Code = sessionStorage.getItem("code");
        let Value = parseInt(e.target.value);
        const Tasks = this.state.tasks;

        if (Value < 1)
            Value = 1;
        else if (Value > 2147483647)
            Value = 2147483647;


        Tasks[index].Timer = Value;
        this.setState({
            tasks: Tasks
        });

        Axios.post(`admin/${Code}/task${index}-timer-${Value}`);
    };


    selectTab(key)
    {
        this.setState({
            tab: key
        });
    }


    present = () => {
        const State = this.state;
        const Presenter = State.presenter;

        Presenter.PresentInNewWindow();
    }


    logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
    }


    controls = {
        next: () => {
            const Index = this.state.active + 1;
            if (Index < this.state.tasks.length)
                this.SSE.start(Index);
        },

        back: () => {
            const Index = this.state.active - 1;
            if (Index >= 0)
                this.SSE.start(Index);
        }
    }


    shortcuts = {
        open: () => {
            this.setState({
                popup: true
            });
        },
        close: () => {
            this.setState({
                popup: false
            });
        }
    }


    create = {
        close: (success) => {
            this.setState({
                modal: {
                    create: false,
                    type: null
                }
            });

            this.shortcuts.close();

            if (success === true)
                this.update();
        },

        text: () => {
            this.setState({
                modal: {
                    create: true,
                    type: 0
                },
                anchor: null
            });
            this.shortcuts.open();
        },

        multipleChoice: () => {
            this.setState({
                modal: {
                    create: true,
                    type: 1
                },
                anchor: null
            });
            this.shortcuts.open();
        },

        points: () => {
            this.setState({
                modal: {
                    create: true,
                    type: 2
                },
                anchor: null
            });
            this.shortcuts.open();
        },

        slider: () => {
            this.setState({
                modal: {
                    create: true,
                    type: 3
                },
                anchor: null
            });
            this.shortcuts.open();
        },

        menu: (event) => {
            this.setState({
                anchor: event.currentTarget
            });
        }
    }


    toggleFullscreen = () => {
        const Document = window.document;
        const Element = Document.documentElement;

        const Request = Element.requestFullscreen ||
            Element.mozRequestFullScreen ||
            Element.webkitRequestFullScreen ||
            Element.msRequestFullscreen;
        const Cancel = Document.exitFullscreen ||
            Document.mozCancelFullScreen ||
            Document.webkitExitFullscreen ||
            Document.msExitFullscreen;

        let Fullscreen;

        if (!Document.fullscreenElement &&
            !Document.mozFullScreenElement &&
            !Document.webkitFullscreenElement &&
            !Document.msFullscreenElement)
        {
            Request.call(Element);
            Fullscreen = true;
        }
        else
        {
            Cancel.call(Document);
            Fullscreen = false;
        }

        this.setState({
            fullscreen: Fullscreen
        });
    }


    render()
    {
        return (
            <MainContainer>
                <ThemeProvider
                    theme={Theme} >
                    <Banner
                        task={this.state.tab === "task"} >
                        <BreadCrumb
                            aria-label="Breadcrumb"
                            separator="&#187;" >
                            <BreadText
                                color="initial"
                                href="/" >
                                Coboost
                            </BreadText>

                            <BreadText
                                color="initial"
                                href="/dashboard" >
                                Sessions
                            </BreadText>

                            <BreadText
                                color="initial"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.state.tab === "task" ?
                                        this.selectTab("organize") :
                                        this.selectTab("task");
                                }} >
                                {this.state.title}
                            </BreadText>

                        </BreadCrumb>

                        <BannerDropdown
                            style={{
                                float: "right",
                                position: "relative",
                                top: "50%",
                                transform: "translateY(-50%)"
                            }}
                            title={<BsJustify />} >
                            <BannerLink
                                onClick={this.present} >
                                Present in a new window
                            </BannerLink>
                            <Divider />
                            <BannerLink
                                onClick={this.logout} >
                                Logout
                            </BannerLink>
                        </BannerDropdown>

                        <FullscreenButton
                            onClick={this.toggleFullscreen} >
                            {this.state.fullscreen ?
                                 <React.Fragment>
                                     <BsFullscreenExit
                                         class="icon" />
                                 </React.Fragment> :
                                 <React.Fragment>
                                     <BsFullscreen
                                         class="icon" />
                                 </React.Fragment>
                            }
                        </FullscreenButton>

                        <BannerCode>
                            {this.state.code > 0 ?
                                 `Room: ${this.state.code.substr(0, 3)} ${this.state.code.substr(3, 3)}` :
                                 null}
                        </BannerCode>
                        <DivButton
                            onClick={() => {
                                this.state.tab === "task" ?
                                    this.selectTab("organize") :
                                    this.selectTab("task");
                            }}
                            style={{
                                left: "50%",
                                top: "50%",
                                position: "absolute",
                                height: "39px",
                                backgroundColor: this.state.tab === "task" ?
                                                     "#374785" :
                                                     "#24305E",
                                color: "#ffffff",
                                padding: "0 150px",
                                fontSize: "1.25rem",
                                fontWeight: "600",
                                textAlign: "justify",
                                borderRadius: "5px",
                                border: "3px solid #aaa",
                                transform: "translate(-50%, -50%)",
                                zIndex: "10"

                            }} >
                            {this.state.tab === "task" ?
                                 "Discussion" :
                                 "Organize"

                            }
                        </DivButton>
                    </Banner>

                    <ContentCard>
                        <Tab.Container
                            activeKey={this.state.tab}
                            onSelect={(k) => this.selectTab(k)} >
                            <div

                                style={{
                                    width: this.state.showList ?
                                               "calc(max(15%, 300px) + 5px)" :
                                               "5px",
                                    left: "0",
                                    position: "absolute",
                                    height: "100%",
                                    borderRight: "5px solid #414458"
                                }} >

                                {this.state.modal.create &&
                                    <CreateTaskModal
                                        onClose={this.create.close}
                                        type={this.state.modal.type} />
                                }
                                <Menu
                                    anchorEl={this.state.anchor}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center"
                                    }}
                                    id="CreateMenu"
                                    onClose={() => this.setState({ anchor: null })}
                                    open={Boolean(this.state.anchor)}
                                    transformOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center"
                                    }} >

                                    <MenuItem
                                        onClick={this.create.text} >
                                        Input: Open Text
                                    </MenuItem>

                                    <Divider />

                                    <MenuItem
                                        onClick={this.create.multipleChoice} >
                                        Vote: Multiple Choice
                                    </MenuItem>

                                    <Divider />

                                    <MenuItem
                                        onClick={this.create.points} >
                                        Vote: Points
                                    </MenuItem>

                                    <Divider />

                                    <MenuItem
                                        onClick={this.create.slider} >
                                        Vote: Slider
                                    </MenuItem>

                                </Menu>

                                <Collection
                                    createTask={(event) => this.create.menu(event)}
                                    shown={this.state.showList}
                                    update={this.update.bind(this)} >
                                    {this.state.tasks != undefined &&
                                        this.state.tasks.map(task =>
                                            <Task
                                                active={this.state.active === task.Index}
                                                id={task.Index}
                                                InProgress={task.InProgress}
                                                key={task.Index}
                                                onClick={(e) => this.SSE.start(e.target.id)}
                                                ShowResults={task.ShowResults}
                                                title={task.Title}
                                                type={task.Type}
                                                update={this.update.bind(this)} />
                                        )}
                                </Collection>

                                <DivButton
                                    onClick={() => { this.setState({ showList: !this.state.showList }); }}
                                    style={{
                                        width: "30px",
                                        right: "-35px",
                                        position: "absolute",
                                        height: "60px",
                                        backgroundColor: this.state.tab === "organize" ?
                                                             "#374785" :
                                                             "#24305E",
                                        color: "#ffffff",
                                        borderRight: "1px solid #fff",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        borderRadius: "0 30px 30px 0",
                                        zIndex: "10"
                                    }} >
                                    {this.state.showList ?
                                         <KeyboardArrowLeftIcon
                                             className="icon"
                                             style={{
                                                 width: "100%",
                                                 height: "auto",
                                                 position: "absolute",
                                                 top: "50%",
                                                 left: "0",
                                                 transform: "translateY(-50%)"
                                             }} /> :
                                         <KeyboardArrowRightIcon
                                             className="icon"
                                             style={{
                                                 width: "100%",
                                                 height: "auto",
                                                 position: "absolute",
                                                 top: "50%",
                                                 left: "0",
                                                 transform: "translateY(-50%)"
                                             }} />
                                    }
                                </DivButton>

                            </div>

                            <div
                                style={{
                                    width: this.state.showList ?
                                               "calc(min(85%, calc(100% - 300px)) - 5px)" :
                                               "calc(100% - 5px)",
                                    left: this.state.showList ?
                                              "calc(max(15%, 300px) + 5px)" :
                                              "5px",
                                    position: "absolute",
                                    height: "100%"
                                }} >
                                <Tab.Content>
                                    <Tab.Pane
                                        eventKey="task" >
                                        <Tasks
                                            active={this.state.active}
                                            changeTab={this.selectTab.bind(this)}
                                            columns={this.state.columns}
                                            SSE={this.SSE.start}
                                            tasks={this.state.tasks}
                                            update={this.update.bind(this)} />
                                    </Tab.Pane>
                                    <Tab.Pane
                                        eventKey="organize" >
                                        <Organizer
                                            active={this.state.active}
                                            changeTab={this.selectTab.bind(this)}
                                            columns={this.state.columns}
                                            handleTimer={this.HandleTimer}
                                            popClosed={this.shortcuts.close}
                                            popOpen={this.shortcuts.open}
                                            showControls={this.state.showList ?
                                                              true :
                                                              this.state.showControls}
                                            SSE={this.SSE.start}
                                            tasks={this.state.tasks}
                                            update={this.update.bind(this)} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </Tab.Container>
                    </ContentCard>
                </ThemeProvider>
            </MainContainer>
        );
    }
}