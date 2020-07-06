import React from 'react';
import { Link } from 'react-router-dom';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    bar: {
      boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
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
        <AppBar className={classes.bar} color="inherit" position="sticky">
          <Toolbar>
            <SportsBasketballIcon edge="start" className={classes.logo} color="inherit" />
            <Typography variant="h6" className={classes.title}>Fanbase</Typography>
            <Button component={Link} to="/register" color="inherit">Sign Up</Button>
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
      </div>
    );
}