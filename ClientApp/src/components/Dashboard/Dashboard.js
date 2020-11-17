import React, {Component} from "react";
import Axios from "axios";
import {PageModal} from "../Services/PageModal";
import {Modal, InputGroup, Form, Dropdown, DropdownButton, Nav, Col} from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import {Ico_Box} from "../Classes/Icons";
import {Breadcrumbs, Link} from "@material-ui/core";
import {BsJustify} from "react-icons/bs";
import {BannerDropdown, BannerButton, BannerLink} from "../Classes/Dropdown";


const MainContainer = Styled(Col)`
    display: table;
    height: 100%;
    width: 100%;
    background: #E4E4E4;
    position: absolute;
    padding: 0px;
`;

const Banner = Styled(Col)`
    position: sticky;
    background: #575b75;
    height: 75px;
    top: 0;
    left: 0;
    z-index: 11;
    padding-right: 15%;
`;

const Header = Styled(Col)`
    background: #fff;
    position: sticky;
    height: 50px;
    left: 0;
    top: 75px;

    display: flex;
    flex-direction: row;
    box-shadow: inset 0px -4px 0px 0px #cfcfcf;
    z-index: 10;
`;

const HeaderText = Styled.h1`
    font-family: CircularStd;
    font-weight: 425;
    text-align: center;
    font-size: 1rem;

    padding: 10px 35px;
    border-bottom: 4px solid #575b75;
    cursor: pointer;

    flex: 1 1 auto;
    margin: 5px;
    margin-bottom: 0px;
`;

const ProjectContainer = Styled(Col)`
    position: absolute;
    background: #E4E4E4;
    min-height: calc(100vh - 130px);
    left: 0;
    top: 130px;
`;

const ProjectText = Styled.h1`
    position: absolute;
    width: 95%;
    text-align: center;
    top: 30%;
    font-family: CircularStd;
    font-size: 1rem;
    font-weight: 400;
`;

const ProjectButton = Styled(BannerButton)`
    color: #fff;
    background: #4C7AD3;
    top: 40%;
    left: 45%;
`;

const CategoryContainer = Styled(Col)`
    position: absolute;
    background: #E4E4E4;
    top: 125px;
    width: 100%;
    left: 0:
`;

const Category = Styled.div`
    background: #fff;
    width: 70%;
    margin-top: 20px;
    margin-left: 15%;
    border-radius: 10px;
    height: 75px;
    position: relative;

    &:hover {
        cursor: pointer;
        opacity: 75%;
    }
`;

const CategoryTitle = Styled.h3`
    font-size: 1rem;
    position: relative;
    padding: 30px 0;
    margin-left: 3%;
    font-family: CircularStd;
    font-weight: 500;
    display: inline-block;
    flex-direction: row;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 25%;
`;

const CategoryIdentity = Styled(CategoryTitle)`
    color: #A4A4A4;
`;

const CategoryTime = Styled(CategoryIdentity)`
    float: right;
    text-align: right;
`;

const ProjectModalContent = Styled.div`
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
`;

const PopupText = Styled.h3`
    font-family: CircularStd;
    font-size: 1rem;
    padding: 10px;
    color: #100e0e;
    opacity: 50%;
`;

const CancelButton = Styled(Nav.Link)`
    color: #100e0e;
    background: #fff;
    position: relative;
    display: inline-block;
    left: 0;
    top: 0;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
`;

const CreateButton = Styled.input`
    color: #fff;
    background: #4C7AD3;
    position: relative;
    display: inline-block;
    left: 0;
    top: 0;
    font-family: CircularStd;
    border-radius: 100px;
    font-weight: 450;
    text-align: center;
    width: 200px;
`;

const ModalText = Styled.h1`
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1rem;
    position: relative;
    margin-bottom: 20px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
`;

const RemoveButton = Styled(Ico_Box)`
    float: right;
    position: relative;
    padding: 30px 0;
    margin-left: 3%;
    margin-right: 1%;
    display: inline-block;
    flex-direction: row;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 25%;
`;

const BreadCrumb = Styled(Breadcrumbs)`
     &&& {
        font-family: CircularStd;
        font-Size: 1.25rem;
        color: #fff;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
    }
`;

const BreadText = Styled(Link)`
    color: ${props => props.active ?
                      "#4C7AD3" :
                      "#fff"};
    font-size: 1.25rem;
`;

