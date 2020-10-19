import Axios from "axios";
import "circular-std";
import React, { Component } from "react";
import { Form, Nav } from "react-bootstrap";
import Styled from "styled-components";
import { Ico_Box, Ico_MultipleChoice, Ico_Points, Ico_Slider, Ico_Text } from "../../../Classes/Icons";
import { PageModal } from "../../../Services/PageModal";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import MenuIcon from "@material-ui/icons/Menu";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const CollectionContainer = Styled.div`
    width: ${props => props.shown
        ? "calc(100% - 50px)"
        : "0%"};
    background: #fff;
    height: 100%;
    top: 0;
    border: 1px solid #575b75;
    border-left: 0;
    border-bottom: 0;
    display: inline-block;
    position: absolute;
    overflow: hidden;
    overflow-y: ${props => props.shown
        ? "auto"
        : "hidden"};
    left: 0;
    scrollbar-width: thin;
    scrollbar-color: #4C7AD3 #fff;
    z-index: 10;
`;

const CreateTask = Styled.div`
    color: #100e0e;
    position: relative;
    font-size: 1rem;
    font-family: CircularStd;
    font-weight: 600;
    padding: 10px;
    opacity: 25%;
    height: 100px;
    text-align: center;
    line-height: 100px;

    &:hover {
        cursor: pointer;
        opacity: 75%;
    };
`;

export function Collection(props) {
    const Drop = e => {
        e.preventDefault();
        e.stopPropagation();
        const Task = JSON.parse(e.dataTransfer.getData("task"));
        const Target = props.children.length - 1;
        const Code = sessionStorage.getItem("code");

        Axios.post(`admin/${Code}/question${Task.index}-move${Target}`).then(props.update(true));
    };

    const DragOver = e => {
        e.preventDefault();
    };

    return (
        <CollectionContainer onDragOver={DragOver}
            onDrop={Drop}
            shown={props.shown}>
            {props.children}
            <CreateTask onClick={props.createTask}>➕ Create new task</CreateTask>
        </CollectionContainer>
    );
}

const TaskContainer = Styled.div`
    border-bottom: 2px solid #BABABA;
    color: #100e0e;
    position: relative;
    font-size: 1rem;
    font-family: CircularStd;
    display:flex;
    font-weight: 500;
    padding: 10px;
    height: 100px;
    overflow: hidden;
    background: ${props => props.active
        ? "#d4d4de"
        : "#fff"};

    &:hover {
        cursor: pointer;
    };

`;

const TaskIndex = Styled.div`
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 5px;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    margin-right: 10px;
`;

const TitleContainer = Styled.div`
    margin-left: 20px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    height: 3rem;

`;

const TaskType = Styled.div`
    font-size: 0.90rem;
    opacity: 50%;
`;

const TaskTitle = Styled.div`
    vertical-align: top;
    text-align: top;
    display: block;
`;

const ModalText = Styled.h1`
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1rem;
    position: relative;
    margin-bottom: 20px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
`;

const CancelButton = Styled(Nav.Link)`
    color: #100e0e;
    background: #fff;
    position: relative;
    display: inline-block;
    left: 0;
    top: 0;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
`;

const CreateButton = Styled.input`
    color: #fff;
    background: #4C7AD3;
    position: relative;
    display: inline-block;
    left: 0;
    top: 0;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
`;

const TaskLock = Styled.div`
    height: 20px;
    width: 20px;
    right: 10px;
    position: absolute;
    top: 80%;
    transform: translateY(-50%);
    display: ${props => props.showcase
        ? "none"
        : "block"};

    .icon {
        width: 20px;
        height: 20px;
    }
`;

const ResultsHide = Styled(TaskLock)`
    right: 40px;
`;

const RemoveButton = Styled(TaskLock)`
    position: absolute;
    right: 10px;
    height: 14px;
    width: 14px;
    top: 15%;
    transform: translateY(-50%);
    display: ${props => props.showcase
        ? "none"
        : "block"};
`;

export class Task extends Component {
    state = {
        modal: {
            delete: false
        },
        hover: false
    }

    drag = {
        start: (e) => {
            const Data = {
                index: this.props.id
            };

            e.dataTransfer.setData("task", JSON.stringify(Data));
        },

        over: (e) => {
            e.preventDefault();
        },

        drop: (e) => {
            e.preventDefault();
            e.stopPropagation();

            const Task = JSON.parse(e.dataTransfer.getData("task"));
            const Target = this.props.id;
            const Code = sessionStorage.getItem("code");

            Axios.post(`admin/${Code}/question${Task.index}-move${Target}`).then(this.props.update(true));
        }
    }

