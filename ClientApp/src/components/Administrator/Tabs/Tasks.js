import React, { Component } from "react";
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import { Collection, Task } from "./Components/Task";
import { CreateTaskModal } from "./Components/CreateModal";
import { ContextMenu } from "./Components/ContextMenu";
import { BigScreen } from "../../Big Screen/BigScreen";

const SlideContainer = Styled.div`
    top: 2%;
    transform: translateY(-1%);
    display: inline-block;
    position: absolute;
    left: 2%;
    width: 96%;
    height: 96%;
    border: 1px solid #575b75;
    overflow: hidden;
`;

const SelectedSlide = Styled.div`
    position: relative;
    width: 100%;
    background: #fff;
    height: 100%;
    border-radius: 10px;
`;

const Viewer = Styled(BigScreen)`
    position: absolute;
`;

export class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: props.tasks,

            create: {
                type: "",
                title: "",
                options: []
            },

            menu: {
                x: 0,
                y: 0,
                visible: false,
                type: null
            },

            modal: {
                create: false,
                type: null
            }
        };
    }

    componentDidMount() {
        const Self = this;
        document.addEventListener("contextmenu",
            function () {
                Self.setState({
                    menu: {
                        x: 0,
                        y: 0,
                        visible: false
                    }
                });
            });
    }

    createTask = (event) => {
        const ClickX = event.clientX;
        const ClickY = event.clientY;
        this.setState({
            menu: {
                x: ClickX,
                y: ClickY,
                visible: true
            }
        });
    }

    taskClick = (event) => {
        this.loadTask(event);
    }

    loadTask = (event) => {
        const Key = event.target.id;
        this.props.SSE(Key);
    }

    renderActive() {
        return (
            <SelectedSlide>
                <Viewer admin={true} />
            </SelectedSlide>
        );
    }

    render() {
        return (
            <React.Fragment>
                <SlideContainer>
                    {this.renderActive()}
                </SlideContainer>
            </React.Fragment>
        );
    }
}