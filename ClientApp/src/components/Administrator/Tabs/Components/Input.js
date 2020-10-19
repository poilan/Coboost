import React, { Component } from "react";
import Styled from "styled-components";
import "circular-std";
import Axios from "axios";
import { Modal } from "react-bootstrap";
import { Button, Popper, Box, Typography, Paper, Hidden } from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

const Container = Styled.div`
        display: ${props => props.vote
        ? "block"
        : "inline-block"};
        width: calc((${props => props.size <= 2
        ? (props.size === 2
            ? "(100% - 20px) / 2"
            : "100% - 20px")
        : (props.size === 4
            ? "(100% - 20px) / 4"
            : "(100% - 20px) / 3")}) - 2%);
        font-family: CircularStd;
        font-size: 1rem;
        line-height: ${props => props.vote
        ? "1.25rem"
        : "2rem"};
        font-weight: 600;
        margin: ${props => props.vote
        ? "0.5"
        : "1"}%;
        box-sizing: border-box;
        padding: 10px;
        border-radius: ${props => props.vote
        ? "0"
        : "0.8rem"};
        box-shadow: ${props => props.vote
        ? ""
        : "0 1px 0 1px rgba(0, 0, 0, .08)"};
        background: #fff;
        border-top: ${props => props.vote
        ? "2px solid #cfcfcf"
        : ""};
        box-shadow: ${props => props.checked
        ? "0 0 0 5px #4075ff"
        : ""};
        position: relative;
        overflow: ${props => props.vote
        ? "visible"
        : "hidden"};
        white-space: ${props => props.vote
        ? "normal"
        : "nowrap"};

        &:hover {
            filter: brightness(80%) drop-shadow(6px 6px 3px black);
            cursor: ${props => props.showcase
        ? "default"
        : "grab"};
        }
        &:active {
            cursor: ${props => props.showcase
        ? "default"
        : "grabbing"};
        }
`;

const MergeStack = Styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    box-shadow: 0 0 4px 2px #000;
    top: -4px;
    left: -4px;
    border-radius: 0.8rem;
    pointer-events: none;
`;

const MergedNumber = Styled.div`
    position: absolute;
    opacity: 70%;
    right: 12px;
    top: -5px;
    font-size: 0.8rem;
    pointer-events: none;
`;

const MoreText = Styled(MoreHorizIcon)`
    position: absolute;
    right: 15px;
    opacity: 70%;
    bottom: 0px;
    pointer-events: none;