    modal = {
        delete: {
            open: (e) => {
                e.stopPropagation();
                this.setState({
                    modal: {
                        delete: true
                    }
                });
            },

            content: () => {
                const DeleteTask = (e) => {
                    e.preventDefault();
                    const Code = sessionStorage.getItem("code");

                    Axios.post(`admin/${Code}/task-delete-${this.props.id}`).then(this.props.update(true));
                    this.modal.delete.close(e);
                };

                return (
                    <Form autoComplete="off"
                        onSubmit={(e) => DeleteTask(e)}>
                        <ModalText>
                            Are you sure you want to delete this task?
                            <br /> This action can not be undone
                        </ModalText>
                        <CancelButton onClick={() => this.modal.delete.close()}>Cancel</CancelButton>
                        <CreateButton type="submit"
                            value="Submit" />
                    </Form>
                );
            },

            close: () => {
                this.setState({
                    modal: {
                        delete: false
                    }
                });
            }
        }
    }

    toggleTask = (e) => {
        e.stopPropagation();
        const Code = sessionStorage.getItem("code");

        Axios.post(`admin/${Code}/task-toggle${this.props.id}`).then(() => {
            setTimeout(this.props.update(), 250);
        });
    }

    hideResults = (e) => {
        e.stopPropagation();
        const Code = sessionStorage.getItem("code");

        Axios.post(`admin/${Code}/question-results-toggle${this.props.id}`).then(() => {
            setTimeout(this.props.update(), 250);
        });
    }

    hover = {
        enter: (e) => {
            e.stopPropagation();
            this.setState({ hover: true });
        },
        leave: (e) => {
            e.stopPropagation();
            this.setState({ hover: false });
        }
    }

    render() {
        return (
            <React.Fragment>
                <TaskContainer active={this.props.active}
                    draggable
                    id={this.props.id}
                    onClick={this.props.onClick.bind(this)}
                    onDoubleClick={this.props.onDoubleClick}
                    onDragOver={this.drag.over}
                    onDragStart={this.drag.start}
                    onDrop={this.drag.drop}
                    onMouseEnter={this.hover.enter}
                    onMouseLeave={this.hover.leave}
                    type={this.props.type}>
                    <TaskIndex id={this.props.id}>
                        {this.props.id + 1}
                    </TaskIndex>
                    {this.props.type < 2
                        ? this.props.type === 0
                            ? <Ico_Text id={this.props.id} style={{
                                height: "60px",
                                width: "55px",
                                marginTop: "10px",
                                marginRight: "5px"
                            }} />
                            : <Ico_MultipleChoice style={{ height: "60px", width: "60px", marginTop: "10px" }} />
                        : this.props.type === 2
                            ? <Ico_Points id={this.props.id} style={{ height: "60px", width: "60px", marginTop: "10px" }} />
                            : <Ico_Slider id={this.props.id} style={{ height: "60px", width: "60px", marginTop: "10px" }} />
                    }
                    <TitleContainer id={this.props.id}>
                        <TaskType id={this.props.id}>
                            {this.props.type === 0
                                ? "Text"
                                : this.props.type === 1
                                    ? "Multiple Choice"
                                    : this.props.type === 2
                                        ? "Points"
                                        : "Slider"}
                        </TaskType>
                        <TaskTitle id={this.props.id}>
                            {this.props.title}
                        </TaskTitle>
                    </TitleContainer>
                    <TaskLock isBigScreen={this.props.toggle}
                        onClick={this.toggleTask}>
                        {this.props.InProgress
                            ? <LockOpenIcon style={{ opacity: "60%", color: "black" }} className="icon" />
                            : <LockIcon style={{
                                opacity: this.state.hover
                                    ? "60%"
                                    : "0%",
                                color: "black"
                            }} className="icon" />
                        }
                    </TaskLock>

                    <ResultsHide isBigScreen={this.props.toggle}
                        onClick={this.hideResults}>
                        {this.props.ShowResults
                            ? <VisibilityIcon style={{
                                opacity: this.state.hover
                                    ? "60%"
                                    : "0%",
                                color: "black"
                            }} className="icon" />
                            : <VisibilityOffIcon style={{ opacity: "60%", color: "black" }} className="icon" />
                        }
                    </ResultsHide>

                    <RemoveButton id={this.props.key}
                        onClick={this.modal.delete.open.bind(this)}
                        style={{ opacity: "60%", color: "black" }}>
                        <MenuIcon className="icon"
                            style={{ opacity: "100%", color: "black" }} />
                    </RemoveButton>
                </TaskContainer>

                {this.state.modal.delete &&
                    <PageModal body={this.modal.delete.content()} onClose={this.modal.delete.close.bind(this)} title="Confirm Delete" />}
            </React.Fragment>
        );
    }
}