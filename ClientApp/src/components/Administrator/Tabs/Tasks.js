import React, {Component} from "react";
import {Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown} from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import {Collection, Task} from "./Components/Task";
import {CreateTaskModal} from "./Components/CreateModal";
import {ContextMenu} from "./Components/ContextMenu";
import {BigScreen} from "../../Big Screen/BigScreen";
import MouseIcon from "@material-ui/icons/Mouse";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import StarIcon from "@material-ui/icons/Star";


const SlideContainer = Styled.div`
    top: 2%;
    transform: translateY(-1%);
    display: inline-block;
    position: absolute;
    left: 2%;
    width: 96%;
    height: 96%;
    border: 1px solid #374785;
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

const ContentHeader = Styled(Card.Header)`
    width: 100%;
    background: #fff;
    height: 50px;
    left: 0;
    top: 0;
    position: absolute;
    margin: 0;
    padding: 0;
    border: 0;
`;

const ContentBody = Styled(Card.Body)`
    cursor: ${props => props.cursor === "favorite" ?
                       "url(https://cur.cursors-4u.net/symbols/sym-7/sym635.ani), url(https://cur.cursors-4u.net/symbols/sym-6/sym599.cur), auto !important;" :
                       props.cursor === "hide" ?
                       "url(https://cur.cursors-4u.net/cursors/cur-2/cur226.cur), auto !important;" :
                       "auto"}
    border: 0;
    background: #E4E4E4;
    position: absolute;
    top: 50px;
    width: 100%;
    height: calc(100% - 50px);
    padding: 50px;
    padding-top: calc(50px + 2rem);
`;

const Tools = Styled.div`
    display: flex;
    flex-direction: row;
    z-index: 10;
    position: absolute;
    height: 50px;
    min-width: 300px;
`;

const ToolButton = Styled(Nav.Link)`

    font-family: CircularStd;
    font-weight: 400;
    font-size: 1rem;
    padding: 0 1rem;
    text-align: center;
    border: 2px solid #fff;
    border-right: 0;
    border-radius: 5px;
    min-width: 125px;
    flex: 1 1 auto;
    height: 100%;
    line-height: 25px;
    transition-duration: 0.5s;
    outline: none;

    color: ${props => props.active ?
                      "#000" :
                      "#fff"};
    background: ${props => props.active ?
                           "#f8e9a1" :
                           "#24305E"};

    &:hover {
        background: ${props => props.active ?
                               "#f8e9a1" :
                               "#a8d0e6"};
        color: #000;
        cursor: ${props => props.active ?
                           "default" :
                           "pointer"};
    }

`;

export class Tasks extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            create: {
                type: "",
                title: "",
                options: []
            },

            tool: "mouse",

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


    render()
    {
        return (
            <React.Fragment>
                <ContentHeader>
                    <Tools>
                        <ToolButton
                            active={this.state.tool === "hide"}
                            onClick={() => this.state.tool === "hide" ?
                                           this.setState({ tool: "mouse" }) :
                                           this.setState({ tool: "hide" })} >
                            <VisibilityOffIcon />
                            <br />
                            Hide/Show
                        </ToolButton>
                        <ToolButton
                            active={this.state.tool === "favorite"}
                            onClick={() => this.state.tool === "favorite" ?
                                           this.setState({ tool: "mouse" }) :
                                           this.setState({ tool: "favorite" })} >
                            <StarIcon />
                            <br />
                            Favorite
                        </ToolButton>
                    </Tools>
                </ContentHeader>
                <ContentBody
                    cursor={this.state.tool === "mouse"} >
                    <SlideContainer>
                        <SelectedSlide>
                            <Viewer
                                admin={true}
                                columns={this.props.columns}
                                tool={this.state.tool} />
                        </SelectedSlide>
                    </SlideContainer>
                </ContentBody>
            </React.Fragment>
        );
    }
}