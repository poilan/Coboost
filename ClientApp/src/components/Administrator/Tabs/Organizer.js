import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { useState } from 'react';
import { PageModal } from '../../Services/PageModal';
import { Input } from './Components/Input';
import { Group } from './Components/Group';
import { Column } from './Components/Column';
import { Collection, Task } from './Components/Tasks';
import { ResultBackground, ResultItem } from './Components/Results';
import { Ico_Text, Ico_MultipleChoice } from '../../Classes/Icons';

export class Organizer extends Component {
    state = {
        tasks: [],
        overview: true,
        active: 0,
        columns: [],
        selected: [],
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    renderText(task) {
        return (
            <MainContainer>
                {this.state.modalInput && <PageModal title="Send Input" body={this.modalInputContent()} onClose={this.modalInputClose.bind(this)} />}
                {this.state.modalRename && <PageModal title="Rename" body={this.modalRenameContent()} onClose={this.modalRenameClose.bind(this)} />}
                <TitleBreadCrumb onClick={this.backtoOverview.bind(this)}>{this.state.title} &#187; Organizing &#187;   {question.title}</TitleBreadCrumb>

                <AnswerButton onClick={this.modalInputOpen.bind(this)}>New Input</AnswerButton>
                <SendToMC onClick={this.organizeCreateVote.bind(this)}>Send to voting</SendToMC>
                <MergeButton onClick={this.organizeMerge.bind(this)}>Merge</MergeButton>

                {this.state.columns !== undefined && this.state.columns.map(column =>

                    <Column column={column.index} width={column.width} empty={column.index + 1 == this.state.columns.length}
                        grow={() => this.grow(column.index)}
                        shrink={() => this.shrink(column.index)}>
                        {question.groups !== undefined &&
                            question.groups.map(group => {
                                if (column.index === group.Column) {
                                    return (
                                        <Group id={group.Index} key={group.Index}
                                            group={group.Index} column={group.Column} title={group.Title} size={column.width}
                                            double={this.modalRenameOpen.bind(this)}>

                                            {group.Members !== undefined &&
                                                group.Members.map(member =>

                                                    <Input id={group.Index + "-" + member.Index} key={member.Index}
                                                        member={member.Index} group={group.Index} column={group.Column} title={member.Title} size={column.width}
                                                        double={this.modalRenameOpen.bind(this)}
                                                        checked={this.state.selected.indexOf(group.Index + "-" + member.Index) !== -1}
                                                        onCheck={this.organizeSelect.bind(this)}
                                                    />

                                                )}
                                        </Group>
                                    );
                                }
                            }
                            )}

                        {column.index + 1 == this.state.columns.length &&
                            <Group id="new"
                                group="new" column={column.index} title="? Create Group" size={column.width}
                                onClick={this.createGroup.bind(this)} />
                        }
                    </Column>

                )}
            </MainContainer>
        );
    }

    renderMultipleChoice(task) {
        return (
            <MainContainer>
                <SendToT onClick={() => this.organizeCreateInput(question)}>New Input: Text</SendToT>
                <ResultBackground style={{ width: "95%", height: "70%" }} />
                {question.options !== undefined && question.options.map(option =>
                    <ResultItem id={option.Index} id={option.Index} index={option.Index} title={option.Title}
                        vote percentage={((option.Votes.length / question.TotalVotes) * 100)} height="70%" total={question.options.length}
                        checked={this.state.selected.indexOf(option.Index.toString()) !== -1}
                        onCheck={this.organizeSelect.bind(this)}
                    />
                )}
            </MainContainer>
        );
    }

    render() {
        if (this.state.overview) {
            return (
                <MainContainer>
                    <TitleBreadCrumb></TitleBreadCrumb>
                    {this.state.tasks.map(task =>
                        <ItemTask></ItemTask>
                    )}
                </MainContainer>
            )
        } else {
            let task = this.state.tasks[this.state.active];

            if (task.type == 0) {
                return this.renderText(task);
            } else if (task.type == 1) {
                return this.renderMultipleChoice(task);
            }
        }
    }
}