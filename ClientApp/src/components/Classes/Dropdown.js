import React, { Component } from 'react';
import styled from 'styled-components';
import 'circular-std';

const DropStyle = styled.div`
    position: relative;
    display: inline-block;

    margin: 0px 5px;
`;

const DropButton = styled.button`
    background: #ffffff;
    border: none;
    border-radius: 10px;
    color: #100E0E;
    outline: none;

    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    padding: 7px 20px;

    :hover {
        /*background: none;*/
        border: none;

        color: #4C7AD3;
    };

    :focus {
        outline: none;
        box-shadow: 0 0 0px 3px rgba(76,122,211, 0.5); // Same color as text, just using RGB so opacity can be altered
    }
`;

const DropItem = styled.a`
    display: block;
    padding: 12px 16px;
    /*text-align: center;*/
    color: ${props => props.disabled ? "rgba(0, 0, 0, 0.3)" : "black"} !important;

    user-select: ${props => props.disabled ? "none" : "all"};

    :hover {
        text-decoration: none;
        background-color: rgba(0, 0, 0, 0.05);
        cursor: ${props => props.disabled ? "default" : "pointer"};
    }

    :not(:last-child) {
        border-bottom 1px solid rgba(0, 0, 0, 0.25);
    }
`;

const DropdownContent = styled.div`
    position: absolute;
    z-index: 1;
    right: 0px;

    display: ${props => props.hide ? "none" : "block"};
    overflow: hidden;

    margin-top: 5px;
    min-width: max-content;

    background-color: white;
    border: 1px solid gray;
    border-radius: 10px;
`;

export class BannerLink extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <>
                <DropItem disabled={this.props.disabled} href={this.props.href} onClick={this.props.onClick}>{this.props.children}</DropItem>
            </>
        );
    }
}

export default class BannerDropdown extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            hidden: true
        };

        this.onClick = this.onClick.bind(this);
        this.onFocusLoss = this.onFocusLoss.bind(this);
    }

    onClick() {
        this.setState({
            hidden: !this.state.hidden
        });
    }

    onFocusLoss() {
        this.setState({
            hidden: true
        });
    }

    render() {
        return(
            <>
                <DropStyle style={this.props.style}>
                    <DropButton onClick={() => this.onClick()} onBlur={() => this.onFocusLoss()}>{this.props.title}</DropButton>
                    <DropdownContent hide={this.state.hidden}>
                        {this.props.children}
                    </DropdownContent>
                </DropStyle>
            </>
        );
    }
}