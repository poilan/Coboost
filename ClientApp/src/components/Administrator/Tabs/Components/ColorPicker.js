import React, { Component } from 'react';
import styled from 'styled-components';
import "circular-std";
import { BlockPicker } from 'react-color';
import Popover from '@material-ui/core/Popover';

export class ColorPicker extends Component {
    state = {
        anchor: this.props.anchorEl
    }

    render() {
        return (
            <Popover anchorEl={this.props.anchorEl} open={Boolean(this.props.anchorEl)} transformOrigin={{ vertical: 'top', horizontal: 'center' }} anchorOrigin={{ vertical: 'center', horizontal: 'center' }} onClose={this.props.onClose}>
                <BlockPicker color={this.props.color} onChangeComplete={this.props.onChangeComplete} />
            </Popover>
        );
    }
}