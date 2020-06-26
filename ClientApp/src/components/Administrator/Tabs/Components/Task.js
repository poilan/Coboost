import React, { Component } from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';
import { Ico_Text, Ico_MultipleChoice } from '../../../Classes/Icons';
import { Session } from '../../Session';

const CollectionContainer = styled.div`
    width: 20%;
    background: #fff;
    height: 95%;
    top: 2.5%;
    border-radius: 10px;
    display: inline-block;
    position: absolute;
    overflow: auto;
    left: 2.5%;

    scrollbar-width: thin;
    scrollbar-color: #4C7AD3 #fff;
`;

const CreateTask = styled.div`
    color: #100e0e;
    position: relative;
    font-size: 1.5em;
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

        axios.post(`admin/${code}/question${task.index}-move${target}`).then(this.props.update());
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
    font-size: 1.25em;
    font-family: CircularStd;
    display:flex;
    font-weight: 500;
    padding: 10px;
    height: 100px;
    overflow: hidden;
    background: ${props => props.active ? "#f4f4f4" : "#fff"};

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
    font-size: 0.75em;
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

const ModalTitle = styled.h1`
    color: #fff;
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1.25em;
    opacity: 90%;
    position: absolute;
    top: 20px;
    vertical-align: center;
    left: 15px;
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
    right: 2.5%;
    top: 0.5%;
    color: #fff;
    font-weight: 600;
    display: ${props => props.showcase ? "none" : "block"};
`;

export class Task extends Component {
    state = {
        modal: {
            delete: true,
        }
    }

    drag = {
        start: (e) => {
            let data = {
                index: props.id,
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
            const target = props.id;
            const code = sessionStorage.getItem('code');

            axios.post(`admin/${code}/question${task.index}-move${target}`).then(this.props.update());
        }
    }

    modal = {
        delete: {
            open: () => {
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

                    axios.post(`admin/delete-${code}`);
                    this.modal.delete.close();
                }

                return (
                    <Form autoComplete="off" onSubmit={(e) => deleteTask(e)}>
                        <ModalTitle>Are you sure you want to delete this task? This action can not be undone</ModalTitle>
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
            <TaskContainer id={this.props.id}
                draggable onDragStart={this.drag.start} onDragOver={this.drag.over}
                onDrop={this.drag.drop}
                onClick={this.props.onClick} onDoubleClick={this.props.onDoubleClick}
                active={this.props.active} type={this.props.type}>
                <TaskIndex id={this.props.id}>{this.props.id + 1}</TaskIndex>
                {props.type == 0 ? <Ico_Text id={this.props.id} style={{ height: "60px", marginTop: "10px", }} /> : this.props.type == 1 ? <Ico_MultipleChoice style={{ height: "60px", marginTop: "10px", }} /> : <div style={{ background: "#CCC", height: "50px", width: "50px", marginTop: "15px", fontSize: "1.25em", padding: "7.5px", borderRadius: "1000px" }}>➕</div>}
                <TitleContainer id={this.props.id}>
                    <TaskType id={this.props.id}>{this.props.type == 0 ? "Text" : this.props.type == 1 ? "Multiple Choice" : "New Task"}</TaskType>
                    <TaskTitle id={this.props.id}>{this.props.title}</TaskTitle>
                </TitleContainer>
                <RemoveButton id={this.props.id} onClick={() => this.modal.delete.open()}>...</RemoveButton>
                {this.state.modal.delete && <PageModal title="Confirm Delete" body={this.modal.delete.content()} onClose={this.modal.delete.close} />}
            </TaskContainer>
        );
    }
}