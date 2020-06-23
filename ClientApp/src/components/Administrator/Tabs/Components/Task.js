import React from 'react';
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

        axios.post(`admin/${code}/question${task.index}-move${target}`).then(props.updateTasks());
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

export function Task(props) {
    const drop = e => {
        e.preventDefault();
        e.stopPropagation();

        const task = JSON.parse(e.dataTransfer.getData('task'));
        const target = props.id;
        const code = sessionStorage.getItem('code');

        axios.post(`admin/${code}/question${task.index}-move${target}`).then(props.updateTasks());
    }

    const dragOver = e => {
        e.preventDefault();
        //e.stopPropagation();
    }

    const dragStart = e => {
        let data = {
            index: props.id,
        }

        e.dataTransfer.setData('task', JSON.stringify(data));
    }

    return (
        <TaskContainer id={props.id}
            draggable onDragStart={dragStart} onDragOver={dragOver}
            onDrop={drop}
            onClick={props.onClick} onDoubleClick={props.onDoubleClick}
            active={props.active} type={props.type}>
            <TaskIndex id={props.id}>{props.id + 1}</TaskIndex>
            {props.type == 0 ? <Ico_Text id={props.id} style={{ height: "60px", marginTop: "10px", }} /> : props.type == 1 ? <Ico_MultipleChoice style={{ height: "60px", marginTop: "10px", }} /> : <div style={{ background: "#CCC", height: "50px", width: "50px", marginTop: "15px", fontSize: "1.25em", padding: "7.5px", borderRadius: "1000px" }}>➕</div>}
            <TitleContainer id={props.id}>
                <TaskType id={props.id}>{props.type == 0 ? "Text" : props.type == 1 ? "Multiple Choice" : "New Task"}</TaskType>
                <TaskTitle id={props.id}>{props.title}</TaskTitle>
            </TitleContainer>
        </TaskContainer>
    );
}