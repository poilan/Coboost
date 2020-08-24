import React from 'react';
import styled from 'styled-components';
import "circular-std";
import axios from 'axios';
import { Input } from './Input';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';

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
    width: ${props => 97 / props.total}%;
    left: ${props => ((97 / props.total) * props.index) + 3}%;
    position:absolute;
    overflow: hidden;
`;

const PercentageContainer = styled.div`
    height: ${props => props.height};
    position: relative;

`;

const Percentage = styled.div`
    height: ${props => props.percentage}%;
    width: 50%;
    margin-left: -25%;
    background: #4C7AD3;
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
`;

export function ResultItem(props) {
    return (
        <ItemContainer total={props.total} index={props.index}>
            <PercentageContainer height={`${props.height}`}>
                <Percentage percentage={props.percentage}> {props.percentage > 0 && Math.floor(props.percentage) + "%"} </Percentage>
            </PercentageContainer>
            <Input vote size="1"
                id={props.id} index={props.index} title={props.title}
                checked={props.checked}
                onCheck={props.onCheck} showcase={props.showcase}
            />
        </ItemContainer>
    );
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
                id={props.id} index={props.index} title={props.title}
                checked={props.checked}
                onCheck={props.onCheck} showcase={props.showcase}
            />
            <Box component="fieldset" px={2} borderColor="transparent">
                <Slider name={props.title} value={props.average}
                    marks={marks} min={props.min} max={props.max}
                    aria-labledby="discrete-slider" valueLabelDisplay="on"
                />
            </Box>
        </Box>
    );
}