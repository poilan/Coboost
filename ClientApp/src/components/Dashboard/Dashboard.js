import React, { Component } from 'react';
import axios from 'axios';
import { PageModal } from '../Services/PageModal';
import { Modal, InputGroup, Form, Dropdown, DropdownButton, Nav, Col } from 'react-bootstrap';
import styled from 'styled-components';
import "circular-std";
import { Ico_Box } from '../Classes/Icons';

const MainContainer = styled(Col)`
    display: table;
    height: 100%;
    width: 100%;
    background: #E4E4E4;
    position: absolute;
    padding: 0px;
`;

const Banner = styled(Col)`
    position: sticky;
    background: #424355;
    height: 75px;
    top: 0;
    left: 0;
    z-index: 11;
    padding-right: 15%;
`;

const BannerText = styled.h1`
    font-family: CircularStd;
    font-Size: 2rem;
    color: #fff;
    padding: 25px 5px;
    position: absolute;
`;

const BannerButton = styled(Nav.Link)`
    background: #fff;
    font-family: CircularStd;
    border-radius: 100px;
    color: #100E0E;
    font-weight: 450;
    text-align: center;
    position: relative;
    top: 25%;
    float: right;

    padding: 6px 20px;
`;

const BannerDropButton = styled(DropdownButton)`
    background: #fff;
    border-radius: 100px;
    color: #100E0E;

    font-family: CircularStd;
    font-weight: 450;
    text-align: center;
    padding-left: 20px;
    padding-right: 20px;
    top: 25%;
    position: relative;
    float: right;

    margin: 0px 5px;

    button {
        background: none;
        border: none;

        font-family: CircularStd;
        font-weight: 450;

        color: #100E0E;
    };

    button:hover {
        background: none;
        border: none;

        color: #4C7AD3;
    };

    &.show {
        button {
            outline: none;
            background: none !important;
            border: none;
            color: #4C7AD3 !important;
        };
    }

    button:active {
        color: red;
    }
`;

const Header = styled(Col)`
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

const HeaderText = styled.h1`
    font-family: CircularStd;
    font-weight: 425;
    text-align: center;
    font-size: 1rem;

    padding: 10px 35px;
    border-bottom: 4px solid #4C7AD3;
    cursor: pointer;

    flex: 1 1 auto;
    margin: 5px;
    margin-bottom: 0px;
`;

const ProjectContainer = styled(Col)`
    position: absolute;
    background: #E4E4E4;
    min-height: calc(100vh - 130px);
    left: 0;
    top: 130px;
`;

const ProjectText = styled.h1`
    position: absolute;
    width: 95%;
    text-align: center;
    top: 30%;
    font-family: CircularStd;
    font-size: 2rem;
    font-weight: 400;
`;

const ProjectButton = styled(BannerButton)`
    color: #fff;
    background: #4C7AD3;
    top: 40%;
    left: 45%;
`;

const CategoryContainer = styled(Col)`
    position: absolute;
    background: #E4E4E4;
    top: 125px;
    width: 100%;
    left: 0:
`;

const Category = styled.div`
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

const CategoryTitle = styled.h3`
    font-size: 15px;
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

const CategoryIdentity = styled(CategoryTitle)`
    color: #A4A4A4;
`;

const CategoryTime = styled(CategoryIdentity)`
    float: right;
    text-align: right;
`;

const CategorySettings = styled(CategoryTitle)`
    float: right;
    text-align: right;
    margin-right: 3%;
`;

const ProjectModal = styled.div`
    position: fixed;
    z-index: 1;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
`;

const ProjectModalContent = styled.div`
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
`;

const PopupText = styled.h3`
    font-family: CircularStd;
    font-size: 0.8rem;
    padding: 10px;
    color: #100e0e;
    opacity: 50%;
`;

const CancelButton = styled(Nav.Link)`
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

const CreateButton = styled.input`
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

const ModalText = styled.h1`
    font-family: CircularStd;
    font-weight: 600;
    font-size: 1em;
    position: relative;
    margin-bottom: 20px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