export class Dashboard extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            sessions: [],
            showNewSessionModal: false,
            showNewTemplateModal: false,
            title: "",

            modal: {
                delete: false,
                code: 0
            }
        };
        this.createProject = this.createProject.bind(this);
        this.newProject = this.newProject.bind(this);
        this.newTemplate = this.newTemplate.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sessionClick = this.sessionClick.bind(this);
        this.logout = this.logout.bind(this);
    }


    componentDidMount()
    {
        this.getSessions();
    }


    modal = {
        delete: {
            open: (e, identity) => {
                e.stopPropagation();
                this.setState({
                    modal: {
                        delete: true,
                        code: identity
                    }
                });
            },

            content: () => {
                const DeleteSession = (e) => {
                    e.preventDefault();

                    Axios.post(`admin/${this.state.modal.code}/delete`).then(setTimeout(this.getSessions(), 500));
                    this.modal.delete.close();
                };

                return (
                    <Form
                        autoComplete="off"
                        onSubmit={(e) => DeleteSession(e)} >
                        <ModalText>
                            Are you sure you want to delete this session?
                            <br /> This action can not be undone
                        </ModalText>
                        <CancelButton
                            onClick={() => this.modal.delete.close()} >
                            Cancel
                        </CancelButton>
                        <CreateButton
                            type="submit"
                            value="Delete Session" />
                    </Form>
                );
            },

            close: () => {
                this.setState({
                    modal: {
                        delete: false,
                        code: 0
                    }
                });
            }
        }
    }


    async getSessions()
    {
        const Compare = (a, b) => {
            const A = new Date(Date.parse(a.lastOpen));
            const B = new Date(Date.parse(b.lastOpen));

            return B.getTime() - A.getTime();
        };

        const Email = localStorage.getItem("user");
        await Axios.get(`admin/sessions-${Email}`).then((response) => {
            const Data = response.data.sort(Compare);

            this.setState({ sessions: Data });
        });
    }


    newProject()
    {
        this.setState({
            showNewSessionModal: true
        });
    }


    newTemplate()
    {
        this.setState({
            showNewTemplateModal: true
        });
    }


    createProject(event)
    {
        event.preventDefault();
        this.closeModal();

        const Data = {
            Title: this.state.title,
            Email: localStorage.getItem("user"),
            Slides: "{}",
            Settings: "{}",
            Questions: "{}"
        };

        Axios.post(`admin/create`, Data).then(res => {
            if (res.status === 202)
            {
                //Created Session
                this.getSessions();
            }
            else if (res.status === 406)
            {
                //Title can't be empty!
            }
        });

        this.setState({ title: "" });
    }


    handleChange(e)
    {
        const Name = e.target.name;
        const Value = e.target.value;

        this.setState({
            [Name]: Value
        });
    }


    sessionClick(e)
    {
        Axios.post(`admin/load-${e.id}`).then(res => {
            if (res.status === 200)
            {
                //Session already active?
                sessionStorage.setItem("code", e.id);
                sessionStorage.setItem("title", e.getAttribute("name"));
                this.props.history.push("/administrator");
            }
            else if (res.status === 201)
            {
                //Session Created!
                sessionStorage.setItem("code", e.id);
                sessionStorage.setItem("title", e.getAttribute("name"));
                this.props.history.push("/administrator");
            }
            else if (res.status === 404)
            {
                //Session not found
            }
        });
    }


    sessionRender()
    {
        if (this.state.sessions && this.state.sessions.length)
        {
            return (
                this.state.sessions.map(session =>
                    <Category
                        id={session.identity}
                        index={session.identity}
                        key={session.identity}
                        name={session.title}
                        onClick={((e) => this.sessionClick(e.target))} >
                        <CategoryTitle
                            id={session.identity}
                            index={session.identity}
                            key={session.identity}
                            name={session.title} >
                            {session.title}
                        </CategoryTitle>
                        <CategoryIdentity
                            id={session.identity}
                            index={session.identity}
                            key={session.identity}
                            name={session.title} >
                            #{session.identity}
                        </CategoryIdentity>
                        <RemoveButton
                            onClick={(e) => this.modal.delete.open(e, session.identity)} />
                        <CategoryTime
                            id={session.identity}
                            index={session.identity}
                            key={session.identity}
                            name={session.title} >
                            {this.displayDate(session.lastOpen)}
                        </CategoryTime>
                    </Category>)
            );
        }
        else
        {
            return (
                <ProjectContainer>
                    <ProjectText>We didn't find any projects here, create your first now!</ProjectText>
                    <ProjectButton
                        onClick={this.newProject} >
                        New Session
                    </ProjectButton>
                </ProjectContainer>
            );
        }
    }


    displayDate(dateTime)
    {
        // ReSharper disable once UsageOfPossiblyUnassignedValue
        const Time = new Date(Date.parse(dateTime));
        let Month = "";
        switch (Time.getMonth() + 1)
        {
            case 1:
                Month = "January";
                break;
            case 2:
                Month = "February";
                break;
            case 3:
                Month = "March";
                break;
            case 4:
                Month = "April";
                break;
            case 5:
                Month = "May";
                break;
            case 6:
                Month = "June";
                break;
            case 7:
                Month = "July";
                break;
            case 8:
                Month = "August";
                break;
            case 9:
                Month = "September";
                break;
            case 10:
                Month = "October";
                break;
            case 11:
                Month = "November";
                break;
            case 12:
                Month = "December";
                break;
        }

        return `${Time.getUTCDate()}. ${Month} ${Time.getFullYear()}`;
    }


    closeModal()
    {
        this.setState({
            showNewSessionModal: false,
            showNewTemplateModal: false
        });
    }


    logout()
    {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
    }


    modalContent()
    {
        return (
            <ProjectModalContent>
                <Form
                    autoComplete="off"
                    onSubmit={(e) => this.createProject(e)} >
                    <PopupText>Title</PopupText>
                    <Form.Group
                        controlId="validateTitle" >
                        <InputGroup>
                            <Form.Control
                                autoComplete="off"
                                name="title"
                                onChange={this.handleChange}
                                placeholder="Session title..."
                                required />
                        </InputGroup>
                    </Form.Group>
                    <CancelButton
                        onClick={() => this.closeModal()} >
                        Cancel
                    </CancelButton>
                    <CreateButton
                        type="submit"
                        value="Create Session" />
                </Form>
            </ProjectModalContent>
        );
    }


    modalTemplateContent()
    {
        return (
            <ProjectModalContent>
                <Form
                    autoComplete="off"
                    onSubmit={(e) => this.createProject(e)} >
                    <PopupText>Title</PopupText>
                    <Form.Group
                        controlId="validateTitle" >
                        <InputGroup>
                            <Form.Control
                                autoComplete="off"
                                name="title"
                                onChange={this.handleChange}
                                placeholder="Session title..."
                                required />
                        </InputGroup>
                    </Form.Group>

                    <PopupText>Template</PopupText>
                    <Form.Group
                        controlId="validateTemplate" >
                        <InputGroup>
                            <Form.Control
                                as="select" >
                                <option>Template A</option>
                                <option>Template B</option>
                                <option>Template C</option>
                                <option>Template D</option>
                            </Form.Control>
                        </InputGroup>
                    </Form.Group>
                    <CancelButton
                        onClick={() => this.closeModal()} >
                        Cancel
                    </CancelButton>
                    <CreateButton
                        type="submit"
                        value="Create Template" />
                </Form>
            </ProjectModalContent>
        );
    }


    render()
    {
        return (
            <React.Fragment>
                <MainContainer>
                    <Banner>
                        <BreadCrumb
                            aria-label="Breadcrumb"
                            separator="&#187;" >
                            <BreadText
                                color="initial"
                                href="/" >
                                Coboost
                            </BreadText>
                            <BreadText
                                color="initial"
                                href="/dashboard" >
                                Sessions
                            </BreadText>
                        </BreadCrumb>

                        <BannerDropdown
                            style={{
                            float: "right",
                            position: "relative",
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                            title={<BsJustify />} >
                            <BannerLink
                                onClick={this.logout} >
                                Logout
                            </BannerLink>
                        </BannerDropdown>

                        <BannerDropdown
                            style={{
                            float: "right",
                            position: "relative",
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                            title="New Session" >
                            <BannerLink
                                onClick={this.newProject} >
                                Create Empty Session
                            </BannerLink>
                            <BannerLink
                                disabled
                                onClick={this.newTemplate} >
                                Use Session Template
                            </BannerLink>
                        </BannerDropdown>

                    </Banner>
                    <Header>
                        <HeaderText>
                            Overview
                        </HeaderText>
                    </Header>
                    <CategoryContainer>
                        {this.sessionRender()}
                    </CategoryContainer>
                </MainContainer>
                {this.state.showNewSessionModal &&
                    <PageModal body={this.modalContent()}
                        onClose={this.closeModal}
                        title="New Session" />
                }
                {this.state.showNewTemplateModal &&
                    <PageModal body={this.modalTemplateContent()}
                        onClose={this.closeModal}
                        title="New Template" />
                }
                {this.state.modal.delete &&
                    <PageModal body={this.modal.delete.content()}
                        onClose={this.modal.delete.close.bind(this)}
                        title="Confirm Delete" />
                }
            </React.Fragment>
        );
    }
}