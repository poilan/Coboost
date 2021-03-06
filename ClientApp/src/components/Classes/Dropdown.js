import React, {Component} from "react";
import Styled from "styled-components";
import "circular-std";


const DropStyle = Styled.div`
    position: relative;
    display: inline-block;

    margin: 0px 5px;
`;

const DropButton = Styled.button`
    background: #fff;
    border: none;
    border-radius: 10px;
    color: #100E0E;
    outline: none;

    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    padding: 7px 20px;

    :not(:first-child) {
        margin: 0px 2px;
    }

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

const DropItem = Styled.button`
    display: block;
    padding: 12px 16px;

    width: 100%;
    background-color: transparent;
    border: none;

    color: ${props => props.disabled ?
                      "rgba(0, 0, 0, 0.3)" :
                      "black"} !important;

    user-select: ${props => props.disabled ?
                            "none" :
                            "all"};

    :hover {
        text-decoration: none;
        background-color: rgba(0, 0, 0, 0.05);
    }

    :not(:last-child) {
        border-bottom 1px solid rgba(0, 0, 0, 0.25);
    }
`;

const DropdownContent = Styled.div`
    position: absolute;
    z-index: 1;
    right: 0px;

    display: ${props => props.hide ?
                        "none" :
                        "block"};
    overflow: hidden;

    margin-top: 5px;
    min-width: max-content;

    background-color: white;
    border: 1px solid gray;
    border-radius: 10px;
`;

export class BannerButton extends React.Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <React.Fragment>
                <DropButton
                    disabled={this.props.disabled}
                    onClick={this.props.onClick}
                    style={this.props.style} >
                    {this.props.children}
                </DropButton>
            </React.Fragment>
        );
    }
}

export class BannerLink extends React.Component {
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (
            <React.Fragment>
                <DropItem
                    disabled={this.props.disabled}
                    onClick={this.props.onClick} >
                    {this.props.children}
                </DropItem>
            </React.Fragment>
        );
    }
}

export class BannerDropdown extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            hidden: true
        };

        this.onClick = this.onClick.bind(this);
        this.onFocusLoss = this.onFocusLoss.bind(this);
    }


    onClick()
    {
        this.setState({
            hidden: !this.state.hidden
        });
    }


    onFocusLoss()
    {
        this.setState({
            hidden: true
        });
    }


    render()
    {
        return (
            <React.Fragment>
                <DropStyle
                    style={this.props.style} >
                    <DropButton
                        onClick={() => this.onClick()} >
                        {this.props.title}
                    </DropButton>
                    <DropdownContent
                        hide={this.state.hidden}
                        onMouseLeave={() => this.onFocusLoss()} >
                        {this.props.children}
                    </DropdownContent>
                </DropStyle>
            </React.Fragment>
        );
    }
}