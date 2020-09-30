import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Collection, Task } from './Components/Task';
import { CreateTaskModal } from './Components/CreateModal';
import { ContextMenu } from './Components/ContextMenu';
import { BigScreen } from '../../Big Screen/BigScreen';

const SlideContainer = styled.div`
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

const SelectedSlide = styled.div`
    position: relative;
    width: 100%;
    background: #fff;
    height: 100%;
    border-radius: 10px;
`;

const Viewer = styled(BigScreen)`
    position: absolute;
`;

export class Tasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: props.tasks,

            create: {
                type: '',
                title: '',
                options: [],
            },

            menu: {
                x: 0,
                y: 0,
                visible: false,
                type: null,
            },

            modal: {
                create: false,
                type: null,
            }
        }
    }

    componentDidMount() {
        let self = this;
        document.addEventListener('contextmenu', function () {
            self.setState({
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        })
    }

    createTask = (event) => {
        const clickX = event.clientX;
        const clickY = event.clientY;
        this.setState({
            menu: {
                x: clickX,
                y: clickY,
                visible: true,
            }
        })
    }

    taskClick = (event) => {
        this.loadTask(event);
    }

    loadTask = (event) => {
        let key = event.target.id;
        this.props.SSE(key);
    }

    renderActive() {
        return (
            <SelectedSlide>
                <Viewer admin={true} />
            </SelectedSlide>
        );
    }

    render() {
        const modalCreateClose = (success) => {
            this.setState({
                modal: {
                    create: false,
                    type: null,
                }
            });

            if (success == true) {
                this.props.update(true);
            }
        }

        const createInput = () => {
            this.setState({
                modal: {
                    create: true,
                    type: 0,
                },
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        }

        const createMultipleChoice = () => {
            this.setState({
                modal: {
                    create: true,
                    type: 1,
                },
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        }

        const createPoints = () => {
            this.setState({
                modal: {
                    create: true,
                    type: 2,
                },
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        }

        const createSlider = () => {
            this.setState({
                modal: {
                    create: true,
                    type: 3,
                },
                menu: {
                    x: 0,
                    y: 0,
                    visible: false,
                }
            })
        }

        const menu = [
            { "label": "Input: Open Text", "callback": createInput },
            { "label": "Vote: Multiple Choice", "callback": createMultipleChoice },
            { "label": "Vote: Points", "callback": createPoints },
            { "label": "Vote: Slider", "callback": createSlider },
        ];
        return (
            <>
                {/* this.state.modal.create && <CreateTaskModal type={this.state.modal.type} onClose={modalCreateClose.bind(this)} />}
                <ContextMenu x={this.state.menu.x} y={this.state.menu.y} visible={this.state.menu.visible} items={menu} />
                <Collection createTask={(event) => this.createTask(event)} update={this.props.update}>
                    {this.props.tasks.map(task =>
                        <Task key={task.Index} id={task.Index} update={this.props.update}
                            onClick={this.taskClick.bind(this)} active={this.props.active == task.Index}
                            type={task.Type} title={task.Title}
                        />
                    )}
                </Collection>*/}
                <SlideContainer>
                    {this.renderActive()}
                </SlideContainer>
            </>
        );
    }
}