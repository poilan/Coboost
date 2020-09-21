import React, { Component } from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';
import { Input } from './Input';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { Collapse, IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { ColorPicker } from './ColorPicker';

const BackgroundContainer = styled.div`
    background: #fff;
    position: absolute;
`;

export function ResultBackground(props) {
    return (
        <BackgroundContainer {...props}>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
            <div style={{ height: "10%", width: "100%", borderTop: "1px solid #e4e4e4" }}> </div>
        </BackgroundContainer>
    );
}

const ItemContainer = styled.div`
    display: inline-block;
    height: 100%;
    width: ${props => 100 / props.total}%;
    left: ${props => ((100 / props.total) * props.index)}%;
    position: absolute;
`;

const PercentageContainer = styled.div`
    height: ${props => props.height};
    position: relative;

`;

const Percentage = styled.div`
    height: ${props => props.percentage}%;
    width: 50%;
    margin-left: -25%;
    background: ${props => props.color};
    color: #fff;
    overflow: hidden;
    font-size: 1rem;
    text-align: center;
    font-weight: 600;
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;
    box-shadow: 1px 0 1px 0 rgba(0, 0, 0, .04);

    &:hover {
           filter: saturate(150%) drop-shadow(6px -3px 3px black);
           cursor: ${props => props.group == "new" ? "pointer" : "default"};
        }
`;

export class ResultItem extends Component {
    state = {
        menuAnchor: null,
        colorAnchor: null,
    }
    validateHexColor = /^#([0-9A-Fa-f]{3}){1,2}$/;

    colorChange = (ColorEvent) => {
        if (!this.validateHexColor.test(ColorEvent.hex))
            return;

        this.setState({
            colorAnchor: null
        });
        const code = sessionStorage.getItem("code");

        let color = ColorEvent.hex;

        axios.post(`admin/${code}/option${this.props.index}-recolor`, JSON.stringify(color), { headers: { 'Content-Type': 'application/json', } });
    }

    colorOpen = () => {
        const anchor = this.state.menuAnchor;
        this.setState({
            menuAnchor: null,
            colorAnchor: anchor
        });
    }

    render() {
        return (
            <ItemContainer total={this.props.total} index={this.props.index}>
                <PercentageContainer height={`${this.props.height}`} >
                    <Percentage color={this.props.color} percentage={this.props.percentage} onClick={(e) => this.setState({ menuAnchor: e.currentTarget })}>{this.props.showPercentage ? (this.props.percentage > 0 && Math.round(this.props.percentage) + "%") : this.props.points != 0 ? this.props.points : ""}</Percentage>
                </PercentageContainer>
                <Input vote size="1" showcase={this.props.showcase}
                    id={this.props.id} index={this.props.index} title={this.props.title} description={this.props.description}
                    checked={this.props.checked} onClick={this.props.onClick}
                />

                <Menu
                    anchorEl={this.state.menuAnchor}
                    open={Boolean(this.state.menuAnchor)} onClose={() => this.setState({ menuAnchor: null })}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <MenuItem onClick={this.colorOpen}>
                        Change Color
                    </MenuItem>
                </Menu>
                <ColorPicker color={this.props.color} anchorEl={this.state.colorAnchor} transformOrigin={{ vertical: 'bottom', horizontal: 'center' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onChangeComplete={this.colorChange} onClose={() => this.setState({ colorAnchor: null })} />
            </ItemContainer>
        );
    }
}

export function ResultSlider(props) {
    let marks = [
        {
            value: props.min,
            label: `${props.min}`,
        },
        {
            value: props.max,
            label: `${props.max}`,
        },
    ]
    return (
        <Box key={props.index} component="fieldset" mb={1} pt={0} px={1} borderColor="grey.500" border={0}>
            <Input vote size="1"
                id={props.id} index={props.index} title={props.title} description={props.description}
                checked={props.checked}
                onClick={props.onClick} showcase={props.showcase}
            />
            <Box component="fieldset" px={2} borderColor="transparent">
                <Slider name={props.title} value={props.average}
                    marks={marks} min={props.min} max={props.max} color={props.color}
                    aria-labledby="discrete-slider" valueLabelDisplay="on"
                />
            </Box>
        </Box>
    );
}