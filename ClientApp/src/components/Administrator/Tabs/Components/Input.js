import React, { Component } from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';
import { PageModal } from '../../../Services/PageModal';
import { Modal } from 'react-bootstrap';

const Container = styled.div`
        display: ${props => props.vote ? "block" : "inline-block"};
        width: calc((${props => props.size <= "2" ? (props.size == "2" ? "(100% - 20px) / 2" : "100% - 20px") : (props.size == "4" ? "(100% - 20px) / 4" : "(100% - 20px) / 3")}) - 2%);
        font-family: CircularStd;
        font-size: 1rem;
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
    font-Size: 1rem;
    text-align: left;
    vertical-align: center;
    height: 44px;
    font-weight: 700;
`;

export class Input extends Component {
    state = {
        clickTimeout: null,
    }

    dragStart = e => {
        e.stopPropagation();
        let data = {
            member: this.props.member,
            group: this.props.group,
        };
        e.dataTransfer.setData('drag', JSON.stringify(data));
    }

    handleDouble = e => {
        if (this.props.double !== undefined) {
            this.props.double(e);
        }
    }

    handleClicks = e => {
        console.log(this.state.clickTimeout);
        if (this.state.clickTimeout !== null) {
            this.props.double(e);
            clearTimeout(this.state.clickTimeout);
            this.state.clickTimeout = null;
        } else {
            this.state.clickTimeout = setTimeout(() => {
                this.props.onClick(this.props.id);
                console.log(this.state.clickTimeout);
                clearTimeout(this.state.clickTimeout);
                this.state.clickTimeout = null;
            }, 250)
        }
    }

    render() {
        return (
            <>
                {this.props.member % this.props.size == 0 &&
                    <RowNumber id={this.props.id}>{(this.props.member / this.props.size) + 1}</RowNumber>}
                <Container id={this.props.id} member={this.props.member} group={this.props.group} column={this.props.column}
                    size={this.props.size} vote={this.props.vote}
                    onClick={(e) => this.handleClicks(e)}
                    draggable={!this.props.showcase} onDragStart={this.dragStart}>
                    {!this.props.showcase &&
                        <CheckboxContainer>
                            <Checkbox id={this.props.id} type="checkbox"
                                checked={this.props.checked}
                                onChange={this.props.onCheck}
                                onClick={(e) => { e.stopPropagation() }}
                                onDoubleClick={(e) => { e.stopPropagation() }}
                            />
                        </CheckboxContainer>}
                    {this.props.title}
                </Container>
            </>
        );
    }
}

const ModalPage = styled(Modal)`
    border-radius: 20px;
    font-family: CircularStd;

    .modal-title {
        font-size: 1rem;
        opacity: 50%;
    }

    .modal-body {
        min-width: 720px;
    }
`;

const DetailsContainer = styled.div`
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    min-height: 150px;
`;

const Title = styled.h1`
    width: 100%;
    position: relative;
    text-align: left;
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1rem;
`;

const User = styled.h1`
    position: relative;
    width: 100%;
    font-size: 1rem;
    opacity: 80%;
    justify-content: end;
`;

const Description = styled.p`
    width: 100%;
    font-size: 1rem;
    position: relative;
`;

const ShowChildren = styled.input`
    color: #fff;
    background: #4C7AD3;
    position: relative;
    display: inline-block;
    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    width: 100%;

    &:hover {
        opactiy: 75%;
        cursor: pointer;
    }
`;

const Children = styled.div`
    display: flex;
    flex-direction: column;
`;

const Child = styled(DetailsContainer)`
    max-height: 200px;
`;

export class InputDetails extends React.Component {
    state = {
        showChildren: false,
        answer: this.props.answer,
        showing: true,
    }

    content() {
        const children = this.props.answer.Children;

        return (
            <DetailsContainer>
                {this.details(this.props.answer)}
                {children != undefined && //If this is merged input add button to show them.
                    <ShowChildren>
                        {this.state.showChildren ? "Show Merged Answers" : "Hide Merged Answers"}
                    </ShowChildren>}

                {this.state.showChildren &&
                    <Children>{children.map(child =>
                        <Child>{this.details(child)}</Child>)}
                    </Children>}
            </DetailsContainer>
        );
    }

    details(answer) {
        const title = answer.Title;
        const description = answer.Description;
        const user = answer.UserID;
        return (
            <>
                <Title>{title}</Title>
                <User>{user}</User>
                {title != description && <Description>{description}</Description>}
            </>
        )
    }

    close() {
        this.setState({
            showChildren: false,
            answer: undefined,
            showing: false,
        })

        if (this.props.close !== undefined)
            this.props.close();
    }

    render() {
        return this.props.answer == undefined ? null :
            <ModalPage show={this.state.showing} centered onHide={this.close.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Answer Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.content()}</Modal.Body>
            </ModalPage>
    }
}