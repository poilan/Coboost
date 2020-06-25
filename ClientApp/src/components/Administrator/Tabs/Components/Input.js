import React from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';

const Container = styled.div`
        display: ${props => props.vote ? "block" : "inline-block"};
        width: calc((${props => props.size <= "2" ? (props.size == "2" ? "(100% - 20px) / 2" : "100% - 20px") : (props.size == "4" ? "(100% - 20px) / 4" : "(100% - 20px) / 3")}) - 2%);
        font-family: CircularStd;
        font-size: ${props => props.vote ? "2em" : "1em"};
        font-weight: 600;
        margin: 1%;
        box-sizing: border-box;
        padding: 10px;
        border-radius: 0.8em;
        box-shadow: 0 1px 0 1px rgba(0, 0, 0, .08);
        background: #fff;
        border: ${props => props.vote ? "2px solid #000" : ""};
        position: relative;
        overflow: hidden;
        white-space: nowrap;
`;

const CheckboxContainer = styled.div`
    height: 100%;
    float: left;
    display: inline-block;
    margin-right: 10px;
`;

const Checkbox = styled.input`
    border-radius: 0.5em;
    height: 1.3em;
    width: 1.3em;
    border: 1px solid #aaa;
    box-sizing: border-box;
    background: #fff;
    vertical-align: middle;
    -webkit-appearance: none;
    outline: none;
    appearance: none;
    margin: 0 5%;

    &:checked {
        background: #4C7AD3;
    }

    &:hover {
        cursor: pointer;
    }
`;

const Percentage = styled.div`
    height: 100%;
    position: absolute;
    background: #4C7AD3;
    opacity: 40%;
    width: ${props => props.percentage}%;
    border-radius: 0.8em;
    left: 0;
    top: 0;
    pointer-events: none;
`;

const RowNumber = styled.h1`
    display: inline-block;
    color: #fff;
    width: 20px;
    margin: 1% 0;
    padding: 10px 0;
    clear: left;
    float: left;
    font-family: CircularStd;
    font-Size: 1em;
    text-align: left;
    vertical-align: center;
    height: 44px;
    font-weight: 700;
`;

export function Input(props) {
    const dragStart = e => {
        e.stopPropagation();
        let data = {
            member: props.member,
            group: props.group,
        };
        e.dataTransfer.setData('drag', JSON.stringify(data));
    }

    const handleDouble = e => {
        if (props.double !== undefined) {
            props.double(e);
        }
    }

    return (
        <>
            {props.member % props.size == 0 &&
                <RowNumber id={props.id}>{(props.member / props.size) + 1}</RowNumber>}
            <Container id={props.id} member={props.member} group={props.group} column={props.column}
                size={props.size} vote={props.vote}
                onDoubleClick={(e) => handleDouble(e)}
                draggable={!props.showcase} onDragStart={dragStart}>
                {!props.showcase &&
                    <CheckboxContainer>
                        <Checkbox id={props.id} type="checkbox"
                            checked={props.checked}
                            onChange={props.onCheck}
                        />
                    </CheckboxContainer>}
                {props.title}
            </Container>
        </>
    );
}