import React from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';

const GroupContainer = styled.div`
        width: 100%;
        display: ${props => props.empty ? "none" : "block"};
        background: ${props => props.group == "0" ? "#808ca2" : "#4C7AD3"};
        padding: 10px;
        padding-top: 65px;
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 1px 0 1px rgba(0, 0, 0, .12);
        vertical-align: top;
        position: relative;
        opacity: ${props => props.group == "new" ? "50%" : "100%"};

        &:hover {
           opacity: ${props => props.group == "new" ? "90%" : "100%"};
           cursor: ${props => props.group == "new" ? "pointer" : "default"};
        }
    `;

const IDChars = styled.h1`
    display: inline-block;
    color: #fff;
    width: ${props => props.size <= "2" ? (props.size == "2" ? "50%" : "100%") : (props.size == "4" ? "25%" : "33%")};
    font-family: CircularStd;
    font-Size: 1.25em;
    margin: 0;
    padding: 10px;
    text-align: center;
    font-weight: 700;
    clear: both;
`;

const GroupTitle = styled.h1`
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

const GroupMenu = styled.div`
    position: absolute;
    right: 2.5%;
    top: 0.5%;
    color: #fff;
    font-weight: 600;
`;

export function Group(props) {
    const drop = e => {
        e.preventDefault();
        e.stopPropagation();

        const drag = JSON.parse(e.dataTransfer.getData('drag'));
        let code = sessionStorage.getItem("code");

        if (drag.member !== undefined) {
            console.log(props);
            var key = [drag.group, drag.member];
            var target = props.group;

            if (target == "new") {
            }
            else
                axios.post(`admin/${code}/group-${key[0]}/change-${target}/member-${key[1]}`);
        }
        else if (props.column !== 0 && drag.column !== props.column) {
            let key = drag.group;
            let target = props.column;

            axios.post(`admin/${code}/change-group${key}-column${target}`);
        }
    }

    const dragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    const dragStart = e => {
        let data = {
            group: props.group,
            column: props.column,
        }

        e.dataTransfer.setData('drag', JSON.stringify(data));
    }

    const handleDouble = e => {
        if (props.double !== undefined && props.group != "0") {
            props.double(e);
        }
    }

    const remove = () => {
        let code = sessionStorage.getItem("code");

        axios.post(`admin/${code}/question-remove-group${props.group}`);
    }

    return (
        <GroupContainer id={props.id + "-title"} group={props.group} column={props.column}
            onClick={props.onClick} size={props.size} empty={props.id == "0" && props.children.length < 1}
            onDrop={drop} onDragOver={dragOver}
            draggable={props.group != "0"} onDragStart={dragStart}>            
            <GroupTitle onDoubleClick={(e) => handleDouble(e)} id={props.id + "-title"}>{props.title}</GroupTitle>
            {props.size <= "2" ?
                (props.size == "2" ?
                    <>
                        <IDChars size={props.size} id={props.id + "-title"}>A</IDChars>
                        <IDChars size={props.size} id={props.id + "-title"}>B</IDChars>
                    </>
                    :
                    ""
                ) : (props.size == "4" ?
                    <>
                        <IDChars size={props.size} id={props.id + "-title"}>A</IDChars>
                        <IDChars size={props.size} id={props.id + "-title"}>B</IDChars>
                        <IDChars size={props.size} id={props.id + "-title"}>C</IDChars>
                        <IDChars size={props.size} id={props.id + "-title"}>D</IDChars>
                    </>
                    :
                    <>
                        <IDChars size={props.size} id={props.id + "-title"}>A</IDChars>
                        <IDChars size={props.size} id={props.id + "-title"}>B</IDChars>
                        <IDChars size={props.size} id={props.id + "-title"}>C</IDChars>
                    </>
                )
            }
            {props.children}
            {props.group != 0 && <GroupMenu id={props.id + "-title"} onClick={() => remove()}>...</GroupMenu>}
        </GroupContainer>
    );
}