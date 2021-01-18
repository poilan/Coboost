import {Backdrop, Button, Checkbox, CircularProgress, createStyles, Fade, Modal, TextField, Typography, withStyles} from "@material-ui/core";
import Axios from "axios";
import React, {Component} from "react";


/**
 * Material-UI Styling/CSS classes
 */

const UseStyles = (theme) => createStyles({
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
        padding: theme.spacing(6.5, 4, 3),
        position: "relative"
    },
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: "25ch"
        }
    },
    input: {
        display: "inline-block",
        width: "300px !important"
    },
    wideInput: {
        display: "inline-block",
        width: "616px !important"
    },
    button: {
        marginTop: "16px",
        display: "block",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        backgroundColor: "#4C7AD3",
        color: "#fff",
        outline: "none !important"
    },
    forgot: {
        color: "#4C7AD3",
        margin: "8px",
        float: "right"
    },
    tab: {
        width: "50%",
        borderRadius: "0",
        height: "52px",
        position: "absolute",
        top: "0",
        outline: "none !important"

    },
    backdrop: {
        zIndex: theme.zIndex.modal + 1,
        color: "#fff"
    }
});

/**
 * Pop-up Login Modal
 * Required props:
 *      open => Boolean that decides if the modal is visible
 *      onClose => function that closes modal
 */
