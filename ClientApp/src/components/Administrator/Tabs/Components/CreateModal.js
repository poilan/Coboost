import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Box, Typography, TextField, FormControlLabel, Switch } from '@material-ui/core';

const ModalPage = styled(Modal)`
    border-radius: 20px;
    font-family: CircularStd;

    .modal-title {
        font-size: 1rem;
        opacity: 50%;
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

const FieldText = styled.h2`
    opacity: 50%;
    font-family: CircularStd;
    font-size: 1rem;
`;

const OptionContainer = styled.div`
    display: inline-block;
    padding: 0.3em;
    width: 50%;
    height: 1.5em;
    text-align: left;

`;

const Option = styled(Form.Control)`
    font-family: CircularStd;
    font-size: 1rem;
    font-weight: 700;
    width: 100%;
    padding: .2em .5em .17em .26em;
    box-sizing: border-box;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;

    &:hover {
        border-color: #888;
    }

    &:focus {
        border-color: #aaa;
        box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
        box-shadow: 0 0 0 3px -moz-mac-focusring;
        outline: none;
    }
`;

const AddOption = styled.div`
    display: ${props => props.possible ? "inline-block" : "none"};
    opacity: 50%;
    width: 100%;
    font-family: CircularStd;
    font-size: 1rem;
    font-weight: 700;
    padding: .2em .5em .17em .26em;
    box-sizing: border-box;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .04);
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: #fff;

    &:hover {
        opacity: 75%;
        cursor:pointer;
    }