`;

const RowNumber = Styled.h1`
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
        poppingAnchor: null
    }

    dragStart = e => {
        e.stopPropagation();
        if (this.props.showcase) {
            return;
        }
        const Data = {
            member: this.props.member,
            group: this.props.group
        };
        e.dataTransfer.setData("drag", JSON.stringify(Data));
    }

    handleClicks = e => {
        e.stopPropagation();
        if (this.props.showcase) {
            return;
        }

        const Id = e.target.id;
        if (this.state.clickTimeout !== null) {
            if (this.props.double !== undefined) {
                this.props.double(Id);
            }
            clearTimeout(this.state.clickTimeout);
            this.state.clickTimeout = null;
        }
        else {
            this.state.clickTimeout = setTimeout(() => {
                if (this.props.onClick !== undefined) {
                    this.props.onClick(Id);
                }
                clearTimeout(this.state.clickTimeout);
                this.state.clickTimeout = null;
            },
                250);
        }
    }

    hover = {
        enter: (e) => {
            if (this.props.title === this.props.description) {
                return;
            }

            this.setState({
                poppingAnchor: e.currentTarget
            });
        },
        leave: () => {
            if (this.props.title === this.props.description) {
                return;
            }

            this.setState({
                poppingAnchor: null
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                {!this.props.showcase &&
                    this.props.member % this.props.size === 0 &&
                    <RowNumber id={this.props.id}>{(this.props.member / this.props.size) + 1}</RowNumber>}
                <Container checked={this.props.checked}
                    column={this.props.column}
                    draggable={!this.props.showcase}
                    group={this.props.group}
                    id={this.props.id}
                    member={this.props.member}
                    onClick={(e) => this.handleClicks(e)}
                    onDragStart={this.dragStart}
                    onMouseEnter={this.hover.enter}
                    onMouseLeave={this.hover.leave}
                    showcase={this.props.showcase}
                    size={this.props.size}
                    vote={this.props.vote}>
                    {this.props.title}

                    {this.props.isMerged != undefined &&
                        !this.props.showcase &&
                        this.props.isMerged !== 0 &&
                        <React.Fragment>
                            <MergedNumber>{this.props.isMerged}</MergedNumber>
                            <MergeStack />
                        </React.Fragment>
                    }
                    {this.props.title !== this.props.description &&
                        <React.Fragment>
                            <MoreText />
                            <PopoverDetails anchorEl={this.state.poppingAnchor}
                                title={this.props.title} description={this.props.description}
                            />
                        </React.Fragment>
                    }
                </Container>
            </React.Fragment>
        );
    }
}

const ModalPage = Styled(Modal)`
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

const DetailsContainer = Styled.div`
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    min-height: 150px;
    padding: 15px;
`;

const Titles = Styled.h1`
    width: 50%;
    position: relative;
    text-align: left;
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1rem;
`;

const Users = Styled.h1`
    position: relative;
    width: 50%;
    font-size: 1rem;
    opacity: 80%;
    float: right;
`;

const Descriptions = Styled.p`
    width: 100%;
    font-size: 1rem;
    position: relative;
    padding-left: 10px;
`;

const ShowChildren = Styled.input`
    color: #fff;
    background: #4C7AD3;
    position: relative;
    display: inline-block;
    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    width: 100%;

    &:hover {
        opacity: 75%;
        cursor: pointer;
    }
`;

const Children = Styled.div`
    display: flex;
    flex-direction: column;
    background: #ccc;
    border-radius: 20px;
    margin: 30px;
    width: 100%;
`;

const Child = Styled(DetailsContainer)`
    max-height: 200px;
`;

const Separate = Styled(Button)`
    position: absolute !important;
    top: 10px;
    right: 10px;
    display: ${props => props.isMerged
        ? "block"
        : "none"} !important;
`;

export class InputDetails extends React.Component {
    state = {
        showChildren: true,
        showing: true
    }

    content() {
        const Kids = this.props.answer.Children;

        return (
            <DetailsContainer>
                {this.details(this.props.answer)}
                <Separate isMerged={Kids != undefined}
                    onClick={() => this.Separate(this.props.answer.group, this.props.answer.Index)}
                    variant="contained">
                    Separate All
                </Separate>
                {Kids && //If this is merged input add button to show them.
                    <ShowChildren value={this.state.showChildren ? "Hide Merged Inputs" : "Show Merged Inputs"}
                        onClick={() => this.setState({ showChildren: !this.state.showChildren })} />
                }

                {this.state.showChildren &&
                    Kids &&
                    <Children>
                        {Kids.map(child =>
                            <Child>
                                {this.details(child)}
                            </Child>)
                        }
                    </Children>
                }
            </DetailsContainer>
        );
    }

    Separate(group, member) {
        if (this.props.answer.Children != undefined) {
            const Code = sessionStorage.getItem("code");

            Axios.post(`admin/${Code}/question-split${group}-${member}`);
            this.close();
        }
    }

    details(answer) {
        const Title = answer.Title;
        const Description = answer.Description;
        const User = answer.UserID;
        return (
            <React.Fragment>
                <Titles id={answer.group != undefined
                    ? answer.group + "-" + answer.Index
                    : "merged"
                }
                    onDoubleClick={answer.group != undefined
                        ? (e) => this.props.rename(e)
                        : ""
                    }>
                    {Title}
                </Titles>
                <Users>
                    {User}
                </Users>
                {Title !== Description &&
                    <Descriptions>
                        {Description}
                    </Descriptions>
                }
            </React.Fragment>
        );
    }

    close() {
        this.setState({
            showChildren: false,
            answer: undefined,
            showing: false
        });

        if (this.props.close !== undefined) {
            this.props.close();
        }
    }

    render() {
        return this.props.answer
            ? <ModalPage centered
                onHide={this.close.bind(this)}
                show={this.state.showing}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Input Details
                             </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.content()}
                </Modal.Body>
            </ModalPage>
            : null;
    }
}

class PopoverDetails extends Component {
    state = {
        lock: false //If true the popover will not disappear when you stop hovering
    }

    // ReSharper disable once ThisInGlobalContext
    open = Boolean(this.props.anchorEl);

    handleClick = (e) => {
        e.stopPropagation();
        const Lock = !this.state.lock;
        this.setState({
            lock: Lock
        });
        console.log(`Input Popper was ${Lock}`
            ? "LOCKED"
            : "UNLOCKED");
    }

    render() {
        return (
            <Popper anchorEl={this.props.anchorEl}
                modifiers={{ arrow: { enabled: true } }}
                onClick={this.handleClick}
                open={Boolean(this.props.anchorEl)}
                placement="bottom"
                style={{ pointerEvents: "none" }}>
                <Paper elevation={3}>
                    <Box p={0}>
                        <Box component="fieldset"
                            m={1}
                            maxWidth={500}
                            overflow="hidden"
                            p={1}
                            textOverflow="ellipsis"
                            width={350}>
                            <Typography component="legend"
                                variant="h6">
                                {this.props.title}
                            </Typography>
                            <Typography variant="body1">{this.props.description}</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Popper>
        );
    }
}