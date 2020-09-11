import React, { Component } from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { PageModal } from '../../../Services/PageModal';
import { Ico_Box } from '../../../Classes/Icons';
import { Collapse, IconButton, Menu, MenuItem } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MenuIcon from '@material-ui/icons/Menu';
import { grey } from '@material-ui/core/colors';
import { ColorPicker } from './ColorPicker';

const GroupContainer = styled.div`
        width: 100%;
        display: ${props => props.empty ? "none" : "block"};
        background: ${props => props.group == "0" ? "#8c8da6" : props.color};
        padding: 10px;
        padding-top: 65px;
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 1px 0 1px rgba(0, 0, 0, .12);
        vertical-align: top;
        position: relative;
        opacity: ${props => props.group == "new" ? "50%" : "100%"};
        overflow: hidden;

        &:hover {
           opacity: 90%;
           cursor: ${props => props.group == "new" ? "pointer" : "default"};
        }
    `;

const IDChars = styled.h1`
    display: inline-block;
    color: #fff;
    width: ${props => props.size <= "2" ? (props.size == "2" ? "50%" : "100%") : (props.size == "4" ? "25%" : "33%")};
    font-family: CircularStd;
    font-Size: 1rem;
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
    font-size: 1rem;
    text-transform: uppercase;
    width: ${props => props.new ? "100%" : ""};
    text-align: ${props => props.new ? "center" : ""};
    opacity: 90%;
    position: absolute;
    top: ${props => props.new ? "50%" : "20px"};
    vertical-align: center;
    left: ${props => props.new ? "50%" : "15px"};
    transform: ${props => props.new ? "translate(-50%, -50%)" : ""};
`;

const GroupMenu = styled(MenuIcon)`
    position: absolute;
    right: 15px;
    top: 25px;
    color: #fff;
    font-weight: 600;
    display: ${props => props.showcase ? "none" : "block"};

    &:hover {
        background: rgba(0, 0, 0, .15);
        cursor: pointer;
    }
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

export class Group extends Component {
    state = {
        modal: {
            archive: false,
        },
        collapse: true,
        menuAnchor: null,
        colorAnchor: null,
        color: '#575b75'
    }
    validateHexColor = /^#([0-9A-F]{3}){1,2}$/;

    componentDidMount() {
        if (this.validateHexColor.test(this.props.color)) {
            this.setState({
                color: this.props.color,
            });
        }
    }

    modal = {
        archive: {
            open: () => {
                this.setState({
                    modal: {
                        archive: true,
                    }
                });
            },

            content: () => {
                const archive = (e) => {
                    e.preventDefault();
                    let code = sessionStorage.getItem("code");

                    axios.post(`admin/${code}/question-archive-group-${this.props.group}`);
                    this.modal.archive.close();
                }

                return (
                    <Form autoComplete="off" onSubmit={(e) => archive(e)}>
                        <ModalText>Are you sure you want to delete this group?</ModalText>
                        <CancelButton onClick={() => this.modal.archive.close()}>Cancel</CancelButton>
                        <CreateButton type="submit" value="Submit" />
                    </Form>
                );
            },

            close: () => {
                this.setState({
                    modal: {
                        archive: false,
                    }
                });
            }
        }
    }

    drag = {
        start: (e) => {
            let data = {
                group: this.props.group,
                column: this.props.column,
            }

            e.dataTransfer.setData('drag', JSON.stringify(data));
        },

        over: (e) => {
            e.preventDefault();
            e.stopPropagation();
        },

        drop: (e) => {
            e.preventDefault();
            e.stopPropagation();

            const drag = JSON.parse(e.dataTransfer.getData('drag'));
            let code = sessionStorage.getItem("code");

            if (drag.member !== undefined) {
                var key = [drag.group, drag.member];
                var target = this.props.group;

                if (target == "new") {
                    axios.post(`admin/${code}/question-create-group-C${this.props.column}`).then(setTimeout(() => { axios.post(`admin/${code}/group${drag.group}-member${drag.member}`) }, 200))
                }
                else
                    axios.post(`admin/${code}/group-${key[0]}/change-${target}/member-${key[1]}`);
            }
            else if (this.props.column !== 0 && drag.column !== this.props.column) {
                let key = drag.group;
                let target = this.props.column;

                axios.post(`admin/${code}/change-group${key}-column${target}`);
            }
        }
    }

    handleDouble = (e) => {
        if (this.props.double !== undefined && this.props.group != 0) {
            this.props.double(e);
        }
    }

    collapse = () => {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    colorChange = (color) => {
        if (!this.validateHexColor.test(color.hex))
            return;

        this.setState({
            color: color.hex,
            colorAnchor: null
        });
        const code = sessionStorage.getItem("code");

        axios.post(`admin/${code}/group${this.props.group}-recolor${color.hex}`);
    }

    colorOpen = () => {
        const anchor = this.state.menuAnchor;
        this.setState({
            menuAnchor: null,
            colorAnchor: anchor
        });
    }

    deleteOpen = () => {
        this.setState({
            menuAnchor: null,
        });
        this.modal.archive.open();
    }

    render() {
        return (
            <GroupContainer id={this.props.id + "-title"} group={this.props.group} column={this.props.column} color={this.state.color}
                onClick={this.props.onClick} size={this.props.size} empty={this.props.id == "0" && this.props.children.length < 1}
                onDrop={this.drag.drop} onDragOver={this.drag.over}
                draggable={this.props.group != "0" && !this.props.showcase} onDragStart={this.drag.start}>

                <GroupTitle onDoubleClick={(e) => this.handleDouble(e)} id={this.props.id + "-title"} new={this.props.group == "new"}>{this.props.title} {this.props.group != "new" && !this.props.showcase && <IconButton style={{ outline: "0" }} aria-label="expand" size="small" onClick={() => this.collapse()}>{this.state.collapse ? <KeyboardArrowUpIcon style={{ color: grey[50] }} /> : <KeyboardArrowDownIcon style={{ color: grey[50] }} />}</IconButton>}</GroupTitle>

                <Collapse timeout="auto" in={this.state.collapse}>
                    {this.props.size <= "2" ?
                        (this.props.size == "2" ?
                            <>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>A</IDChars>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>B</IDChars>
                            </>
                            :
                            ""
                        ) : (this.props.size == "4" ?
                            <>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>A</IDChars>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>B</IDChars>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>C</IDChars>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>D</IDChars>
                            </>
                            :
                            <>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>A</IDChars>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>B</IDChars>
                                <IDChars size={this.props.size} id={this.props.id + "-title"}>C</IDChars>
                            </>
                        )
                    }

                    {this.props.children}
                </Collapse>

                {(this.props.group != 0 && this.props.group != "new") && <GroupMenu showcase={this.props.showcase} id={this.props.id + "-title"} onClick={(e) => this.setState({ menuAnchor: e.currentTarget })} />}
                {this.state.modal.archive && <PageModal title="Confirm Archiving" body={this.modal.archive.content()} onClose={this.modal.archive.close} />}

                <Menu
                    anchorEl={this.state.menuAnchor} keepMounted
                    open={Boolean(this.state.menuAnchor)} onClose={() => this.setState({ menuAnchor: null })}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={this.colorOpen}>
                        Change Color
                    </MenuItem>
                    <MenuItem onClick={this.deleteOpen}>
                        Delete Group
                    </MenuItem>
                </Menu>
                <ColorPicker color={this.state.color} anchorEl={this.state.colorAnchor} onChangeComplete={this.colorChange} onClose={() => this.setState({ colorAnchor: null })} />
            </GroupContainer>
        );
    }
}