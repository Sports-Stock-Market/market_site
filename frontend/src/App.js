import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import {
  Login,
  Register,
  NavBar
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
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </Switch>
    </Router>
  );
}

export default App;
