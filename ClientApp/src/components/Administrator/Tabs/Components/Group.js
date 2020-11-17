import {IconButton, Menu, MenuItem} from "@material-ui/core";
import Collapse from "@material-ui/core/Collapse";
import {grey} from "@material-ui/core/colors";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import MenuIcon from "@material-ui/icons/Menu";
import Axios from "axios";
import "circular-std";
import React, {Component} from "react";
import {Form, Nav} from "react-bootstrap";
import Styled from "styled-components";
import {PageModal} from "../../../Services/PageModal";
import {ColorPicker} from "./ColorPicker";


const GroupContainer = Styled.div`
    width: 100%;
    overflow: hidden;
    padding: 10px;
    padding-top: 65px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .12);
    vertical-align: top;
    position: relative;
    display: ${props => props.empty ?
                        "none" :
                        "block"};

    background: ${props => props.group === 0 ?
                           "#8c8da6" :
                           props.color};

    opacity: ${props => props.group === "new" ?
                        "50%" :
                        "100%"};

    &:hover {
        filter: saturate(125%) drop-shadow(6px 6px 3px black);

        cursor: ${props => props.group === "new" ?
                           "pointer" :
                           props.showcase ?
                           "default" :
                           "cell"};
        }
    `;

const IdChars = Styled.h1`
    display: inline-block;
    color: #fff;
    font-family: CircularStd;
    font-Size: 1rem;
    margin: 0;
    padding: 10px;
    text-align: center;
    font-weight: 700;
    clear: both;
    width: ${props => props.size <= 2 ?
                      (props.size === 2 ?
                           "50%" :
                           "100%") :
                      (props.size === 4 ?
                           "25%" :
                           "33%")};

`;

const GroupTitle = Styled.h1`
    color: #fff;
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
    vertical-align: center;
    opacity: 98%;
    position: absolute;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 0.5rem;
    white-space: nowrap;
    padding: 2.5px;

    width: ${props => props.new ?
                      "100%" :
                      ""};

    max-width: ${props => props.new ?
                          "100%" :
                          "75%"};

    text-align: ${props => props.new ?
                           "center" :
                           ""};

    top: ${props => props.new ?
                    "50%" :
                    "17.5px"};

    left: ${props => props.new ?
                     "50%" :
                     "12.5px"};

    transform: ${props => props.new ?
                          "translate(-50%, -50%)" :
                          ""};

    pointer-events: ${props => props.new ?
                               "none" :
                               "initial"};

    &:hover {
        cursor: ${props => props.showcase ?
                           "default" :
                           "text"};
        box-shadow: ${props => props.showcase ?
                           "0" :
                           "0 0 4px 2px #fff"};
    }
`;

const GroupMenu = Styled(MenuIcon)`
    position: absolute;
    right: 15px;
    top: 25px;
    color: #fff;
    font-weight: 600;

    display: ${props => props.showcase ?
                        "none" :
                        "block"};

    &:hover {
        background: rgba(0, 0, 0, .15);
        cursor: pointer;
    }
`;

const CancelButton = Styled(Nav.Link)`
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

const CreateButton = Styled.input`
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

