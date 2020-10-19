import React, { Component } from "react";
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";

const MenuContainer = Styled.div`
    border: solid 1px #ccc;
    border-radius: 10px;
    display: inline-block;
    margin: 5px;
    background: #DDD;
    color: #000;
    font-family: CircularStd;
    cursor: pointer;
    font-size: 1rem;
    position: fixed;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    z-index: 11;
`;

const ContextItem = Styled.div`
    border-bottom: ${props => props.last
        ? ""
        : "solid 1px #999"
    };
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
            console.log(`No callback for the ${index + 1}. menu item!`);
        }
    }

    returnMenu(items) {
        return (
            <MenuContainer id="customcontext"
                left={this.props.x - 4}
                ref={this.contextRef}
                top={this.props.y - 4}>
                {items.map((item, index, arr) =>
                    <ContextItem key={index} index={index}
                        last={arr.length - 1 === index}
                        onClick={() => this.click(index)}>
                        {item.label}
                    </ContextItem>
                )}
            </MenuContainer>
        );
    }

    render() {
        return (
            <div id="cmenu">
                {this.props.visible
                    ? this.returnMenu(this.props.items)
                    : null}
            </div>
        );
    }
}