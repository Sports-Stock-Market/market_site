import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import {
  LoginForm,
  NavBar,
  SignUpForm
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
          <Route path="/login" exact component={LoginForm} />
          <Route path="/register" exact component={SignUpForm} />
        </Switch>
    </Router>
  );
}

export default App;