class LoginModal extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            working: false,
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
                repeatPassword: "",
                agreement: false
            },
            forgot: {
                email: "",
                password: "",
                repeatPassword: ""
            }
        };
    }


    /**
     * Handles the input field,
     * each field in the form needs a name that matches the state variable name
     * @param {Event} e the event form the input field
     */
    handleChange = (e) => {
        const Tab = this.state.tab;
        const Name = e.target.name;
        const Value = e.target.value;

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



    /**
     * This is where all of our "form - onSubmit" functions are stored.
     * They check the data, before sending the request to this.server
     * It Is also where we set "state.working" to true and false.
     * If the server function returns true, this modal will then close.
     */
    handleSubmit = {
        /**
         * Prevents form refresh & Calls "server.login" with "state.login"
         * @param {Event} e form event
         * @returns {boolean} logged in === true
         */
        login: async (e) => {
            e.preventDefault();
            if (!e.currentTarget.checkValidity())
                e.stopPropagation();

            this.setState({ working: true }); //This makes the user know work is being done, should always be set to false at end of what made it true!

            const Data = this.state.login;

            //Axios Login
            if (await this.server.login(Data))
            {
                this.setState({ working: false });
                this.props.onClose();
                return true;
            }
            else
            {
                this.setState({ working: false });
                return false;
            }
        },
        /**
         * Prevents form refresh && checks form validity && Calls "server.register" with "state.register"
         * @param {Event} e form event
         * @returns {boolean} Account Confirmation Email === Sent
         */
        register: async (e) => {
            e.preventDefault();
            if (!e.currentTarget.checkValidity())
                e.stopPropagation();

            if (this.state.register.password !== this.state.register.repeatPassword)
            {
                const Register = this.state.register;
                Register.password = "";
                Register.repeatPassword = "";
                this.setState({ register: Register });
                alert("Passwords did not match!");
                return false;
            }
            this.setState({ working: true }); //This makes the user know work is being done, should always be set to false at end of what made it true!

            const Data = {
                Email: this.state.register.email,
                FirstName: this.state.register.firstName,
                LastName: this.state.register.lastName,
                Password: this.state.register.password,
                PhoneNumber: this.state.register.phone,
                Company: this.state.register.company
            };

            //Axios Register
            if (await this.server.register(Data))
            {
                this.setState({ working: false });
                this.props.onClose();
                return true;
            }
            else
            {
                this.setState({ working: false });
                return false;
            }
        },
        /**
         * Prevents form refresh && checks form validity && calls "server.forgot" with "state.forgot"
         * @param {Event} e form event
         * @returns {boolean} (Password Change Email === Sent)
         * (Shitty name, i know. ATM this takes the new password RIGHT NOW, stores it in hashed form, but doesn't replace the old one before the link sent to your email is accessed.)
         */
        forgot: async (e) => {
            e.preventDefault();
            if (!e.currentTarget.checkValidity())
                e.stopPropagation();

            if (this.state.forgot.password !== this.state.forgot.repeatPassword)
            {
                const Forgot = this.state.forgot;
                Forgot.password = "";
                Forgot.repeatPassword = "";
                this.setState({ forgot: Forgot });
                alert("Passwords did not match!");
                return false;
            }

            this.setState({ working: true }); //This makes the user know work is being done, should always be set to false at end of what made it true!

            const Data = {
                Email: this.state.forgot.email,
                Password: this.state.forgot.password
            };

            //Axios Forgot Password
            if (await this.server.forgot(Data))
            {
                this.setState({ working: false });
                this.props.onClose();
                return true;
            }
            else
            {
                this.setState({ working: false });
                return false;
            }
        }
    }


    /**
     * This is where we have all our HttpRequests to the Server.
     * contains: .login, .register & .forgot.
     * They return false, if server fails. And Also uses alert() to inform the user of their next step.
     */
    server = {
        /**
         * Sends the Login information to the server
         * Returns true on success, false otherwise
         * @param {} data login Information
         * @returns {boolean}
         */
        login: async (data) => {
            let result = false;
            await Axios.post(`user/login`, data).then(() => {
                localStorage.setItem("user", data.email);
                result = true;
            }, (error) => {
                if (error.response.status === 409)
                    alert("You have to confirm your email! We (re)sent you a link to your email, your account won't be available before you click it!");
                else
                    alert("Wrong username or password");

                result = false;
            });

            return result;
        },
        /**
         * Sends the registration information to the server
         * returns true if accepted, false otherwise
         * @param {} data Registration Information
         * @returns {boolean}
         */
        register: async (data) => {
            let result = false;
            await Axios.post(`user/register`, data).then(() => {
                alert("Account Created! We just have to confirm your email! \n" +
                    "We sent you an email, simply click the link in there and your account will be activated! \n" +
                    "If you can't find it, check your spam folder, etc. etc. \n" +
                    "Also, we will send another one if you attempt to log into it without confirming your email.");
                result = true;
            }, error => {
                if (error.response.status === 406)
                {
                    alert("Well..... this is embarrassing... that information is invalid..?\n" +
                        "I don't know how you did it, but the fields should prevent you from doing it.\n" +
                        " Alright.... lets take it slow: In the Email Field write an EMAIL, YOUR EMAIL... ahem.. sorry.. \n" +
                        "Then your password needs to be 8 or more, characters long. Now this next bit might be how you got this error. \n" +
                        "Ready? you can only use LETTERS and NUMBERS and SYMBOLS and LITERALLY ANYTHING THAT IS POSSIBLE TO WRITE ON THE KEYBOARD! \n" +
                        "Ok... ok... I am calm... \n" +
                        "I just don't get how you got here, unless you are viciously and cruelly FORCING poor defenseless code to do your twisted and fucked up bidding! \n" +
                        "YOU MONSTER!");

                    //User didn't write in a correct email address
                    //or password was too short (needs to be 8 or more characters)
                }
                else if (error.response.status === 409)
                {
                    alert("That email is already linked to an account!");

                    //That email is already in use
                }

                result = false;
            });
            return result;
        },
        /**
         * Sends the Password Recovery Request to the Server.
         * The User receives an Email on success, and the password doesn't change before they click the link there. TODO: Have them write the new password AFTER clicking the link
         * @param {} data The User Data sent to the server.
         * @returns {boolean} dependent on the servers success.
         */
        forgot: async (data) => {
            let result = false;

            await Axios.post(`user/start-recovery`, data).then(() => {
                alert("Thank you! We sent you a mail. Please click on the link in the mail to confirm changes.");
                result = true;
            }, error => {
                if (error.response.status === 406)
                {
                    alert("Well..... this is embarrassing... that information is invalid..?\n" +
                        "I don't know how you did it, but the fields should prevent you from doing it.\n" +
                        " Alright.... lets take it slow: In the Email Field write an EMAIL, YOUR EMAIL... ahem.. sorry.. \n" +
                        "Then your password needs to be 8 or more, characters long. Now this next bit might be how you got this error. \n" +
                        "Ready? you can ONLY use LETTERS and NUMBERS and SYMBOLS and LITERALLY ANYTHING THAT IS POSSIBLE TO WRITE ON THE KEYBOARD! \n" +
                        "Ok... ok... I am calm... \n" +
                        "I just don't get how you got here, unless you are viciously and cruelly FORCING poor defenseless code to do your twisted and fucked up bidding! \n" +
                        "YOU MONSTER! If you didn't do this on purpose however, It'd be great if you could inform my owners about it. \n");

                    //User didn't write in a correct email address
                    //or password was too short (needs to be 8 or more characters)
                }
                else if (error.response.status === 404)
                {
                    alert("I have never heard of that person before. \n" +
                        "Email doesn't look familiar either.");

                    //That email is already in use
                }

                result = false;
            });
            return result;
        }
    }


    /**
     * Where all of this class JSX forms are located. The Forms are:
     * .login, .register & .forgot
     */
    forms = {
        /**
         * JSX form for user log in
         * @returns {JSX}
         */
        login: () => {
            const Classes = this.props.classes;
            return(
                <form
                    className={Classes.root}
                    onSubmit={this.handleSubmit.login} >

                    <TextField
                        autoComplete="username"
                        className={Classes.input}
                        fullWidth
                        id="login-email"
                        InputLabelProps={{ required: false }}
                        label="Email"
                        name="email"
                        onChange={this.handleChange}
                        required
                        type="email"
                        value={this.state.login.email} />
                    <br />

                    <TextField
                        autoComplete="off"
                        className={Classes.input}
                        fullWidth
                        id="login-password"
                        InputLabelProps={{ required: false }}
                        label="Password"
                        name="password"
                        onChange={this.handleChange}
                        required
                        type="password"
                        value={this.state.login.password} />
                    <br />


                    <Button
                        className={Classes.forgot}
                        id="login-forgot-password"
                        onClick={() => this.handleTab("forgot")}
                        size="small"
                        variant="text" >
                        Forgot Password?
                    </Button>

                    <br />

                    <Button
                        className={Classes.button}
                        id="login-submit"
                        type="submit"
                        variant="contained" >
                        Log In
                    </Button>
                </form>
            );
        },
        /**
         * JSX form for registering new user
         * @returns {JSX}
         */
        register: () => {
            const Classes = this.props.classes;
            return(
                <form
                    className={Classes.root}
                    onSubmit={this.handleSubmit.register} >

                    { /* Email */
                    }
                    <TextField
                        autoComplete="email"
                        className={Classes.input}
                        fullWidth
                        id="register-email"
                        label="Email"
                        name="email"
                        onChange={this.handleChange}
                        required
                        type="email"
                        value={this.state.register.email} />
                    <br />

                    { /* Password + Repeat Password*/
                    }
                    <TextField
                        autoComplete="off"
                        className={Classes.input}
                        fullWidth
                        id="register-password"
                        inputProps={{ minLength: "8" }}
                        label="Password"
                        name="password"
                        onChange={this.handleChange}
                        required
                        type="password"
                        value={this.state.register.password} />
                    <br />
                    <TextField
                        autoComplete="off"
                        className={Classes.input}
                        fullWidth
                        id="register-repeat-password"
                        inputProps={{ minLength: "8" }}
                        label="Repeat Password"
                        name="repeatPassword"
                        onChange={this.handleChange}
                        required
                        type="password"
                        value={this.state.register.repeatPassword} />

                    <br />
                    { /* First & Last Name */
                    }
                    <TextField
                        autoComplete="given-name"
                        className={Classes.input}
                        fullWidth
                        id="register-firstName"
                        label="First Name"
                        name="firstName"
                        onChange={this.handleChange}
                        type="text"
                        value={this.state.register.firstName} />
                    <br />
                    <TextField
                        autoComplete="family-name"
                        className={Classes.input}
                        fullWidth
                        id="register-lastName"
                        label="Last Name"
                        name="lastName"
                        onChange={this.handleChange}
                        type="text"
                        value={this.state.register.lastName} />

                    { /* Phone Number */
                    }
                    <br />
                    <TextField
                        autoComplete="tel-national"
                        className={Classes.input}
                        fullWidth
                        id="register-phone"
                        label="Phone Number"
                        name="phone"
                        onChange={this.handleChange}
                        type="tel"
                        value={this.state.register.phone} />

                    { /* Company */
                    }
                    <br />
                    <TextField
                        autoComplete="organization"
                        className={Classes.input}
                        fullWidth
                        id="register-company"
                        label="Company Name"
                        name="company"
                        onChange={this.handleChange}
                        type="text"
                        value={this.state.register.company} />


                    { /* Checkbox to confirm Email
                     * TODO: Create Link to Full Agreement, in New Tab!
                      * */
                    }
                    <div
                        style={{ marginTop: "16px" }} >
                        <Checkbox
                            id="register-beta-agreement"
                            name="agreement"
                            onchange={this.handleChange}
                            required
                            value={this.state.register.agreement} />
                        <Typography
                            component="label"
                            id="register-beta-text"
                            style={{ transform: "translateY(50%)" }} >
                            I agree and consent to the
                            <br />
                            <a
                                href="/beta"
                                target="_blank">
                                Beta Participation Agreement
                            </a>
                        </Typography>
                    </div>
                    <br />
                    { /* Submit button */
                    }
                    <Button
                        className={Classes.button}
                        id="register-submit"
                        type="submit"
                        variant="contained" >
                        Sign Up
                    </Button>
                </form>
            );
        },
        /**
         * JSX form for changing password.
         * TODO: Right now, you "change password" then have to click the link in your email to confirm it.
         * TODO: (Should be the other way because clicking the link, immediately confirms the password change that someone else might have requested)         *
         * TODO: Security In Prototype 1 is so laughable that it is either done like this, or one could be able to bypass the Email Entirely
         * TODO: (I.E. If you know/figure out the code, the only request you need to use is the final one. So it has to be directly from the email)
         * @returns {JSX} JSX form
         */
        forgot: () => {
            const Classes = this.props.classes;
            return(
                <form
                    className={Classes.root}
                    onSubmit={this.handleSubmit.forgot} >

                    <Typography>
                        Please Enter your email and your desired password.
                        <br />
                        You will receive an email to confirm the change.
                    </Typography>

                    <TextField
                        autoComplete="email"
                        className={Classes.input}
                        fullWidth
                        id="forgot-email"
                        label="Email"
                        name="email"
                        onChange={this.handleChange}
                        required
                        type="email"
                        value={this.state.forgot.email} />
                    <br />

                    { /* Password + Repeat Password */
                    }
                    <TextField
                        autoComplete="off"
                        className={Classes.input}
                        fullWidth
                        id="forgot-password"
                        inputProps={{ minLength: "8" }}
                        label="Password"
                        name="password"
                        onChange={this.handleChange}
                        required
                        type="password"
                        value={this.state.forgot.password} />
                    <br />
                    <TextField
                        autoComplete="off"
                        className={Classes.input}
                        fullWidth
                        id="forgot-repeat-password"
                        label="Repeat Password"
                        name="repeatPassword"
                        onChange={this.handleChange}
                        required
                        type="password"
                        value={this.state.forgot.repeatPassword} />

                    <Button
                        className={Classes.button}
                        id="forgot-submit"
                        type="submit"
                        variant="contained" >
                        Confirm
                    </Button>
                </form>
            );
        }
    }


    /**
     * Provides us with the White background &&
     * Has the Tabs, and controls for them.
     */
    body(classes)
    {
        return(
            <div
                className={classes.paper} >

                { /* Modal Tabs, This is how we navigate between Login and Sign Up*/
                }
                <div
                    id="login-title" >
                    <Button
                        className={classes.tab}
                        disableElevation={this.state.tab !== "login"}
                        id="loginTab"
                        onClick={() => this.handleTab("login")}
                        style={{
                            left: "0",
                            backgroundColor: `${this.state.tab === "login" ?
                                                "#fff" :
                                                "#ccc"}`
                        }}
                        type="button" >
                        <h6>
                            Log In
                        </h6>
                    </Button>
                    { /* The Styling used, does 2 things. Places them at different "lefts" ( left: 0 on the one above and right: 0 on the one below would have the same effect.)
                     * And gives the Non-active tab a gray color, so the user can easily tell which one is active. The rest of the CSS is provided by classes.tab */
                    }
                    <Button
                        className={classes.tab}
                        disableElevation={this.state.tab !== "register"}
                        id="registerTab"
                        onClick={() => this.handleTab("register")}
                        style={{
                            left: "50%",
                            backgroundColor: `${this.state.tab === "register" ?
                                                "#fff" :
                                                "#ccc"}`
                        }}
                        type="button" >
                        <h6>
                            Sign Up
                        </h6>
                    </Button>
                </div>


                { /* Here we are simply adding a div with some marginTop to get a little space
                 * And then we are calling one of our forms (based on the active tab)
                   *
                   * IT IS REQUIRED that the sub classes in this.forms has IDENTICAL names as its respective state.tab
                   * (I.E. this.forms.login === this.forms["login"])
                 */
                }
                <div
                    id="login-body"
                    style={{ marginTop: "16px" }} >
                    {this.forms[this.state.tab]()}
                </div>
            </div>
        );
    }


    /**
     * Main Render Method
     * Contains the Modal and Transition Elements, then calls body() for the "entire" modal card.
     * Also has "The server is processing your request" backdrop, activated when "this.state.working" is true.
     */
    render()
    {
        const Classes = this.props.classes;
        return(
            <Modal
                aria-describedby="login-body"
                aria-labelledby="login-title"
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500
                }}
                className={Classes.modal}
                closeAfterTransition
                onClose={this.props.onClose}
                open={this.props.open} >
                <div>
                    { /* Modal & Fade give us A PopUp With a Fading Transition */
                        /* ReSharper disable all */
                    }

                    <Fade
                        in={this.props.open}
                        timeout="500" >

                        {this.body(Classes) /* All the interface of the Modal (The White Card) */
                        }
                    </Fade>


                    { /* This Backdrop element, is used to communicate back end/database work to the user
                 *  Activate this before every Axios request, and deactivate it when the request is over.
                  * Otherwise users will go insane in the 0-5.0 seconds it takes, and bombard our back end with useless requests.
                  * */
                    }
                    <Backdrop
                        className={Classes.backdrop}
                        open={this.state.working} >
                        <CircularProgress
                            color="inherit" />
                    </Backdrop>
                </div>
            </Modal>
        );
    }
};

export default withStyles(UseStyles)(LoginModal)