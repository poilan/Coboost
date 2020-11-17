import React, {Component} from "react";
import "circular-std";
import {BlockPicker} from "react-color";
import Popover from "@material-ui/core/Popover";


export class ColorPicker extends Component {
    render()
    {
        return (
            <Popover
                anchorEl={this.props.anchorEl}
                anchorOrigin={this.props.transformOrigin}
                onClose={this.props.onClose}
                open={Boolean(this.props.anchorEl)}
                transformOrigin={this.props.transformOrigin} >
                <BlockPicker
                    color={this.props.color}
                    onChange={(color, event) => event.stopPropagation()}
                    onChangeComplete={this.props.onChangeComplete} />
            </Popover>
        );
    }
}