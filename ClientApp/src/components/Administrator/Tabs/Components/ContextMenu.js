import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";

const MenuContainer = styled.div`
    border: solid 1px #ccc;
    display: inline-block;
    margin: 5px;
    background: #FFF;
    color: #000;
    font-family: CircularStd;
    cursor: pointer;
    font-size: 12px;
    position: fixed;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    z-index: 11;
`;

const ContextItem = styled.div`
    border-bottom: ${props => props.last ? "" : "dotted 1px #ccc"};
    padding: 5px 25px;
`;

export class ContextMenu extends Component {
    constructor(props) {
        super(props);
        this.contextRef = React.createRef();
    }

    click(index) {
        if (this.props.items[index].callback) {
            this.props.items[index].callback();
        }
        else {
            console.log(`No callback for the ${index + 1}. menu item!`)
        }
    }

    returnMenu(items) {
        return (
            <MenuContainer id="customcontext" top={this.props.y - 4} left={this.props.x - 4} ref={this.contextRef}>
                {items.map((item, index, arr) =>
                    <ContextItem key={index} index={index} last={arr.length - 1 == index} onClick={() => this.click(index)}>{item.label}</ContextItem>
                )}
            </MenuContainer>
        )
    }

    render() {
        return (
            <div id='cmenu'>
                {this.props.visible ? this.returnMenu(this.props.items) : null}
            </div>
        )
    }
}