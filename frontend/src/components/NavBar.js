import React from 'react';
import { Link } from 'react-router-dom';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Typography, Button,
} from '@material-ui/core';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';

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

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar className={classes.bar} color="inherit" position="fixed">
        <Toolbar>
          <SportsBasketballIcon edge="start" className={classes.logo} color="inherit" />
          <Typography variant="h6" className={classes.title}>Fanbase</Typography>
          <Button disableRipple component={Link} to="/signup" color="inherit">Sign Up</Button>
          <Button 
          component={Link} 
          to="/login" 
          color="primary" 
          variant="outlined" 
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
}