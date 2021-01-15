import React, {Component} from "react";
import Axios from "axios";
import {PageModal} from "../Services/PageModal";
import {Modal, InputGroup, Form, Dropdown, DropdownButton, Nav, Col} from "react-bootstrap";
import Styled from "styled-components";
import "circular-std";
import {Ico_Box} from "../Classes/Icons";
import {Breadcrumbs, Link, Typography} from "@material-ui/core";
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
    background: #374785;
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
    border-bottom: 4px solid #374785;
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

export class Beta extends React.Component {


    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/");
    }


    agreement() {
        return (
            <div>
                <Typography variant="h1" >BETA TEST AGREEMENT</Typography>

                <Typography variant="h3" >Scope of this Agreement</Typography>
                <Typography variant="p" >The Software-Product accompanying this agreement as a pre-release copy and all affiliated materials is copyrighted. Scope of this agreement is the licensing (not selling) of the “Product” to You, as the ‘user’ (either an individual or an entity). Coboost reserves all rights not expressly granted</Typography>

                <Typography variant="h3" >Copyrights and Ownership</Typography>
                <Typography variant="p" >Ownership and Copyright of Software Title to the software and all copies thereof remain with Coboost. The software is copyrighted and is protected by copyright laws and international treaty provisions. Licensee will not remove copyright notices from the Software. Licensee agrees to prevent any unauthorized copying of the Software</Typography>

                <Typography variant="h3" >License and Acceptable Use</Typography>
                <Typography variant="p" >Limited License. You are entitled to access the Coboost software for the purposes of performing your obligations under this agreement. You may not sell, license, or share the software to other parties in any way. You may only access the software through the email address provided on sign-up.</Typography>

                <Typography variant="h3" >Disclaimer of Liability and Warranties</Typography>
                <Typography variant="p" >Limitation on liability provision of the software under this agreement is experimental and shall not create any obligation for Coboost to continue to develop, productize, support, repair, offer for sale or in any other way continue to provide or develop software either to licensee or to any other party. The software is provided “as is” without any express or implied warranty of any kind. Coboost disclaims any liability for data loss, damages, or loss of profits incurred using the Beta software.</Typography>

                <Typography variant="h3" >Term and Termination</Typography>
                <Typography variant="p" >Licensee’s rights with respect to the Beta software will terminate upon the earlier of (a) the initial commercial release by Coboost of a generally available version of the Beta software or (b) automatic expiration of the Beta software based on the system date. Either party may terminate this agreement at any time for any reason or no reason by providing the other party advance written notice thereof. Coboost shall immediately terminate this agreement and any Licensee rights with respect to the beta software without notice in the event of improper disclosure of Coboost’s Beta software. Upon any expiration or termination of this agreement, the rights and licenses granted to Licensee under this agreement shall immediately terminate, and licensee shall immediately cease using, and will return to Coboost, the Beta software, documentation, and all other tangible items in licensee’s possession or control that are proprietary to or contain Confidential Information.</Typography>

                <Typography variant="h3" >Beta testers feedback</Typography>
                <Typography variant="p" >Beta Tester agrees to report any flaws, errors or imperfections discovered in any software or other materials where Beta Tester has been granted access to the Beta Test. Beta Tester understands that prompt and accurate reporting is the purpose of the Beta Tests and undertakes to use best efforts to provide frequent reports on all aspects of the product both positive and negative and acknowledges that any improvements, modifications and changes arising from or in connection with the Beta Testers contribution to the Project, remain or become the exclusive property of the Disclosing Party.</Typography>

                <Typography variant="h3" >Confidentiality</Typography>
                <Typography variant="p" >The Beta Tester will not disclose software or any comments regarding software to any third party without the prior written approval of Coboost. The Tester will maintain the confidentiality of software with at least the same degree of care that you use to protect your own confidential and proprietary information, but not less than a reasonable degree of care under the circumstances. The Tester will not be liable for the disclosure of any confidential information which is in the public domain other than by a breach of this agreement on Tester’s part or rightfully received or made available to a third party without any obligation of confidentiality.</Typography>

                <Typography variant="h3" >Support</Typography>
                <Typography variant="p" >During your participation in the Beta testing Coboost is not obligated to provide you with any maintenance, technical or other support for the Pre-Release Software. You agree to abide by any support rules and policies that Coboost provides to you in order to receive such support. You acknowledge that Coboost has no express or implied obligation to announce or make available a commercial version of the pre-release software to anyone in the future. Should a commercial version be made available, it may have features or functionality that are different from those found in the pre-release doftware licensed hereunder.</Typography>

                <Typography variant="h3" >Privacy policy</Typography>
                <Typography variant="p" >You acknowledge and agree that by participating in the testing of the Beta software, Coboost may receive certain information about you, including personally identifiable information. and you hereby consent to Coboost’s collection, use and disclosure such information in accordance with the Privacy Policy.</Typography>

                <Typography variant="h3" >Fees and Costs</Typography>
                <Typography variant="p" >There are no license fees for licensee’s use of the Beta software under this agreement. Licensee is responsible for all costs and expenses associated with the use of the Beta software and the performance of all testing and evaluation activities.</Typography>

                <Typography variant="h3" >Modification</Typography>
                <Typography variant="p" >This is the entire agreement between the parties relating to the subject matter hereof and all other terms are rejected. No waiver or modification of this agreement shall be valid unless in writing signed by each party.</Typography>

                <Typography variant="h3" >No Assignment</Typography>
                <Typography variant="p" >This agreement is personal to Tester. Tester shall not assign or otherwise transfer any rights or obligations under this agreement.</Typography>

                <Typography variant="h3" >Severability</Typography>
                <Typography variant="p" >If any provision of this agreement shall be found by a court to be void, invalid or unenforceable, the same shall be reformed to comply with applicable law or stricken if not so conformable, so as not to affect the validity or enforceability of this agreement.</Typography>
            </div>
        );
    }


    render() {
        return (
            <React.Fragment>
                <MainContainer>
                    <Banner>
                        <BreadCrumb aria-label="Breadcrumb"
                                    separator="&#187;" >
                            <BreadText color="initial"
                                       href="/" >
                                Coboost
                            </BreadText>
                        </BreadCrumb>

                        <BannerDropdown style={{
                            float: "right",
                            position: "relative",
                            top: "50%",
                            transform: "translateY(-50%)"
                        }}
                                        title={<BsJustify />} >
                            <BannerLink onClick={this.logout} >
                                Logout
                            </BannerLink>
                        </BannerDropdown>


                    </Banner>
                    <Header>
                        <HeaderText>
                            Overview
                        </HeaderText>
                    </Header>
                    <CategoryContainer>
                        {this.agreement()}
                    </CategoryContainer>
                </MainContainer>
            </React.Fragment>
        );
    }
}