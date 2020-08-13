import React, { Component } from 'react';
import { Route } from 'react-router';
import { Home } from './components/Landing/Home';
import { Login } from './components/Login/Login';
import { Recovery } from './components/Login/Recovery';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Mobile } from './components/Mobile/Mobile';
import { BigScreen } from './components/Big Screen/BigScreen';
import './custom.css'
import { Administrator } from './components/Administrator/Administrator';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <>
                <Route exact path='/' component={Home} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/recover' component={Recovery} />
                <Route exact path='/dashboard' component={Dashboard} />
                <Route exact path='/mobile' component={Mobile} />
                <Route exact path='/screen' component={BigScreen} />
                <Route exact path='/administrator' component={Administrator} />
            </>
        );
    }
}