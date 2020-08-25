import React from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';

const Container = styled.div`
    width: ${props => props.width * 320}px;
    height: ${props => props.showcase ? "" : "95%"};
    position: relative;
    overflow: ${props => props.showcase ? "hidden" : "auto"};
    padding: ${props => props.showcase ? "0" : "10px"};
    display: ${props => props.empty ? "none" : props.showcase ? "block" : "inline-block"};
    white-space: normal;
    margin-top: ${props => props.showcase ? "" : "20px"};
    border-right: ${props => props.showcase ? "none" : "2px solid #C4C4C4"};
    scrollbar-width: thin;
    scrollbar-color: #575b75 #fff;
    vertical-align: top;
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
    top: -15px;
    font-size: 2.5rem;
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
            axios.post(`admin/${code}/question-create-group-C${props.column}`).then(setTimeout(() => { axios.post(`admin/${code}/group${drag.group}-member${drag.member}`) }, 200))
        }
        else if (drag.column !== props.column) {
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
            <WidthControl empty={props.empty || props.last || (props.column == 0 && props.children[0][0] !== undefined && props.children[0][0].props.children.length < 1)} width={props.width}>
                <Shrink available={props.width > 1} onClick={() => props.shrink(props.column)}>&#129080;</Shrink>
                <Grow available={props.width < 4} onClick={() => props.grow(props.column)}>&#129082;</Grow>
            </WidthControl>
            <Container showcase={props.empty} empty={props.column == 0 && props.children[0][0] !== undefined && props.children[0][0].props.children.length < 1} column={props.column} width={props.width} onDrop={drop} onDragOver={dragOver}>
                {props.children}
            </Container>
        </>
    );
}