`;

export class CreateTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.type,
            title: props.title,
            max: 3,
            points: 1,

            options: props.options(),
            showing: true,
            success: false,
            extra: false,
        }
    }

    TextContent() {
        const createOpenText = (event) => {
            event.preventDefault();
            const code = sessionStorage.getItem('code');
            var data = {
                Title: this.state.title,
            }

            axios.post(`admin/${code}/questions-create-opentext`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status === 201) {
                    this.setState({
                        success: true,
                    });
                    this.onClose();
                }
            });
        }

        const handleTitle = (event) => {
            event.preventDefault();
            var title = this.state.title;
            title = event.target.value;
            this.setState({
                title: title,
            });
        }

        return (
            <Form onSubmit={createOpenText.bind(this)}>
                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <TextField id="TextTitle" label="Task Text" onChange={handleTitle} value={this.state.title} fullWidth />
                </Box>
                <CancelButton onClick={this.props.onClose}>Cancel</CancelButton>
                <CreateButton type="submit" value="Add new Task" />
            </Form>
        );
    }

    MultipleChoiceContent() {
        const handleTitle = (event) => {
            event.preventDefault();
            var title = this.state.title;
            title = event.target.value;
            this.setState({
                title: title,
            });
        }

        const handleMax = (event) => {
            event.preventDefault();
            var max = this.state.max;
            max = event.target.value;
            this.setState({
                max: max,
            });
        }

        const handleOption = (event) => {
            const key = event.target.name;
            const value = event.target.value;

            const options = this.state.options;
            options[key].Description = value;
            this.setState({
                options: options,
            });
        }

        const addOption = () => {
            var count = this.state.options !== undefined ? this.state.options.length : 0;
            var user = localStorage.getItem("user");

            var option = {
                UserID: user,
                Index: count,
                Description: "",
                votes: [],
                archive: [],
            }

            var options = this.state.options;
            count > 0 ? options.push(option) : options = [option];
            this.setState({
                options: options,
            });
        }

        const createMultipleChoice = (event) => {
            event.preventDefault();
            let code = sessionStorage.getItem("code");

            let data = {
                Title: this.state.title,
                Options: this.state.options,
                Max: parseInt(this.state.max),
            }

            if (!this.state.extra)
                data.Max = 1;

            axios.post(`admin/${code}/questions-create-multiplechoice`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status === 201) {
                    this.setState({
                        type: '',
                        title: '',
                        options: [],
                        success: true,
                    });
                    this.onClose();
                }
            })
        }

        return (
            <Form onSubmit={createMultipleChoice.bind(this)}>

                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <TextField id="TextTitle" label="Task Text" onChange={handleTitle} value={this.state.title} fullWidth autoFocus={this.state.title == undefined || this.state.title.length < 1} />
                </Box>

                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <FormControlLabel control={<Switch checked={this.state.extra} onChange={(e) => { e.preventDefault(); this.setState({ extra: !this.state.extra }); }} name="TextSwitch" />}
                        label="Allow Multiple Answers" />
                    {this.state.extra && <TextField id="TextMax" type="number" label="Max Answers" value={this.state.max} onChange={handleMax} />}
                </Box>

                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <Box component="fieldset" pt={1} px={1} borderColor="transparent">
                        <Typography component="legend" variant="subtitle2">Options</Typography>
                        {this.state.options !== undefined && this.state.options.map(option =>
                            <Box component="fieldset" mb={1} borderColor="transparent">
                                <TextField id={"Option-" + option.Index} label={"Option " + (option.Index + 1)} key={option.Index} name={option.Index} value={option.Description} onChange={handleOption.bind(this)} autoFocus={(option.Index + 1) == this.state.options.length} fullWidth />
                            </Box>
                        )}
                        <Box component="fieldset" mb={1} borderColor="transparent">
                            <TextField onClick={addOption.bind(this)} label="Add option..." color="gray" fullWidth />
                        </Box>
                    </Box>
                </Box>

                <CancelButton onClick={this.props.onClose}>Cancel</CancelButton>
                <CreateButton type="submit" value="Submit" />
            </Form>
        );
    }

    PointsContent() {
        const handleTitle = (event) => {
            event.preventDefault();
            var title = this.state.title;
            title = event.target.value;
            this.setState({
                title: title,
            });
        }

        const handleMax = (event) => {
            event.preventDefault();
            var max = this.state.max;
            max = event.target.value;
            this.setState({
                max: max,
            });
        }

        const handlePoints = (event) => {
            event.preventDefault();
            var points = this.state.points;
            points = event.target.value;
            this.setState({
                points: points,
            });
        }

        const handleOption = (event) => {
            const key = event.target.name;
            const value = event.target.value;

            const options = this.state.options;
            options[key].Description = value;
            this.setState({
                options: options,
            });
        }

        const addOption = () => {
            var count = this.state.options !== undefined ? this.state.options.length : 0;
            var user = localStorage.getItem("user");

            var Option = {
                UserID: user,
                Index: count,
                Description: "",
            }

            var Options = this.state.options;
            count > 0 ? Options.push(Option) : Options = [Option];
            this.setState({
                options: Options,
            });
        }

        const createPoints = (event) => {
            event.preventDefault();
            let code = sessionStorage.getItem("code");

            let data = {
                Title: this.state.title,
                Options: this.state.options,
                Amount: parseInt(this.state.points),
                Max: parseInt(this.state.max),
            }

            axios.post(`admin/${code}/questions-create-points`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status === 201) {
                    this.setState({
                        type: '',
                        title: '',
                        options: [],
                        success: true,
                    });
                    this.onClose();
                }
            })
        }

        let canAdd = (this.state.options == undefined || this.state.options !== undefined && this.state.options.length < 15);
        return (
            <Form onSubmit={createPoints.bind(this)}>
                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <TextField id="TextTitle" label="Task Text" onChange={handleTitle} value={this.state.title} fullWidth autoFocus={this.state.title == undefined || this.state.title.length < 1} />
                </Box>

                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <Box display="inline" px={1} borderColor="transparent">
                        <TextField id="points" name="points" type="number" label="Total Points" ref="points" onChange={handlePoints.bind(this)} value={this.state.points} />
                    </Box>
                    <Box display="inline" px={0} borderColor="transparent">
                        <TextField id="max" name="max" type="number" label="Max per option" ref="max" onChange={handleMax.bind(this)} value={this.state.max} />
                    </Box>
                </Box>

                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <Box component="fieldset" pt={1} px={1} borderColor="transparent">
                        <Typography component="legend" variant="subtitle2">Options</Typography>
                        {this.state.options !== undefined && this.state.options.map(option =>
                            <Box component="fieldset" mb={1} borderColor="transparent">
                                <TextField id={"Option-" + option.Index} label={"Option " + (option.Index + 1)} key={option.Index} name={option.Index} value={option.Description} onChange={handleOption.bind(this)} autoFocus={(option.Index + 1) == this.state.options.length} fullWidth />
                            </Box>
                        )}
                        <Box component="fieldset" mb={1} borderColor="transparent">
                            <TextField onClick={addOption.bind(this)} label="Add option..." color="gray" fullWidth />
                        </Box>
                    </Box>
                </Box>
                <CancelButton onClick={this.props.onClose}>Cancel</CancelButton>
                <CreateButton type="submit" value="Submit" />
            </Form>
        );
    }

    SliderContent() {
        const handleTitle = (event) => {
            event.preventDefault();
            var title = this.state.title;
            title = event.target.value;
            this.setState({
                title: title,
            });
        }

        const handleMax = (event) => {
            event.preventDefault();
            var max = this.state.max;
            max = event.target.value;
            this.setState({
                max: max,
            });
        }

        const handleMin = (event) => {
            event.preventDefault();
            var min = this.state.points;
            min = event.target.value;
            this.setState({
                points: min,
            });
        }

        const handleOption = (event) => {
            const key = event.target.name;
            const value = event.target.value;

            const options = this.state.options;
            options[key].Description = value;
            this.setState({
                options: options,
            });
        }

        const addOption = () => {
            var count = this.state.options !== undefined ? this.state.options.length : 0;
            var user = localStorage.getItem("user");

            var option = {
                UserID: user,
                Index: count,
                Description: "",
            }

            var options = this.state.options;
            count > 0 ? options.push(option) : options = [option];
            this.setState({
                options: options,
            });
        }

        const createSlider = (event) => {
            event.preventDefault();
            let code = sessionStorage.getItem("code");

            let data = {
                Title: this.state.title,
                Options: this.state.options,
                Min: parseInt(this.state.points),
                Max: parseInt(this.state.max),
            }

            axios.post(`admin/${code}/questions-create-slider`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status === 201) {
                    this.setState({
                        type: '',
                        title: '',
                        options: [],
                        success: true,
                    });
                    this.onClose();
                }
            })
        }

        let canAdd = (this.state.options == undefined || this.state.options !== undefined && this.state.options.length < 15);
        return (
            <Form onSubmit={createSlider.bind(this)}>
                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <TextField id="TextTitle" label="Task Text" onChange={handleTitle} value={this.state.title} fullWidth autoFocus={this.state.title == undefined || this.state.title.length < 1} />
                </Box>

                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <Box display="inline" px={1} borderColor="transparent">
                        <TextField id="min" name="min" type="number" label="Minimum Value" ref="min" onChange={handleMin.bind(this)} value={this.state.points} />
                    </Box>
                    <Box display="inline" px={0} borderColor="transparent">
                        <TextField id="max" name="max" type="number" label="Maximum Value" ref="max" onChange={handleMax.bind(this)} value={this.state.max} />
                    </Box>
                </Box>

                <Box component="fieldset" mb={3} pt={1} px={3} borderColor="transparent">
                    <Box component="fieldset" pt={1} px={1} borderColor="transparent">
                        <Typography component="legend" variant="subtitle2">Options</Typography>
                        {this.state.options !== undefined && this.state.options.map(option =>
                            <Box component="fieldset" mb={1} borderColor="transparent">
                                <TextField id={"Option-" + option.Index} label={"Option " + (option.Index + 1)} key={option.Index} name={option.Index} value={option.Description} onChange={handleOption.bind(this)} autoFocus={(option.Index + 1) == this.state.options.length} fullWidth />
                            </Box>
                        )}
                        <Box component="fieldset" mb={1} borderColor="transparent">
                            <TextField onClick={addOption.bind(this)} label="Add option..." color="gray" fullWidth />
                        </Box>
                    </Box>
                </Box>
                <CancelButton onClick={this.props.onClose}>Cancel</CancelButton>
                <CreateButton type="submit" value="Submit" />
            </Form>
        );
    }

    onClose() {
        if (this.props.onClose !== undefined)
            this.props.onClose(this.state.success);
        this.setState({
            type: '',
            title: '',
            options: [],
            showing: false,
            success: false,
            max: 3,
            points: 1,
        });
    }

    render() {
        return (
            <ModalPage show={this.state.showing} centered onHide={this.onClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.type == 0 ? "Input: Open Text" : this.props.type == 1 ? "Vote: Multiple Choice" : this.props.type == 2 ? "Vote: Points" : "Vote: Slider"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.type == 0 ? this.TextContent() : this.props.type == 1 ? this.MultipleChoiceContent() : this.props.type == 2 ? this.PointsContent() : this.SliderContent()}</Modal.Body>
            </ModalPage>
        )
    }
}