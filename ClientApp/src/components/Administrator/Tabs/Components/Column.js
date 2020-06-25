import React from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';

const Container = styled.div`
    width: ${props => props.width * 320}px;
    height: 100%;
    position: relative;
    overflow: auto;
    padding: 10px;
    display: ${props => props.empty ? "none" : "inline-block"};
    white-space: normal;
    margin-top: 20px;
    border-right: ${props => props.showcase ? "none" : "2px solid #C4C4C4"};
    scrollbar-width: thin;
    scrollbar-color: #4C7AD3 #fff;
`;

const WidthControl = styled.div`
    width: ${props => props.width * 320}px;
    position: absolute;
    display: ${props => props.empty ? "none" : "inline-block"};
    height: 0;
`;

const Grow = styled.div`
    position: absolute;
    right: -17px;
    top: -12px;
    font-size: 2.5em;
    font-family: CircularStd;
    color: #C4C4C4;
    display ${props => props.id == "new" ? "none" : props.available ? "inline-block" : "none"};
    text-align: right;
   

    &:hover {
        cursor: pointer;
        color: #545454; 
    }
`;

const Shrink = styled(Grow)`
    text-align: left;
    right: -3px;
`;

export function Column(props) {
    const drop = e => {
        e.preventDefault();
        const drag = JSON.parse(e.dataTransfer.getData('drag'));
        let code = sessionStorage.getItem("code");

        if (drag.member !== undefined) {
            //Create new group
        }
        else if(drag.column !== props.column){
            let key = drag.group;
            let target = props.column;

            axios.post(`admin/${code}/change-group${key}-column${target}`);
        }
    }

    const dragOver = e => {
        if (props.column == 0) {
            e.stopPropagation();
        } else {
            e.preventDefault();
        }
    }

    return (
        <>
            <WidthControl empty={props.empty || (props.column == 0 && props.children[0][0] !== undefined && props.children[0][0].props.children.length < 1)} width={props.width}>
                <Shrink available={props.width > 1} onClick={() => props.shrink(props.column)}>&#129080;</Shrink>
                <Grow available={props.width < 4} onClick={() => props.grow(props.column)}>&#129082;</Grow>
            </WidthControl>
            <Container showcase={props.empty} empty={props.column == 0 && props.children[0][0] !== undefined && props.children[0][0].props.children.length < 1} column={props.column} width={props.width} onDrop={drop} onDragOver={dragOver}>
            {props.children}
            </Container>
        </>
    );
}