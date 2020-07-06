import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import {
  LoginForm,
  NavBar,
  SignUpForm,
  TeamCard
} from './components';

import './App.css';
import TeamCardContainer from './components/TeamCardContainer';

function App() {

  return (
    <Router>
      <NavBar />
        <Switch>
          <Route path="/" exact>
            <h1> Fanbase Market </h1>
          </Route>
          <Route path="/login" exact component={LoginForm} />
          <Route path="/register" exact component={SignUpForm} />
          <Route path="/portfolio/:username">
            <TeamCardContainer />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
