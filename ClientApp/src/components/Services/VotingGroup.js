import React, { Component } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import styled from 'styled-components';
import "../Administrator/Tabs/node_modules/circular-std";

const MultipleChoiceGroup = styled(ToggleButtonGroup)`
    display: block;
    padding: 20px;
`;

const TickStem = styled.div`
    position: relative;
    width: 2px;
    height: 12px;
    background-color: rgb(71, 114, 224);
    border-radius: 11px;
    left: 12px;
    top: 6px;
    transform: rotate(45deg);
`;

const TickKick = styled.div`
    position: relative;
    width: 6px;
    height: 2px;
    background-color: rgb(71, 114, 224);
    left: 5px;
    top: 1px;
    transform: rotate(45deg)
`;

const Tick = styled.div`
    width: 24px;
    height: 24px;
    
    float: left;
    
    border-radius: 12px;
    border: 1px solid black;
    
    margin-top: 3px;
    margin-right: 20px;
    
    display: inline-block;
`;

export const MultipleChoiceButton = styled(ToggleButton)`
    background-color: transparent !important;
    border-radius: 10px;
    border-color: black !important;
    color: black !important;
    
    text-align: left;
    padding-left: 20px;
    
    ${Tick} {
        ${TickKick} {
            background-color: transparent;
        };
        
        ${TickStem} {
            background-color: transparent;
        };
    };
    
    &.active {
        color: white !important;
        background-color: rgb(71, 114, 224) !important;
        border-color: rgb(71, 114, 224) !important;
        
        ${Tick} {
            display: inline;
            background-color: white;
            border-color: white;

            ${TickKick} {
                background-color: rgb(71, 114, 224);
            };
            
            ${TickStem} {
                background-color: rgb(71, 114, 224);
            };
        };
    };
`;

export class MultipleChoiceOption extends Component {
    render() {
        return (<>
            <MultipleChoiceGroup toggle name="multipleChoice" vertical>
                <MultipleChoiceButton name="test" size="lg" type="radio">
                    <Tick>
                        <TickStem />
                        <TickKick />
                    </Tick>
                    Hello
                </MultipleChoiceButton>
            </MultipleChoiceGroup>
        </>);
    }
}