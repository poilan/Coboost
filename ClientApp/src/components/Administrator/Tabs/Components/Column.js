import React from "react";
import Styled from "styled-components";
import "circular-std";
import Axios from "axios";

const Container = Styled.div`
    width: ${props => props.width * 320}px;
    height: ${props => props.showcase
        ? ""
        : "95%"};
    position: relative;
    overflow: ${props => props.showcase
        ? "hidden"
        : "auto"};
    padding: 10px;
    display: ${props => props.empty
        ? "none"
        : props.showcase
            ? "block"
            : "inline-block"};
    white-space: normal;
    margin-top: ${props => props.showcase
        ? "0"
        : "20px"};
    border-right: ${props => props.showcase
        ? "0"
        : "2px solid #C4C4C4"};
    scrollbar-width: thin;
    scrollbar-color: #575b75 #fff;
    vertical-align: top;
    page-break-inside: avoid;
`;

const WidthControl = Styled.div`
    width: ${props => props.width * 320}px;
    position: absolute;
    display: ${props => props.empty
        ? "none"
        : "inline-block"};
    height: 0;
`;

const Grow = Styled.div`
    position: absolute;
    right: -24px;
    top: -26px;
    font-size: 3.5rem;
    font-family: CircularStd;
    color: #A4A4A4;
    display ${props => props.id === "new"
        ? "none"
        : props.available
            ? "inline-block"
            : "none"};
    text-align: right;

    &:hover {
        cursor: pointer;
        color: #545454;
    }
`;

const Shrink = Styled(Grow)`
    text-align: left;
    right: -2px;
`;

export function Column(props) {
    const Drop = e => {
        e.preventDefault();
        const Drag = JSON.parse(e.dataTransfer.getData("drag"));
        const Code = sessionStorage.getItem("code");

        if (Drag.member !== undefined) {
            Axios.post(`admin/${Code}/question-create-group-C${props.column}`).then(setTimeout(() => {
                Axios.post(`admin/${Code}/group${Drag.group}-member${Drag.member}`);
            },
                200));
        }
        else if (Drag.column !== props.column) {
            const Key = Drag.group;
            const Target = props.column;

            Axios.post(`admin/${Code}/change-group${Key}-column${Target}`);
        }
    };

    const DragOver = e => {
        if (props.column === 0) {
            e.stopPropagation();
        }
        else {
            e.preventDefault();
        }
    };

    return (
        <React.Fragment>
            <WidthControl empty={props.empty ||
                props.last ||
                (props.column === 0 &&
                    props.children[0][0] !== undefined &&
                    props.children[0][0].props.children.length < 1)}
                width={props.width}>
                <Shrink available={props.width > 1}
                    onClick={() => props.shrink(props.column)}>
                    &#129080;
                </Shrink>
                <Grow available={props.width < 4}
                    onClick={() => props.grow(props.column)}>
                    &#129082;
                </Grow>
            </WidthControl>
            <Container column={props.column}
                empty={props.column === 0 &&
                    props.children[0][0] &&
                    props.children[0][0].props.children.length < 1}
                onDragOver={DragOver}
                onDrop={Drop
                }
                showcase={props.empty}
                width={props.width}>
                {props.children}
            </Container>
        </React.Fragment>
    );
}