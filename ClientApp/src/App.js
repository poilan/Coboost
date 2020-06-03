import React, { Component } from 'react';
import { Route } from 'react-router';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Session } from './components/Session';
import { Mobile } from './components/Mobile';
import { BigScreen } from './components/BigScreen';
import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <>
                <Route exact path='/' component={Home} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/session' component={Session} />
                <Route exact path='/mobile' component={Mobile} />
                <Route exact path='/screen' component={BigScreen} />
            </>
        );
    }
}