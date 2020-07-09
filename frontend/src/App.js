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
  TeamCardContainer,
  FormContainer,
  Leaderboard
} from './components';

import './App.css';

function App() {

  return (
    <Router>
      <NavBar />
        <Switch>
          <Route path="/" exact>
            <h1> Fanbase Market </h1>
          </Route>
          <Route path="/login" exact>
            <FormContainer title="Welcome to Fanbase">
              <LoginForm />
            </FormContainer>
          </Route>
          <Route path="/signup" exact>
            <FormContainer title="Build Your Fanbase">
              <SignUpForm />
            </FormContainer>
          </Route>
          <Route path="/portfolio/:username">
            <TeamCardContainer />
          </Route>
          <Route path="/leaderboard" exact>
            <Leaderboard />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