`;

const RemoveButton = styled(Ico_Box)`
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

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            showModal: false,
            title: '',

            modal: {
                delete: false,
                code: 0,
            }
        }
        this.createProject = this.createProject.bind(this);
        this.newProject = this.newProject.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sessionClick = this.sessionClick.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount() {
        this.getSessions();
    }

    modal = {
        delete: {
            open: (e, identity) => {
                e.stopPropagation();
                this.setState({
                    modal: {
                        delete: true,
                        code: identity,
                    }
                });
            },

            content: () => {
                const deleteSession = (e) => {
                    e.preventDefault();

                    axios.post(`admin/delete-${this.state.modal.code}`).then(this.getSessions());
                    this.modal.delete.close();
                }

                return (
                    <Form autoComplete="off" onSubmit={(e) => deleteSession(e)}>
                        <ModalText>Are you sure you want to delete this session? <br /> This action can not be undone</ModalText>
                        <CancelButton onClick={() => this.modal.delete.close()}>Cancel</CancelButton>
                        <CreateButton type="submit" value="Delete Session" />
                    </Form>
                );
            },

            close: () => {
                this.setState({
                    modal: {
                        delete: false,
                        code: 0,
                    }
                });
            }
        }
    }

    async getSessions() {
        const compare = (A, B) => {
            const a = new Date(Date.parse(A.lastOpen));
            const b = new Date(Date.parse(B.lastOpen));

            return b.getTime() - a.getTime();
        }

        let email = localStorage.getItem("user");
        await axios.get(`admin/sessions-${email}`).then((response) => {
            let data = response.data.sort(compare);

            this.setState({ sessions: data });
        });
    }

    newProject() {
        this.setState({
            showModal: true,
        });
    }

    createProject(event) {
        event.preventDefault();
        this.closeModal();

        let data = {
            Title: this.state.title,
            Email: localStorage.getItem('user'),
            Slides: '{}',
            Settings: '{}',
            Questions: '{}',
        }

        axios.post(`admin/create`, data).then(res => {
            if (res.status === 202) {
                //Created Session
                this.getSessions();
            }
            else if (res.status === 406) {
                //Title can't be empty!
            }
        });

        this.setState({ title: '' });
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;

        this.setState({
            [name]: value,
        });
    }

    sessionClick(e) {
        axios.post(`admin/load-${e.id}`).then(res => {
            if (res.status === 200) {
                //Session already active?
                sessionStorage.setItem("code", e.id);
                sessionStorage.setItem("title", e.getAttribute('name'));
                this.props.history.push('/administrator');
            }
            else if (res.status === 201) {
                //Session Created!
                sessionStorage.setItem("code", e.id);
                sessionStorage.setItem("title", e.getAttribute('name'));
                this.props.history.push('/administrator');
            }
            else if (res.status === 404) {
                //Session not found
            }
            else {
                //Unknown error
            }
        })
    }

    sessionRender() {
        if (this.state.sessions && this.state.sessions.length) {
            return (
                this.state.sessions.map(session =>
                    <Category id={session.identity} name={session.title} key={session.identity} index={session.identity} onClick={((e) => this.sessionClick(e.target))}>
                        <CategoryTitle id={session.identity} name={session.title} key={session.identity} index={session.identity}>{session.title}</CategoryTitle>
                        <CategoryIdentity id={session.identity} name={session.title} key={session.identity} index={session.identity}>#{session.identity}</CategoryIdentity>
                        <RemoveButton onClick={(e) => this.modal.delete.open(e, session.identity)} />
                        <CategoryTime id={session.identity} name={session.title} key={session.identity} index={session.identity}>{this.displayDate(session.lastOpen)}</CategoryTime>
                    </Category>)
            );
        } else {
            return (
                <ProjectContainer>
                    <ProjectText>We didn't find any projects here, create your first now!</ProjectText>
                    <ProjectButton onClick={this.newProject}>New Session</ProjectButton>
                </ProjectContainer>
            );
        }
    }

    displayDate(dateTime) {
        var date = new Date(Date.parse(dateTime));
        var month = '';
        switch (date.getMonth() + 1) {
            case 1:
                month = 'January';
                break;
            case 2:
                month = 'Febuary';
                break;
            case 3:
                month = 'March';
                break;
            case 4:
                month = 'April';
                break;
            case 5:
                month = 'May';
                break;
            case 6:
                month = 'June';
                break;
            case 7:
                month = 'July';
                break;
            case 8:
                month = 'August';
                break;
            case 9:
                month = 'September';
                break;
            case 10:
                month = 'October';
                break;
            case 11:
                month = 'November';
                break;
            case 12:
                month = 'December'
                break;
        }

        return `${date.getUTCDate()}. ${month} ${date.getFullYear()}`;
    }

    closeModal() {
        this.setState({ showModal: false });
    }

    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
    }

    modalContent() {
        return (
            <ProjectModalContent>
                <Form autoComplete="on" onSubmit={(e) => this.createProject(e)}>
                    <PopupText>Title</PopupText>
                    <Form.Group controlId="validateTitle">
                        <InputGroup>
                            <Form.Control name="title" onChange={this.handleChange} placeholder="Session title..." required />
                        </InputGroup>
                    </Form.Group>
                    <CancelButton onClick={() => this.closeModal()}>Cancel</CancelButton>
                    <CreateButton type="submit" value="Create Session" />
                </Form>
            </ProjectModalContent>
        );
    }

    render() {
        return (
            <>
                <MainContainer>
                    <Banner>
                        <BannerText>Coboost</BannerText>
                        <BannerDropButton title="User">
                            <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                        </BannerDropButton>
                        <BannerButton onClick={this.newProject}>New Session</BannerButton>
                    </Banner>
                    <Header>
                        <HeaderText>Overview</HeaderText>
                    </Header>
                    <CategoryContainer>
                        {this.sessionRender()}
                    </CategoryContainer>
                </MainContainer>
                {this.state.showModal && <PageModal title="New Session" body={this.modalContent()} onClose={this.closeModal} />}
                {this.state.modal.delete && <PageModal title="Confirm Delete" body={this.modal.delete.content()} onClose={this.modal.delete.close.bind(this)} />}
            </>
        );
    }
}