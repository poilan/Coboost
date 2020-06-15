import React, { Component } from 'react';
import axios from 'axios';
import { Modal, InputGroup, Form, Button, Row, Card, Popover, OverlayTrigger, Tab, Container, Nav, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { useState } from 'react';
import { PageModal } from '../../Services/PageModal';
import { Input } from '../../Classes/Input';
import { Group } from '../../Classes/Group';
import { Column } from '../../Classes/Column';
import { Collection, Task } from '../../Classes/Tasks';
import { ResultBackground, ResultItem } from '../../Classes/Results';
import { Ico_Text, Ico_MultipleChoice } from '../../Classes/Icons';

export class Tasks extends Component {
    state = {
        tasks: [],
    }

    renderActive() {
        if (this.state.question == -1) {
            return (
                <SelectedSlide>
                    <SlideTitle>Hello there</SlideTitle>
                    <SlideBody>To get started click "Create new Task" on the left</SlideBody>
                </SelectedSlide>
            );
        }

        var question = this.state.questions[this.state.question];

        if (question !== undefined && question.questionType === -1) {
            return this.taskCreate();
        }
        else if (question !== undefined && question.questionType === 0) {
            return (
                <SelectedSlide>
                    <SlideTitle>{question.title}</SlideTitle>
                    <SlideBody>{question.groups !== undefined && question.groups.slice(1).map(group =>
                        group.Members !== undefined && group.Members.map(member =>
                            <VoteOption key={member.Index}>{member.Title}</VoteOption>
                        )
                    )}</SlideBody>
                </SelectedSlide>
            );
        }
        else if (question !== undefined && question.questionType === 1) {
            return (
                <SelectedSlide>
                    <SlideTitle>{question.title}</SlideTitle>
                    <SlideBody>
                        {question.options !== undefined && question.options.map(option =>
                            <>
                                <VoteOption id={option.Index} index={option.Index} name={"Option " + option.Index}>{option.Description} {option.Votes.length !== 0 && " (" + Math.floor((option.Votes.length / question.TotalVotes) * 100) + "%)"}</VoteOption>
                            </>
                        )}
                    </SlideBody>
                </SelectedSlide>
            );
        }
        else {
            return (
                <SelectedSlide>
                    <SlideTitle>Hello there</SlideTitle>
                    <SlideBody>To get started click "Create new Task" on the left</SlideBody>
                </SelectedSlide>
            );
        }
    }

    render() {
        return (
            <>
                <Collection createTask={this.createTask.bind(this)}>
                    {this.state.questions.map(question =>
                        <Task key={question.index} id={question.index}
                            onClick={this.taskClick.bind(this)} active={this.state.question == question.index}
                            type={question.questionType} title={question.title}
                        />
                    )}
                </Collection>
                <SlideContainer>
                    {this.renderActive()}
                </SlideContainer>
            </>
        );
    }
}