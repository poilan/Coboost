import React from "react";
import {Route} from "react-router-dom";
import {Administrator} from "./components/Administrator/Administrator";
import {BigScreen} from "./components/Big Screen/BigScreen";
import {Dashboard} from "./components/Dashboard/Dashboard";
import {Home} from "./components/Landing/Home";
import {Login} from "./components/Login/Login";
import {Recovery} from "./components/Login/Recovery";
import {Mobile} from "./components/Mobile/Mobile";
import "./custom.css";


export default class App extends React.Component {
    static displayName = App.name;


    render()
    {
        return (
            <React.Fragment>
                <Route
                    component={Home}
                    exact
                    path="/" />
                <Route
                    component={Login}
                    exact
                    path="/login" />
                <Route
                    component={Recovery}
                    exact
                    path="/recover" />
                <Route
                    component={Dashboard}
                    exact
                    path="/dashboard" />
                <Route
                    component={Mobile}
                    exact
                    path="/mobile" />
                <Route
                    component={BigScreen}
                    exact
                    path="/screen" />
                <Route
                    component={Administrator}
                    exact
                    path="/administrator" />
            </React.Fragment>
        );
    }
}