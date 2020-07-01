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
    logo: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
}));

export default function NavBar() {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <SportsBasketballIcon edge="start" className={classes.logo} color="inherit" />
            <Typography variant="h6" className={classes.title}>
                <Link to="/">Fanbase</Link>
            </Typography>
            <Button component={Link} to="/register" color="inherit">Sign Up</Button>
            <Button component={Link} to="/login" color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
}