const ModalText = Styled.h1`
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
            archive: false
        },

        //collapse: true,
        menuAnchor: null,
        colorAnchor: null
    }


    validateHexColor = /^#([0-9A-Fa-f]{3}){1,2}$/;


    modal = {
        archive: {
            open: () => {
                this.setState({
                    modal: {
                        archive: true
                    }
                });
            },

            content: () => {
                const Archive = (e) => {
                    e.preventDefault();
                    const Code = sessionStorage.getItem("code");

                    Axios.post(`admin/${Code}/question-archive-group-${this.props.group}`);
                    this.modal.archive.close();
                };

                return (
                    <Form
                        autoComplete="off"
                        onSubmit={(e) => Archive(e)} >
                        <ModalText>Are you sure you want to delete this group?</ModalText>
                        <CancelButton
                            onClick={() => this.modal.archive.close()} >
                            Cancel
                        </CancelButton>
                        <CreateButton
                            type="submit"
                            value="Submit" />
                    </Form>
                );
            },

            close: () => {
                this.setState({
                    modal: {
                        archive: false
                    }
                });
            }
        }
    }


    drag = {
        start: (e) => {
            const Data = {
                group: this.props.group,
                column: this.props.column
            };

            e.dataTransfer.setData("drag", JSON.stringify(Data));
        },

        over: (e) => {
            e.preventDefault();

            //e.stopPropagation();
        },

        drop: (e) => {
            e.preventDefault();
            e.stopPropagation();

            const Drag = JSON.parse(e.dataTransfer.getData("drag"));
            const Code = sessionStorage.getItem("code");

            if (Drag.member !== undefined)
            {
                const Key = [Drag.group.toString(), Drag.member.toString()];
                const Target = this.props.group;
                const Selected = this.props.selected();
                const Keys = [];

                if (Selected.find(element => {
                    return element[0] === Key[0] ?
                               element[1] === Key[1] :
                               false;
                }))
                {
                    Selected.forEach(select => {
                        const Subject = {
                            Group: select[0],
                            Member: select[1]
                        };

                        Keys.push(Subject);
                    });
                }
                else
                {
                    let Done = false;
                    Selected.forEach(select => {
                        if (!Done && Key[0] >= select[0])
                        {
                            if ((Key[0] === select[0] && Key[1] > select[1]) || Key[0] > select[0])
                            {
                                const Insert = {
                                    Group: Key[0],
                                    Member: Key[1]
                                };
                                Keys.push(Insert);
                                Done = true;
                            }
                        }
                        const Subject = {
                            Group: select[0],
                            Member: select[1]
                        };

                        Keys.push(Subject);
                    });

                    if (!Done)
                    {
                        const Insert = {
                            Group: Key[0],
                            Member: Key[1]
                        };
                        Keys.push(Insert);
                    }
                }

                if (Target === "new")
                {
                    Axios.post(`admin/${Code}/question-create-group-C${this.props.column}`).then(setTimeout(() => { Axios.post(`admin/${Code}/group/change-last`, Keys); },
                        200));
                }
                else
                    Axios.post(`admin/${Code}/group/change-${Target}`, Keys);

                this.props.clearSelect();
            }
            else if (this.props.column !== 0 && Drag.column !== this.props.column)
            {
                const Key = Drag.group;
                const Target = this.props.column;

                Axios.post(`admin/${Code}/change-group${Key}-column${Target}`);
            }
        }
    }


    handleDouble = (e) => {
        if (this.props.double !== undefined && this.props.group !== 0 && this.props.group !== "new")
        {
            e.stopPropagation();
            this.props.double(e);
        }
    }


    collapse = (e) => {
        e.stopPropagation();
        const Code = sessionStorage.getItem("code");
        Axios.post(`admin/${Code}/text-group${this.props.group}-collapse`);

        //this.setState({
        //    collapse: !this.state.collapse,
        //});
    }


    colorChange = (color, e) => {
        e.stopPropagation();
        if (!this.validateHexColor.test(color.hex))
            return;

        this.setState({
            colorAnchor: null
        });
        const Code = sessionStorage.getItem("code");

        const Color = color.hex;

        Axios.post(`admin/${Code}/group${this.props.group}-recolor`,
            JSON.stringify(Color),
            {
                headers: {
                    'Content-Type': "application/json"
                }
            });
    }


    colorOpen = (e) => {
        e.stopPropagation();
        const Anchor = this.state.menuAnchor;
        this.setState({
            menuAnchor: null,
            colorAnchor: Anchor
        });
    }


    deleteOpen = (e) => {
        e.stopPropagation();
        this.setState({
            menuAnchor: null
        });
        this.modal.archive.open();
    }


    handleClick = (e) => {
        if (!this.props.showcase && this.props.onClick !== undefined)
        {
            this.props.onClick(this.props.group);
            e.stopPropagation();
        }
    }


    render()
    {
        return (
            <GroupContainer
                color={this.props.color}
                column={this.props.column}
                draggable={this.props.group !== 0 && !this.props.showcase}
                empty={this.props.id === "0" && this.props.children.length < 1}
                group={this.props.group}
                id={this.props.id + "-title"}
                onClick={this.handleClick}
                onDragOver={this.drag.over}
                onDragStart={this.drag.start}
                onDrop={this.drag.drop}
                size={this.props.size} >

                <GroupTitle
                    id={this.props.id + "-title"}
                    new={this.props.group === "new"}
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => this.handleDouble(e)}
                    showcase={this.props.showcase} >
                    {this.props.title}
                    {!this.props.showcase &&
                        this.props.group !== "new" &&
                        <IconButton
                            aria-label="expand"
                            onClick={(e) => this.collapse(e)}
                            size="small"
                            style={{
                                outline: "0"
                            }} >

                            {!this.props.collapsed ?
                                 <KeyboardArrowUpIcon
                                    style={{
                                        color: grey[50]
                                    }} /> :
                                 <KeyboardArrowDownIcon
                                    style={{
                                        color: grey[50]
                                    }} />
                            }
                        </IconButton>
                    }
                </GroupTitle>

                <Collapse
                    in={!this.props.collapsed}
                    timeout="auto" >
                    {this.props.size <= "2" ?
                         (this.props.size === 2 ?
                              <React.Fragment>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      A
                                  </IdChars>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      B
                                  </IdChars>
                              </React.Fragment> : //Middle of: this.props.size == "2" ?
                              "") : //Middle of: this.props.size <= "2" ?
                         (this.props.size === 4 ?
                              <React.Fragment>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      A
                                  </IdChars>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      B
                                  </IdChars>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      C
                                  </IdChars>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      D
                                  </IdChars>
                              </React.Fragment> : //Middle of: this.props.size == "4" ?
                              <React.Fragment>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      A
                                  </IdChars>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      B
                                  </IdChars>
                                  <IdChars
                                      id={this.props.id + "-title"}
                                      size={this.props.size} >
                                      C
                                  </IdChars>
                              </React.Fragment>
                         )
                    }

                    {this.props.children}
                </Collapse>

                {!(this.props.showcase) &&
                    (this.props.group !== 0 && this.props.group !== "new") &&
                    <GroupMenu
                        id={this.props.id + "-title"}
                        onClick={(e) => {
                            e.stopPropagation();
                            this.setState({
                                menuAnchor: e.currentTarget
                            });
                        }}
                        showcase={this.props.showcase} />
                }

                {this.state.modal.archive &&
                    <PageModal
                        body={this.modal.archive.content()}
                        onClose={this.modal.archive.close}
                        title="Confirm Archiving" />
                }

                <Menu
                    anchorEl={this.state.menuAnchor}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    onClose={() => this.setState({
                        menuAnchor: null
                    })}
                    open={Boolean(this.state.menuAnchor)}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }} >

                    <MenuItem
                        onClick={this.colorOpen} >
                        Change Color
                    </MenuItem>

                    <MenuItem
                        onClick={this.deleteOpen} >
                        Delete Group
                    </MenuItem>

                </Menu>

                <ColorPicker
                    anchorEl={this.state.colorAnchor}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    color={this.props.color}
                    onChangeComplete={this.colorChange}
                    onClose={() => this.setState({
                        colorAnchor: null
                    })}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }} />

            </GroupContainer>
        );
    }
}