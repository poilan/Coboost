import React, {Component} from "react";
import Axios from "axios";
import {Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown} from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import {Box, Typography, TextField, FormControlLabel, Switch} from "@material-ui/core";


const ModalPage = Styled(Modal)`
    border-radius: 20px;
    font-family: CircularStd;

    .modal-title {
        font-size: 1rem;
        opacity: 50%;
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

export class CreateTaskModal extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            type: props.type,
            description: "",
            title: "",
            max: 5,
            maxDescription: "Very important",
            min: 1,
            minDescription: "Not important",

            options: [],
            showing: true,
            success: false,
            extra: false
        };
    }


    componentDidMount()
    {
        if (this.props.type !== 0 && this.props.options !== undefined)
            this.setState({ options: this.props.options() });
        else
            this.setState({ description: this.props.title });
    }


    TextContent()
    {
        const CreateOpenText = (event) => {
            event.preventDefault();
            const Code = sessionStorage.getItem("code");
            var Data = {
                Title: this.state.description,
                ShowResults: true,
                ShortInputsOnly: !this.state.extra
            };

            Axios.post(`admin/${Code}/create-text-open`, Data,
                {
                    headers: {
                        'Content-Type': "application/json"
                    }
                }).then(res => {
                if (res.status === 201)
                {
                    this.setState({
                        success: true,
                        description: "",
                        type: ""
                    });
                    this.onClose();
                }
            });
        };

        const HandleDescription = (event) => {
            event.preventDefault();
            var Description = event.target.value;
            this.setState({
                description: Description
            });
        };

        return (
            <Form
                onSubmit={CreateOpenText.bind(this)} >
                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={1}
                    px={3} >
                    <TextField
                        autoFocus={true}
                        fullWidth
                        id="TextTitle"
                        label="Task Text"
                        onChange={HandleDescription}
                        type="text"
                        value={this.state.description} />
                </Box>
                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={1}
                    px={3} >
                    <FormControlLabel
                        control={<Switch
                                     checked={!this.state.extra}
                                     name="TextSwitch"
                                     onChange={(e) => {
                                         e.preventDefault();
                                         this.setState({ extra: !this.state.extra });
                                     }} />}
                        label={!this.state.extra ?
                                   "Long Inputs Enabled" :
                                   "Long Inputs Disabled"} />
                </Box>
                <CancelButton
                    onClick={this.props.onClose} >
                    Cancel
                </CancelButton>
                <CreateButton
                    type="submit"
                    value="Add new Task" />
            </Form>
        );
    }


    MultipleChoiceContent()
    {
        const HandleTitle = (event) => {
            event.preventDefault();
            var Title = event.target.value;
            this.setState({
                description: Title
            });
        };

        const HandleMax = (event) => {
            event.preventDefault();
            var Max = event.target.value;
            this.setState({
                max: Max
            });
        };

        const HandleOption = (event) => {
            const Key = event.target.name;
            const Value = event.target.value;

            const Options = this.state.options;
            Options[Key].Description = Value;
            this.setState({
                options: Options
            });
        };

        const AddOption = () => {
            var Count = this.state.options !== undefined ?
                            this.state.options.length :
                            0;
            var User = localStorage.getItem("user");

            var Option = {
                UserID: User,
                Index: Count,
                Description: "",
                votes: [],
                archive: []
            };

            var Options = this.state.options;
            Count > 0 ?
                Options.push(Option) :
                Options = [Option];
            this.setState({
                options: Options
            });
        };

        const CreateMultipleChoice = (event) => {
            event.preventDefault();
            const Code = sessionStorage.getItem("code");

            const Data = {
                Title: this.state.description,
                Options: this.state.options,
                Max: parseInt(this.state.max),
                ShowResults: true
            };

            if (!this.state.extra)
                Data.Max = 1;

            Axios.post(`admin/${Code}/create-vote-multi`, Data,
                {
                    headers: {
                        'Content-Type': "application/json"
                    }
                }).then(res => {
                if (res.status === 201)
                {
                    this.setState({
                        type: "",
                        description: "",
                        options: [],
                        success: true
                    });
                    this.onClose();
                }
            });
        };

        return (
            <Form
                onSubmit={CreateMultipleChoice.bind(this)} >

                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={1}
                    px={3} >
                    <TextField
                        autoFocus={this.state.options.length === 0}
                        fullWidth
                        id="TextTitle"
                        label="Task Text"
                        onChange={HandleTitle}
                        value={this.state.description} />
                </Box>

                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={1}
                    px={3} >
                    <FormControlLabel
                        control={<Switch
                                     checked={this.state.extra}
                                     name="TextSwitch"
                                     onChange={(e) => {
                                         e.preventDefault();
                                         this.setState({ extra: !this.state.extra });
                                     }} />}
                        label="Allow Multiple Answers" />
                    {this.state.extra &&
                        <TextField
                            id="TextMax"
                            label="Max Answers"
                            onChange={HandleMax}
                            type="number"
                            value={this.state.max} />
                    }
                </Box>

                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={1}
                    px={3} >
                    <Box
                        borderColor="transparent"
                        component="fieldset"
                        pt={1}
                        px={1} >
                        <Typography
                            component="legend"
                            variant="subtitle2" >
                            Options
                        </Typography>
                        {this.state.options !== undefined &&
                            this.state.options.map(option =>
                                <Box
                                    borderColor="transparent"
                                    component="fieldset"
                                    mb={1} >
                                    <TextField
                                        autoFocus={(option.Index + 1) === this.state.options.length}
                                        fullWidth
                                        id={`Option-${option.Index}`}
                                        key={option.Index}
                                        label={`Option ${option.Index + 1}`}
                                        name={option.Index}
                                        onChange={HandleOption.bind(this)}
                                        value={option.Description} />
                                </Box>
                            )}
                        <Box
                            borderColor="transparent"
                            component="fieldset"
                            mb={1} >
                            <TextField
                                color="gray"
                                fullWidth
                                label="Add option..."
                                onFocus={AddOption.bind(this)} />
                        </Box>
                    </Box>
                </Box>

                <CancelButton
                    onClick={this.props.onClose} >
                    Cancel
                </CancelButton>
                <CreateButton
                    type="submit"
                    value="Submit" />
            </Form>
        );
    }


    PointsContent()
    {
        const HandleTitle = (event) => {
            event.preventDefault();
            var Title = event.target.value;
            this.setState({
                description: Title
            });
        };

        const HandleMax = (event) => {
            event.preventDefault();
            var Max = event.target.value;

            if (Max > this.state.max)
                Max = this.state.max;

            this.setState({
                min: Max
            });
        };

        const HandlePoints = (event) => {
            event.preventDefault();
            var Points = event.target.value;
            this.setState({
                max: Points
            });
        };

        const HandleOption = (event) => {
            const Key = event.target.name;
            const Value = event.target.value;

            const Options = this.state.options;
            Options[Key].Description = Value;
            this.setState({
                options: Options
            });
        };

        const AddOption = () => {
            var Count = this.state.options !== undefined ?
                            this.state.options.length :
                            0;
            var User = localStorage.getItem("user");

            var Option = {
                UserID: User,
                Index: Count,
                Description: ""
            };

            var Options = this.state.options;
            Count > 0 ?
                Options.push(Option) :
                Options = [Option];
            this.setState({
                options: Options
            });
        };

        const CreatePoints = (event) => {
            event.preventDefault();
            const Code = sessionStorage.getItem("code");

            const Data = {
                Title: this.state.description,
                Options: this.state.options,
                Amount: parseInt(this.state.max),
                Max: parseInt(this.state.max),
                ShowResults: true
            };

            Axios.post(`admin/${Code}/questions-create-points`,
                Data,
                {
                    headers: {
                        'Content-Type': "application/json"
                    }
                }).then(res => {
                if (res.status === 201)
                {
                    this.setState({
                        type: "",
                        description: "",
                        options: [],
                        success: true
                    });
                    this.onClose();
                }
            });
        };

        return (
            <Form
                onSubmit={CreatePoints.bind(this)} >
                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={1}
                    px={3} >
                    <TextField
                        autoFocus={this.state.options.length === 0}
                        fullWidth
                        id="TextTitle"
                        label="Task Text"
                        onChange={HandleTitle}
                        value={this.state.description} />
                </Box>

                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={1}
                    px={3} >
                    <Box
                        borderColor="transparent"
                        display="inline"
                        px={1} >
                        <TextField
                            id="points"
                            label="Total Points"
                            name="points"
                            onChange={HandlePoints.bind(this)}
                            ref="points"
                            type="number"
                            value={this.state.max} />
                    </Box>
                    <Box
                        borderColor="transparent"
                        display="inline"
                        px={0} >
                        <TextField
                            id="max"
                            label="Max per option"
                            name="max"
                            onChange={HandleMax.bind(this)}
                            ref="max"
                            type="number"
                            value={this.state.min} />
                    </Box>
                </Box>

                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={3}
                    pt={1}
                    px={3} >
                    <Box
                        borderColor="transparent"
                        component="fieldset"
                        pt={1}
                        px={1} >
                        <Typography
                            component="legend"
                            variant="subtitle2" >
                            Options
                        </Typography>
                        {this.state.options !== undefined &&
                            this.state.options.map(option =>
                                <Box
                                    borderColor="transparent"
                                    component="fieldset"
                                    mb={1} >
                                    <TextField
                                        autoFocus={(option.Index + 1) === this.state.options.length}
                                        fullWidth
                                        id={`Option-${option.Index}`}
                                        key={option.Index}
                                        label={`Option ${option.Index + 1}`}
                                        name={option.Index}
                                        onChange={HandleOption.bind(this)}
                                        value={option.Description} />
                                </Box>
                            )}
                        <Box
                            borderColor="transparent"
                            component="fieldset"
                            mb={1} >
                            <TextField
                                color="gray"
                                fullWidth
                                label="Add option..."
                                onFocus={AddOption.bind(this)} />
                        </Box>
                    </Box>
                </Box>
                <CancelButton
                    onClick={this.props.onClose} >
                    Cancel
                </CancelButton>
                <CreateButton
                    type="submit"
                    value="Submit" />
            </Form>
        );
    }


    SliderContent()
    {
        const HandleTitle = (event) => {
            event.preventDefault();
            var Title = event.target.value;
            this.setState({
                description: Title
            });
        };

        const HandleMax = (event) => {
            event.preventDefault();
            var Max = event.target.value;
            this.setState({
                max: Max
            });
        };

        const HandleMaxDescription = (event) => {
            event.preventDefault();
            var Description = event.target.value;
            this.setState({
                maxDescription: Description
            });
        };

        const HandleMin = (event) => {
            event.preventDefault();
            var Min = event.target.value;
            this.setState({
                min: Min
            });
        };

        const HandleMinDescription = (event) => {
            event.preventDefault();
            var MinDescription = event.target.value;
            this.setState({
                minDescription: MinDescription
            });
        };

        const HandleOption = (event) => {
            const Key = event.target.name;
            const Value = event.target.value;

            const Options = this.state.options;
            Options[Key].Description = Value;
            this.setState({
                options: Options
            });
        };

        const AddOption = () => {
            var Count = this.state.options !== undefined ?
                            this.state.options.length :
                            0;
            var User = localStorage.getItem("user");

            var Option = {
                UserID: User,
                Index: Count,
                Description: ""
            };

            var Options = this.state.options;
            Count > 0 ?
                Options.push(Option) :
                Options = [Option];
            this.setState({
                options: Options
            });
        };

        const CreateSlider = (event) => {
            event.preventDefault();
            const Code = sessionStorage.getItem("code");

            const Data = {
                Title: this.state.description,
                Options: this.state.options,
                Min: parseInt(this.state.min),
                MinDescription: this.state.minDescription,
                Max: parseInt(this.state.max),
                MaxDescription: this.state.maxDescription,
                ShowResults: true
            };

            Axios.post(`admin/${Code}/questions-create-slider`, Data,
                {
                    headers: {
                        'Content-Type': "application/json"
                    }
                }).then(res => {
                if (res.status === 201)
                {
                    this.setState({
                        type: "",
                        description: "",
                        options: [],
                        success: true
                    });
                    this.onClose();
                }
            });
        };
        return (
            <Form
                onSubmit={CreateSlider.bind(this)} >
                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={2}
                    pt={1}
                    px={3} >
                    <TextField
                        autoFocus={this.state.description == undefined || this.state.description.length < 1}
                        fullWidth
                        id="TextTitle"
                        label="Task Text"
                        onChange={HandleTitle}
                        value={this.state.description} />
                </Box>

                <Box
                    borderColor="transparent"
                    component="fieldset" >

                    <Box
                        borderColor="transparent"
                        component="fieldset"
                        display="inline"
                        mb={3}
                        pt={1}
                        px={3}
                        width="100%" >
                        <Typography
                            component="legend"
                            variant="subtitle2" >
                            Minimum
                        </Typography>

                        <TextField
                            id="min-desc"
                            label="Description"
                            name="min-desc"
                            onChange={HandleMinDescription.bind(this)}
                            type="text"
                            value={this.state.minDescription} />
                        <TextField
                            id="min"
                            label="Value"
                            name="min"
                            onChange={HandleMin.bind(this)}
                            ref="min"
                            type="number"
                            value={this.state.min} />
                    </Box>

                    <Box
                        borderColor="transparent"
                        component="fieldset"
                        display="inline"
                        mb={3}
                        pt={1}
                        px={3}
                        width="100%" >
                        <Typography
                            component="legend"
                            variant="subtitle2" >
                            Maximum
                        </Typography>

                        <TextField
                            id="max-desc"
                            label="Description"
                            name="max-desc"
                            onChange={HandleMaxDescription.bind(this)}
                            type="text"
                            value={this.state.maxDescription} />
                        <TextField
                            id="max"
                            label="Value"
                            name="max"
                            onChange={HandleMax.bind(this)}
                            ref="max"
                            type="number"
                            value={this.state.max} />
                    </Box>

                </Box>

                <Box
                    borderColor="transparent"
                    component="fieldset"
                    mb={2}
                    pt={1}
                    px={3} >
                    <Box
                        borderColor="transparent"
                        component="fieldset"
                        pt={1}
                        px={1} >
                        <Typography
                            component="legend"
                            variant="subtitle2" >
                            Options
                        </Typography>
                        {this.state.options !== undefined &&
                            this.state.options.map(option =>
                                <Box
                                    borderColor="transparent"
                                    component="fieldset"
                                    mb={1} >
                                    <TextField
                                        autoFocus={(option.Index + 1) === this.state.options.length}
                                        fullWidth
                                        id={`Option-${option.Index}`}
                                        key={option.Index}
                                        label={`Option ${option.Index + 1}`}
                                        name={option.Index}
                                        onChange={HandleOption.bind(this)}
                                        value={option.Description} />
                                </Box>
                            )}
                        <Box
                            borderColor="transparent"
                            component="fieldset"
                            mb={1} >
                            <TextField
                                color="gray"
                                fullWidth
                                label="Add option..."
                                onFocus={AddOption.bind(this)} />
                        </Box>
                    </Box>
                </Box>
                <CancelButton
                    onClick={this.props.onClose} >
                    Cancel
                </CancelButton>
                <CreateButton
                    type="submit"
                    value="Submit" />
            </Form>
        );
    }


    onClose()
    {
        if (this.props.onClose !== undefined)
            this.props.onClose(this.state.success);
        this.setState({
            type: "",
            title: "",
            description: "",
            options: [],
            showing: false,
            success: false,
            max: 5,
            maxDescription: "Very important",
            min: 1,
            minDescription: "Not important"
        });
    }


    render()
    {
        return (
            <ModalPage
                centered
                onHide={this.onClose.bind(this)}
                show={this.state.showing} >
                <Modal.Header
                    closeButton >
                    <Modal.Title>
                        {this.props.type === 0 ?
                             "Input: Open Text" :
                             this.props.type === 1 ?
                             "Vote: Multiple Choice" :
                             this.props.type === 2 ?
                             "Vote: Points" :
                             "Vote: Slider"
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.type === 0 ?
                         this.TextContent() :
                         this.props.type === 1 ?
                         this.MultipleChoiceContent() :
                         this.props.type === 2 ?
                         this.PointsContent() :
                         this.SliderContent()
                    }
                </Modal.Body>
            </ModalPage>
        );
    }
}