import React, { Component } from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';
import { Ico_Text, Ico_MultipleChoice, Ico_Box, Ico_Points, Ico_Slider } from '../../../Classes/Icons';
import { Nav, Form } from 'react-bootstrap';
import { PageModal } from '../../../Services/PageModal';

const CollectionContainer = styled.div`
    width: 25%;
    min-width: 400px;
    background: #fff;
    height: 98%;
    top: 1%;
    border-radius: 10px;
    display: inline-block;
    position: absolute;
    overflow: auto;
    left: 1%;
    scrollbar-width: thin;
    scrollbar-color: #4C7AD3 #fff;
`;

const CreateTask = styled.div`
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
    const drop = e => {
        e.preventDefault();
        e.stopPropagation();
        const task = JSON.parse(e.dataTransfer.getData('task'));
        const target = props.children.length - 1;
        const code = sessionStorage.getItem('code');

        axios.post(`admin/${code}/question${task.index}-move${target}`).then(props.update(true));
    }

    const dragOver = e => {
        e.preventDefault();
    }

    return (
        <CollectionContainer onDrop={drop} onDragOver={dragOver}>
            {props.children}
            <CreateTask onClick={props.createTask}>➕ Create new task</CreateTask>
        </CollectionContainer>
    );
}

const TaskContainer = styled.div`
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
    background: ${props => props.active ? "#d4d4de" : "#fff"};

    &:hover {
        cursor: pointer;
    };

`;

const TaskIndex = styled.div`
    line-height: 78px;
    margin-left: 30px;
    margin-right: 30px;
`;

const TitleContainer = styled.div`
    margin-left: 30px;
`;

const TaskType = styled.div`
    font-size: 0.95rem;
    opacity: 50%;
    margin-top: 15px;
`;

const TaskTitle = styled.div`
    vertical-align: top;
    text-align: top;
    height: 40px;
    line-height: 40px;
    display: block;
`;

const ModalText = styled.h1`
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1rem;
    position: relative;
    margin-bottom: 20px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
`;

const CancelButton = styled(Nav.Link)`
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

const CreateButton = styled.input`
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

const RemoveButton = styled(Ico_Box)`
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    display: ${props => props.showcase ? "none" : "block"};
`;

export class Task extends Component {
    state = {
        modal: {
            delete: false,
        }
    }

    drag = {
        start: (e) => {
            let data = {
                index: this.props.id,
            }

            e.dataTransfer.setData('task', JSON.stringify(data));
        },

        over: (e) => {
            e.preventDefault();
        },

        drop: (e) => {
            e.preventDefault();
            e.stopPropagation();

            const task = JSON.parse(e.dataTransfer.getData('task'));
            const target = this.props.id;
            const code = sessionStorage.getItem('code');

            axios.post(`admin/${code}/question${task.index}-move${target}`).then(this.props.update(true));
        }
    }

    modal = {
        delete: {
            open: (e) => {
                e.stopPropagation();
                this.setState({
                    modal: {
                        delete: true,
                    }
                });
            },

            content: () => {
                const deleteTask = (e) => {
                    e.preventDefault();
                    let code = sessionStorage.getItem("code");

                    axios.post(`admin/${code}/task-delete-${this.props.id}`).then(this.props.update(true));
                    this.modal.delete.close(e);
                }

                return (
                    <Form autoComplete="off" onSubmit={(e) => deleteTask(e)}>
                        <ModalText>Are you sure you want to delete this task? <br /> This action can not be undone</ModalText>
                        <CancelButton onClick={() => this.modal.delete.close()}>Cancel</CancelButton>
                        <CreateButton type="submit" value="Submit" />
                    </Form>
                );
            },

            close: () => {
                this.setState({
                    modal: {
                        delete: false,
                    }
                });
            }
        }
    }

    render() {
        return (
            <>
                <TaskContainer id={this.props.id}
                    draggable onDragStart={this.drag.start} onDragOver={this.drag.over}
                    onDrop={this.drag.drop}
                    onClick={this.props.onClick.bind(this)} onDoubleClick={this.props.onDoubleClick}
                    active={this.props.active} type={this.props.type}>
                    <TaskIndex id={this.props.id}>{this.props.id + 1}</TaskIndex>
                    {this.props.type < 2 ? this.props.type == 0 ? <Ico_Text id={this.props.id} style={{ height: "60px", width: "60px", marginTop: "10px", }} /> : <Ico_MultipleChoice style={{ height: "60px", width: "60px", marginTop: "10px", }} />
                        : this.props.type == 2 ? <Ico_Points id={this.props.id} style={{ height: "60px", width: "60px", marginTop: "10px", }} /> : <Ico_Slider id={this.props.id} style={{ height: "60px", width: "60px", marginTop: "10px", }} />}
                    <TitleContainer id={this.props.id}>
                        <TaskType id={this.props.id}>{this.props.type == 0 ? "Text" : this.props.type == 1 ? "Multiple Choice" : this.props.type == 2 ? "Points" : "Slider"}</TaskType>
                        <TaskTitle id={this.props.id}>{this.props.title}</TaskTitle>
                    </TitleContainer>
                    <RemoveButton id={this.props.id} onClick={this.modal.delete.open.bind(this)}></RemoveButton>
                </TaskContainer>
                {this.state.modal.delete && <PageModal title="Confirm Delete" body={this.modal.delete.content()} onClose={this.modal.delete.close.bind(this)} />}
            </>
        );
    }
}