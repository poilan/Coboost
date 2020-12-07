import React, {Component} from "react";
import Styled from "styled-components";
import "circular-std";
import Axios from "axios";
import {Input} from "./Input";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import {Collapse, IconButton, Menu, MenuItem} from "@material-ui/core";
import {ColorPicker} from "./ColorPicker";


const BackgroundContainer = Styled.div`
    background: #fff;
    position: absolute;
`;

const PercentageText = Styled.div`
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1.5rem;
    font-weight: 500;
    color: #777;
    transform: translateY(-50%);
`;


export function ResultBackground(props) {
    return (
        <BackgroundContainer {...props}>
            <div
                style={{ height: "10%", width: "100%", position: "relative", borderTop: "1px solid #ddd" }} >
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", backgroundColor: "#f6f6f6", borderTop: "1px solid #ddd" }} >
                <PercentageText>90%</PercentageText>
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", borderTop: "1px solid #ddd" }} >
                <PercentageText>80%</PercentageText>
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", backgroundColor: "#f6f6f6", borderTop: "1px solid #ddd" }} >
                <PercentageText>70%</PercentageText>
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", borderTop: "1px solid #ddd" }} >
                <PercentageText>60%</PercentageText>
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", backgroundColor: "#f6f6f6", borderTop: "1px solid #ddd" }} >
                <PercentageText>50%</PercentageText>
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", borderTop: "1px solid #ddd" }} >
                <PercentageText>40%</PercentageText>
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", backgroundColor: "#f6f6f6", borderTop: "1px solid #ddd" }} >
                <PercentageText>30%</PercentageText>
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", borderTop: "1px solid #ddd" }} >
                <PercentageText>20%</PercentageText>
            </div>
            <div
                style={{ height: "10%", width: "100%", position: "relative", backgroundColor: "#f6f6f6", borderTop: "1px solid #ddd" }} >
                <PercentageText>10%</PercentageText>
            </div>
        </BackgroundContainer>
    );
}


const ItemContainer = Styled.div`
    display: inline-block;
    height: 100%;
    width: ${props => 100 / props.total}%;
    left: ${props => ((100 / props.total) * props.index)}%;
    position: absolute;
`;

const PercentageContainer = Styled.div`
    height: ${props => props.height};
    position: relative;

`;

const Percentage = Styled.div`
    height: ${props => props.percentage}%;
    width: 50%;
    margin-left: -25%;
    background: ${props => props.color};
    color: #fff;
    overflow: hidden;
    font-size: 1rem;
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;
    box-shadow: 1px 0 1px 0 rgba(0, 0, 0, .04);

    &:hover {
           filter: saturate(125%) drop-shadow(6px -3px 3px black);
           cursor: ${props => props.group === "new" ?
                              "pointer" :
                              "default"};
        }
`;

export class ResultItem extends Component {
    state = {
        menuAnchor: null,
        colorAnchor: null
    }


    validateHexColor = /^#([0-9A-Fa-f]{3}){1,2}$/;


    colorChange = (colorEvent) => {
        if (!this.validateHexColor.test(colorEvent.hex))
            return;

        this.setState({
            colorAnchor: null
        });
        const Code = sessionStorage.getItem("code");

        const Color = colorEvent.hex;

        Axios.post(`admin/${Code}/option${this.props.index}-recolor`,
            JSON.stringify(Color),
            { headers: { 'Content-Type': "application/json" } });
    }


    colorOpen = () => {
        const Anchor = this.state.menuAnchor;
        this.setState({
            menuAnchor: null,
            colorAnchor: Anchor
        });
    }


    render()
    {
        return (
            <ItemContainer
                index={this.props.index}
                total={this.props.total} >
                <PercentageContainer
                    height={`${this.props.height}`} >
                    <Percentage
                        color={this.props.color}
                        onClick={(e) =>
                            this.setState({ menuAnchor: e.currentTarget })}
                        percentage={this.props.percentage} >
                        {this.props.showPercentage ?
                             (this.props.percentage > 0 && Math.round(this.props.percentage) + "%") :
                             this.props.points !== 0 ?
                             this.props.points :
                             ""}
                    </Percentage>
                </PercentageContainer>
                <Input
                    checked={this.props.checked}
                    description={this.props.description}
                    favorite={this.props.favorite}
                    id={this.props.id}
                    index={this.props.index}
                    onClick={this.props.onClick}
                    showcase={this.props.showcase}
                    size="1"
                    title={this.props.title}
                    vote />

                <Menu
                    anchorEl={this.state.menuAnchor}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    onClose={() => this.setState({ menuAnchor: null })}
                    open={Boolean(this.state.menuAnchor)}
                    transformOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }} >
                    <MenuItem
                        onClick={this.colorOpen} >
                        Change Color
                    </MenuItem>
                </Menu>
                <ColorPicker
                    anchorEl={this.state.colorAnchor}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    color={this.props.color}
                    onChangeComplete={this.colorChange}
                    onClose={() => this.setState({ colorAnchor: null })}
                    transformOrigin={{ vertical: "bottom", horizontal: "center" }} />
            </ItemContainer>
        );
    }
}


export function ResultSlider(props) {
    const Marks = [
        {
            value: props.min,
            label: `${props.minDescription ?
                      props.min :
                      props.minDescription}`
        },
        {
            value: props.max,
            label: `${props.maxDescription ?
                      props.max :
                      props.maxDescription}`
        }
    ];
    return (
        <Box
            border={0}
            borderColor="grey.500"
            component="fieldset"
            key={props.index}
            mb={1}
            pt={0}
            px={1} >
            <Input
                checked={props.checked}
                description={props.description}
                favorite={this.props.favorite}
                id={props.id}
                index={props.index}
                onClick={props.onClick}
                showcase={props.showcase}
                size="1"
                title={props.title}
                vote />
            <Box
                borderColor="transparent"
                component="fieldset"
                px={2} >
                <Slider
                    aria-labledby="discrete-slider"
                    color={props.color}
                    marks={Marks}
                    max={props.max}
                    min={props.min}
                    name={props.title}
                    style={{ color: props.color }}
                    value={props.average}
                    valueLabelDisplay="on" />
            </Box>
        </Box>
    );
}