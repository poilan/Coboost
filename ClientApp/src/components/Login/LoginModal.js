import {Component} from "react";
import {Modal, Backdrop, Fade, Divider, makeStyles, Button, TextField, Link, Checkbox, Typography} from "@material-ui/core";
import Axios from "axios";


/**
 * Material-UI Styling/CSS classes
 */
const UseStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: "10px",
        border: "2px solid #555",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: "25ch"
        }
    }
}));

/**
 * Pop-up Login Modal
 * Required props:
 *      open => Boolean that decides if the modal is visible
 *      onClose => function that closes modal
 */
export class LoginModal extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            showing: true,
            tab: "login",

            /**
             * Log in data
             */
            login: {
                email: "",
                password: ""
            },
            /**
             * Register data
             */
            register: {
                email: "",
                firstName: "",
                lastName: "",
                company: "",
                phone: "",
                password: "",
                repeatPassword: ""
            },
            validate: {
                code: "",
            }
        };
        this.classes = UseStyles();
    }


    /* Set Region */


    /**
     * Handles the input field,
     * each field in the form needs a name that matches the state variable name
     * @param {Event} e the event form the input field
     */
    handleChange = (e) => {
        const Tab = this.state.tab;
        const Name = e.target.name;
        const Value = e.target.Value;

        const Data = this.state[Tab];
        Data[Name] = Value;

        this.setState({
            [Tab]: Data
        });
    }


    /**
     * Changes the active tab
     * @param {string} key the name of the new active tab
     */
    handleTab = (key) => {
        this.setState({
            tab: key
        });
    }


    /* Get Region */


    GetTitle = () => {
        if (this.state.tab === "login")
            return "Log In";
        else if (this.state.tab === "register")
            return "Sign Up";
        else
            return "Email Confirmation";
    }


    submit = {
        /**
         * Prevents form refresh & Calls "request.login" with "state.login"
         * @param {Event} e form event
         * @returns {boolean} Successfully logged in? TODO: Not what this returns?
         */
        login: (e) => {
            e.preventDefault();
            if (!e.currentTarget.checkValidity())
                e.stopPropagation();

            const Data = this.state.login;

            //TODO: Axios Login
        },
        /**
         * Prevents form refresh & Calls "request.register" with "state.register"
         * @param {Event} e
         * @returns {boolean} Successfully registered? TODO: Not what this returns?
         */
        register: (e) => {
            e.preventDefault();
            if (!e.currentTarget.checkValidity())
                e.stopPropagation();

            const Data = this.state.register;

            //TODO: Axios Register
        },
        validate: (e) => {
            e.preventDefault();
            if (!e.currentTarget.checkValidity())
                e.stopPropagation();
        }
    }


    server = {
        /**
         * Sends the Login information to the server
         * Returns true on success, false otherwise
         * @param {} data login Information
         * @returns {boolean}
         */
        login: async (data) => {
            await Axios.post(`user/login`, data).then(() => {
                localStorage.setItem("user", data.email);
                this.props.history.push("/"); //TODO: Move this line and the one above to another method
                return true;
            }, () => {
                alert("Wrong username or password");
                return false;
            });
        },
        /**
         * Sends the registration information to the server
         * returns true if accepted, false otherwise
         * @param {} data Registration Information
         * @returns {}
         */
        register: async (data) => {
            await Axios.post(`user/register`, data).then(() => {
                this.handleTab("validate"); //TODO: Move this line to another method inside an if statement
                alert("Account Created! It will be available as soon as you confirm your email.");
                return true;
            }, error => {
                if (error.response.status === 406)
                {
                    alert("Please verify your email address, and make sure your password is 8 or more characters");

                    //User didn't write in a correct email address
                    //or password was too short (needs to be 8 or more characters)
                }
                else if (error.response.status === 409)
                {
                    alert("That email is already linked to an account!");

                    //That email is already in use
                }

                return false;
            });
        }
    }


    forgotPassword = () => { }


    /* Render Region */


    forms = {
        /**
         * JSX form for user log in
         * @returns {JSX}
         */
        login: () => {
            return(
                <form
                    className={this.classes.root}
                    onSubmit={this.submit.login} >
                    <TextField
                        autoComplete="username"
                        id="login-email"
                        InputLabelProps={{ required: false }}
                        label="Email"
                        name="email"
                        onChange={this.handleChange}
                        required
                        type="email" />
                    <TextField
                        autoComplete="current-password"
                        id="login-password"
                        InputLabelProps={{ required: false }}
                        label="Password"
                        name="password"
                        onChange={this.handleChange}
                        required
                        type="password" />

                    <Button
                        id="login-submit"
                        type="submit"
                        variant="contained" >
                        Log In
                    </Button>

                    { //TODO: Create fully functioning Password Reset, then uncomment this
                        //    <Button
                        //    id="login-forgot-password"
                        //    onClick={this.forgotPassword} >
                        //    Forgot Password?
                        //</Button>
                    }
                </form>
            );
        },
        /**
         * JSX form for registering new user
         * @returns {JSX}
         */
        register: () => {
            return(
                <form
                    className={this.classes.root}
                    onSubmit={this.submit.register} >

                    { /* Email */
                    }
                    <TextField
                        autoComplete="email"
                        id="register-email"
                        label="Email"
                        name="email"
                        onChange={this.handleChange}
                        required
                        type="email" />

                    { /* First & Last Name */
                    }
                    <TextField
                        autoComplete="given-name"
                        id="register-firstName"
                        label="First Name"
                        name="firstName"
                        onChange={this.handleChange}
                        type="text" />
                    <TextField
                        autoComplete="family-name"
                        id="register-lastName"
                        label="Last Name"
                        name="lastName"
                        onChange={this.handleChange}
                        type="text" />

                    { /* Phone Number */
                    }
                    <TextField
                        autoComplete="tel-national"
                        id="register-phone"
                        label="Phone Number"
                        name="phone"
                        onChange={this.handleChange}
                        type="tel" />

                    { /* Company */
                    }
                    <TextField
                        autoComplete="organization"
                        id="register-company"
                        label="Company Name"
                        name="company"
                        onChange={this.handleChange}
                        type="text" />

                    { /* Password + Repeat Password*/
                    }
                    <TextField
                        autoComplete="new-password"
                        id="register-password"
                        label="Password"
                        name="password"
                        onChange={this.handleChange}
                        required
                        type="password" />
                    <TextField
                        autoComplete="new-password"
                        id="register-repeat-password"
                        label="Repeat Password"
                        name="repeatPassword"
                        onChange={this.handleChange}
                        required
                        type="password" />

                    { /* Checkbox to confirm Email
                     * TODO: Create Link to Full Agreement, in New Tab!
                      * */
                    }
                    <div>
                        <Checkbox
                            id="register-beta-agreement"
                            name="agreement"
                            onchange={this.handleChange}
                            value={this.state.register.agreement} />
                        <Typography
                            id="register-beta-text" >
                            I accept the terms a beta tester
                        </Typography>
                    </div>

                    { /* Submit button */
                    }
                    <Button
                        id="register-submit"
                        type="submit"
                        variant="contained" >
                        Sign Up
                    </Button>
                </form>
            );
        },
        validate: () => {
            return(
                <form
                    className={this.classes.root}
                    onSubmit={this.submit.validate} >

                    <Typography
                        variant="h2" >
                        Account Registered!
                    </Typography>
                    <Typography
                        variant="body1" >
                        Now we just have to confirm your email, please enter the code that we sent to your email below.
                    </Typography>

                    <TextField
                        autoComplete="one-time-code"
                        id="validate-code"
                        label="Email Code"
                        name="code"
                        inputProps={{min: 100000, max: 999999}}
                        onChange={this.handleChange}
                        required
                        type="number" />

                    <Button
                        id="validate-submit"
                        type="submit"
                        variant="contained" >
                        Confirm
                    </Button>
                </form>
            );
        }
    }


    /**
     * Main Render Method
     * Contains Modal, transition, tabs and Modal-Header
     */
    render()
    {
        return(
            <Modal
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
                className={this.classes.modal}
                closeAfterTransition
                onClose={this.props.onClose}
                open={this.props.open} >

                <Fade /* Fade in Transition */
                    in={this.props.open} >
                    <div
                        className={this.classes.paper} >

                        {
                            /* Modal Head */
                            <h2>
                                {this.state.tab !== "register" ?
                                     "Log In" :
                                     "Sign Up"}
                            </h2>
                        }
                        <Divider />

                        {
                            /* Modal Tabs */
                            <div>
                                <Button
                                    id="loginButton"
                                    onClick={this.handleTab("login")}
                                    type="button" >
                                    Log In
                                </Button>
                                <Button
                                    id="registerButton"
                                    onClick={this.handleTab("register")}
                                    type="button" >
                                    Sign Up
                                </Button>
                            </div>
                        }
                        <Divider />


                        {
                            /* Modal Body */
                            <div>
                                {this.forms[this.state.tab]}
                            </div>
                        }
                    </div>
                </Fade>
            </Modal>
        );
    }
};