import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import * as NBAIcons from 'react-nba-logos';
import { ReactComponent as LogoIcon } from '../assets/svgs/logo-04.svg';

import { connect } from 'react-redux';
import { logout } from '../actions/authActions';

import { fade, makeStyles } from '@material-ui/core/styles';
import {
    AppBar, Toolbar, IconButton, Typography, InputBase, MenuItem, Menu, Button, SvgIcon
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  bar: {
    boxShadow: "0 1px 3px 1px rgba(0,0,0,0.1)",
  },
  logo: {
    marginRight: theme.spacing(1.2),
    fontSize: "1.9rem",
  },
  title: {
    fontWeight: 700,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    padding: 0,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.secondary.main, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.secondary.main, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 2),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: 250,
    [theme.breakpoints.up('md')]: {
      width: 255,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const AuthNavBar = (props) => {

  const teams = Object.entries(props.names).map(p => {
    const obj = {};
    obj['name'] = p[1];
    obj['abr'] = p[0];
    return obj;
  });

  const classes = useStyles();
  const history = useHistory();
  const { isAuthenticated, user } = props.auth;
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const onLogout = () => {
    props.logout(user['access_token']).then(
      (res) => history.push('/'),
      (err) => console.log(err)
    );
  };

  const onSearch = (value) => {
    history.push(`/team/${value}`)
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const logoFromAbr = (abr) => {
    const Logo = NBAIcons[abr];
    return <Logo size={50} />
  }

  const guestLinks = (
    <>
    <Button component={Link} to="/signup" color="inherit">Sign Up</Button>
    <Button component={Link} to="/login" color="primary" variant="outlined">Login</Button>
    </>
  );

  const userLinks = (
    <>
    <Button component={Link} to={`/portfolio/${user.username}`} color="inherit">Portfolio</Button>
    <Button component={Link} to="/teams" color="inherit">Teams</Button>
    <Button component={Link} to="/leaderboard" color="inherit">Leaderboard</Button>
    <Button component={Link} onClick={onLogout} to="/" color="inherit" variant="outlined">Logout</Button>
    </>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMobileMenuClose} component={Link} to={`/portfolio/${user.username}`}>
        <p>Portfolio</p>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose} component={Link} to="/teams">
        <p>Teams</p>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose} component={Link} to="/leaderboard">
        <p>Leaderboard</p>
      </MenuItem>
      <MenuItem 
        onClick={() => {
          onLogout();
          handleMobileMenuClose();
        } }
        component={Link} to="/">
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} color="inherit" position="fixed">
        <Toolbar>
        <SvgIcon component={LogoIcon} className={classes.logo} viewBox="0 0 1080 1080" />
          <Typography className={isAuthenticated ? classes.title : null} variant="h6" noWrap>
            Fanbase
          </Typography>
          { isAuthenticated &&
          <Autocomplete
            clearOnEscape
            disableListWrap
            size="medium"
            id="search"
            options={teams}
            getOptionLabel={(option) => option.name}
            renderOption={(option) => (
              <>
                <span style={{marginTop: 5, marginRight: 7}}>{logoFromAbr(option.abr)}</span>
                <Typography variant="subtitle1">
                  {option.name}
                </Typography>
              </>
            )}
            style={{ width: 350 }}
            renderInput={(params) => 
              <div className={classes.search}>
                  <div className={classes.searchIcon}>
                  <SearchIcon />
                  </div>
                  <InputBase
                  placeholder="Search Team"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  />
              </div>
            }
            onChange={(e, newValue) => {
              if (newValue) {
                onSearch(newValue.abr.toLowerCase());
              }
            }}
          />
          }
          <div className={classes.grow} />
          { isAuthenticated ? 
          <>
          <div className={classes.sectionDesktop}>
            {userLinks}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </div>
          </> : guestLinks }
        </Toolbar>
      </AppBar>
      <Toolbar />
      {renderMobileMenu}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    names: state.teams.names
  };
}

export default connect(mapStateToProps, { logout })(AuthNavBar);
