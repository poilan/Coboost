import React from "react";
import Styled from "styled-components";
import "circular-std";
import Axios from "axios";


const Container = Styled.div`
    width: ${props => props.width * 400}px;
    height: calc(95% - 2rem);
    position: relative;
    overflow: ${props => props.showcase ?
                         "hidden" :
                         "auto"};
    padding: ${props => props.column === 0 ?
                        "2px" :
                        "10px"};;
    display: ${props => props.empty ?
                        "none" :
                        props.column === 0 && props.showcase ?
                        "none" :
                        "inline-block"};
    white-space: normal;
    margin-top: ${props => props.showcase ?
                           "0" :
                           "calc(20px + 2rem)"};
    border-right: ${props => props.showcase ?
                             "0" :
                             "2px solid #C4C4C4"};
    scrollbar-width: thin;
    scrollbar-color: #374785 #fff;
    vertical-align: top;
    page-break-inside: avoid;
`;

const WidthControl = Styled.div`
    width: ${props => props.width * 400}px;
    position: absolute;
    display: ${props => props.empty ?
                        "none" :
                        "inline-block"};
    height: 0;
`;

const Grow = Styled.div`
    position: absolute;
    right: -24px;
    top: -26px;
    font-size: 3.5rem;
    font-family: CircularStd;
    color: #A4A4A4;
    display ${props => props.id === "new" ?
                       "none" :
                       props.available ?
                       "inline-block" :
                       "none"};
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

        if (Drag.member !== undefined)
        {
            const Key = [Drag.group.toString(), Drag.member.toString()];
            const Selected = props.selected();
            const Keys = [];

            if (Selected.find(element => {
                return element[0] === Key[0] ?
                           element[1] === Key[1] :
                           false;
            }))
            {
                Selected.forEach(select => {
                    const Subject = {
                        Group: select[0],
                        Member: select[1]
                    };

                    Keys.push(Subject);
                });
            }
            else
            {
                let Done = false;
                Selected.forEach(select => {
                    if (!Done && Key[0] >= select[0])
                    {
                        if ((Key[0] === select[0] && Key[1] > select[1]) || Key[0] > select[0])
                        {
                            const Insert = {
                                Group: Key[0],
                                Member: Key[1]
                            };
                            Keys.push(Insert);
                            Done = true;
                        }
                    }
                    const Subject = {
                        Group: select[0],
                        Member: select[1]
                    };

                    Keys.push(Subject);
                });

                if (!Done)
                {
                    const Insert = {
                        Group: Key[0],
                        Member: Key[1]
                    };
                    Keys.push(Insert);
                }
            }

            Axios.post(`admin/${Code}/question-create-group-C${props.column}`).then(setTimeout(() => { Axios.post(`admin/${Code}/group/change-last`, Keys); },
                200));

            props.clearSelect();
        }
        else if (Drag.column !== props.column)
        {
            const Key = Drag.group;
            const Target = props.column;

            Axios.post(`admin/${Code}/change-group${Key}-column${Target}`);
        }
    };

    const DragOver = e => {
        if (props.column === 0)
            e.stopPropagation();
        else
            e.preventDefault();
    };

    return (
        <React.Fragment>
            <WidthControl
                empty={props.empty ||
                    props.last ||
                    (props.column === 0 &&
                        props.children[0][0] !== undefined &&
                        props.children[0][0].props.children.length < 1)}
                width={props.width} >
                <Shrink
                    available={props.column === 0 ?
                                   props.width > 0 :
                                   props.width > 1}
                    onClick={() => props.shrink(props.column)} >
                    &#129080;
                </Shrink>
                <Grow
                    available={props.width < 4}
                    onClick={() => props.grow(props.column)} >
                    &#129082;
                </Grow>
            </WidthControl>
            <Container
                column={props.column}
                empty={props.column === 0 &&
                    props.children[0][0] &&
                    props.children[0][0].props.children.length < 1}
                onDragOver={DragOver}
                onDrop={Drop}
                showcase={props.empty}
                width={props.width} >
                {props.children}
            </Container>
        </React.Fragment>
    );
}