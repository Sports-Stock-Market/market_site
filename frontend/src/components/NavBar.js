import React from 'react';
import { Link, useHistory } from 'react-router-dom';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Typography, Button,
} from '@material-ui/core';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import Cookies from 'universal-cookie'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    bar: {
      boxShadow: "0 1px 3px 1px rgba(0,0,0,0.1)",
    },
    logo: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      fontWeight: 700,
    },
}));

const NavBar = (props) => {
    const classes = useStyles();
    const { isAuthenticated, user } = props.auth;
    const history = useHistory();

    const onClick = () => {
      props.logout(user['access_token']).then(
        (res) => history.push('/'),
        (err) => console.log(err)
      );
    };

    const userLinks = (
      <Button color="primary" variant="outlined" onClick={onClick}>Logout</Button>
    );

    const guestLinks = (
      <React.Fragment>
      <Button component={Link} to="/signup" color="inherit">Sign Up</Button>
      <Button component={Link} to="/login" color="primary" variant="outlined">Login</Button>
      </React.Fragment>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.bar} color="inherit" position="sticky">
          <Toolbar>
            <SportsBasketballIcon edge="start" className={classes.logo} color="inherit" />
            <Typography variant="h6" className={classes.title}>Fanbase</Typography>
            <Button component={Link} to="/leaderboard" color="inherit">Leaderboard</Button>
            { isAuthenticated ? userLinks : guestLinks }
          </Toolbar>
        </AppBar>
      </div>
    );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { logout })(NavBar);
