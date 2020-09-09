import React, { Component } from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { Button, Popper, Box, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const Container = styled.div`
        display: ${props => props.vote ? "block" : "inline-block"};
        width: calc((${props => props.size <= "2" ? (props.size == "2" ? "(100% - 20px) / 2" : "100% - 20px") : (props.size == "4" ? "(100% - 20px) / 4" : "(100% - 20px) / 3")}) - 2%);
        font-family: CircularStd;
        font-size: 1rem;
        line-height: ${props => props.vote ? "1.25rem" : "2rem"};
        font-weight: 600;
        margin: ${props => props.vote ? "0.5" : "1"}%;
        box-sizing: border-box;
        padding: 10px;
        border-radius: ${props => props.vote ? "0" : "0.8rem"};
        box-shadow: ${props => props.vote ? "" : "0 1px 0 1px rgba(0, 0, 0, .08)"};
        background: #fff;
        border-top: ${props => props.vote ? "2px solid #cfcfcf" : ""};
        box-shadow: ${props => props.checked ? "0 0 0 5px #4075ff" : ""};
        position: relative;
        overflow: ${props => props.vote ? "visible" : "hidden"};
        white-space: ${props => props.vote ? "normal" : "nowrap"};
`;

const MergeStack = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    box-shadow: 0 0 4px 2px #000;
    top: -4px;
    left: -4px;
    border-radius: 0.8rem;
    pointer-events: none;
`;

const MergedNumber = styled.div`
    position: absolute;
    opacity: 70%;
    right: 12px;
    top: -5px;
    font-size: 0.8rem;
    pointer-events: none;
`;

const MoreText = styled(MoreHorizIcon)`
    position: absolute;
    right: 15px;
    opacity: 70%;
    bottom: 0px;
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
    pointer-events: none;
`;

export class Input extends Component {
    state = {
        clickTimeout: null,
        poppingAnchor: null,
    }

    dragStart = e => {
        e.stopPropagation();
        let data = {
            member: this.props.member,
            group: this.props.group,
        };
        e.dataTransfer.setData('drag', JSON.stringify(data));
    }

    handleClicks = e => {
        e.stopPropagation();
        const id = e.target.id;
        if (this.state.clickTimeout !== null) {
            if (this.props.double !== undefined) {
                this.props.double(id);
            }
            clearTimeout(this.state.clickTimeout);
            this.state.clickTimeout = null;
        } else {
            this.state.clickTimeout = setTimeout(() => {
                if (this.props.onClick !== undefined) {
                    this.props.onClick(id);
                }
                clearTimeout(this.state.clickTimeout);
                this.state.clickTimeout = null;
            }, 200)
        }
    }

    hover = {
        enter: (e) => {
            if (this.props.title === this.props.description)
                return;

            this.setState({
                poppingAnchor: e.currentTarget,
            });
        },
        leave: () => {
            if (this.props.title === this.props.description)
                return;

            this.setState({
                poppingAnchor: null,
            });
        },
    }

    render() {
        return (
            <>
                {!this.props.showcase && this.props.member % this.props.size == 0 &&
                    <RowNumber id={this.props.id}>{(this.props.member / this.props.size) + 1}</RowNumber>}
                <Container id={this.props.id} member={this.props.member} group={this.props.group} column={this.props.column}
                    size={this.props.size} vote={this.props.vote}
                    onClick={(e) => this.handleClicks(e)}
                    draggable={!this.props.showcase} onDragStart={this.dragStart}
                    checked={this.props.checked}
                    onMouseEnter={this.hover.enter} onMouseLeave={this.hover.leave}
                >
                    {this.props.title}

                    {this.props.isMerged != undefined && !this.props.showcase && this.props.isMerged != 0 &&
                        <>
                            <MergedNumber>{this.props.isMerged}</MergedNumber>
                            <MergeStack />
                        </>
                    }
                    {this.props.title !== this.props.description &&
                        <>
                            <MoreText />
                            <PopoverDetails anchorEl={this.state.poppingAnchor} title={this.props.title} description={this.props.description} />
                        </>
                    }
                </Container>
            </>
        );
    }
}

const ModalPage = styled(Modal)`
    font-family: CircularStd;

    .modal-content {
        min-width: 720px;
    }

    .modal-title {
        font-size: 1rem;
        opacity: 70%;
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
    padding: 15px;
`;

const Title = styled.h1`
    width: 50%;
    position: relative;
    text-align: left;
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1rem;
`;

const User = styled.h1`
    position: relative;
    width: 50%;
    font-size: 1rem;
    opacity: 80%;
    float: right;
`;

const Description = styled.p`
    width: 100%;
    font-size: 1rem;
    position: relative;
    padding-left: 10px;
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
    background: #ccc;
    border-radius: 20px;
    margin: 30px;
    width: 100%;
`;

const Child = styled(DetailsContainer)`
    max-height: 200px;
`;

const Unmerge = styled(Button)`
    position: absolute !important;
    top: 10px;
    right: 10px;
    display: ${props => props.isMerged ? "block" : "none"} !important;
`;

export class InputDetails extends React.Component {
    state = {
        showChildren: true,
        answer: this.props.answer,
        showing: true,
    }

    content() {
        const children = this.props.answer.Children;

        return (
            <DetailsContainer>
                {this.details(this.props.answer)}
                <Unmerge isMerged={children != undefined} variant="contained" onClick={() => this.unmerge(this.props.answer.group, this.props.answer.Index)}>Unmerge All</Unmerge>
                {children != undefined && //If this is merged input add button to show them.
                    <ShowChildren value={this.state.showChildren ? "Hide Merged Inputs" : "Show Merged Inputs"} onClick={() => this.setState({ showChildren: !this.state.showChildren })} />}

                {this.state.showChildren && children != undefined &&
                    <Children>{children.map(child =>
                        <Child>{this.details(child)}</Child>)}
                    </Children>}
            </DetailsContainer>
        );
    }

    unmerge(group, member) {
        if (this.props.answer.Children != undefined) {
            const code = sessionStorage.getItem("code");

            axios.post(`admin/${code}/question-unmerge${group}-${member}`);
            this.close();
        }
    }

    details(answer) {
        const title = answer.Title;
        const description = answer.Description;
        const user = answer.UserID;
        return (
            <>
                <Title id={answer.group != undefined ? answer.group + "-" + answer.Index : "merged"} onDoubleClick={answer.group != undefined ? (e) => this.props.rename(e) : ""}>{title}</Title>
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
                    <Modal.Title>Input Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.content()}</Modal.Body>
            </ModalPage>
    }
}

class PopoverDetails extends Component {
    state = {
        lock: false, //If true the popover will not disapear when you stop hovering
    }
    open = Boolean(this.props.anchorEl);

    handleClick = (e) => {
        e.stopPropagation();
        const lock = !this.state.lock
        this.setState({
            lock: lock
        });
        console.log("Input Popper was " + lock ? "LOCKED" : "UNLOCKED");
    }

    render() {
        return (
            <Popper anchorEl={this.props.anchorEl} open={this.open}>
                <Box component="fieldset" margin={1} padding={1} maxWidth={40}>
                    <Typography component="legend">{this.props.title}</Typography>
                    <Typography variant="body1">{this.props.description}</Typography>
                </Box>
            </Popper>
        );
    }
}