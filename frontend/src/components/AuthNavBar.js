import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { fade, makeStyles } from '@material-ui/core/styles';
import {
    AppBar, Toolbar, IconButton, Typography, InputBase, MenuItem, Menu, Button
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  bar: {
    boxShadow: "0 1px 3px 1px rgba(0,0,0,0.1)",
  },
  logo: {
    marginRight: theme.spacing(1.5),
  },
  title: {
    fontWeight: 700,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
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
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
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

const teams = [
    { name: "New York Knicks", abr: "NYK"},
    { name: "Chicago Bulls", abr: "CHI"},
    { name: "Los Angeles Lakers", abr: "LAL"},
  ]

const AuthNavBar = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const onSearch = (value) => {
    history.push(`/team/${value}`)
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
    </Menu>
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
      <MenuItem onClick={handleMobileMenuClose} component={Link} to="/portfolio">
        <p>Portfolio</p>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose} component={Link} to="/team">
        <p>Teams</p>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose} component={Link} to="/leaderboard">
        <p>Leaderboard</p>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose} component={Link} to="/portfolio">
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} color="inherit" position="fixed">
        <Toolbar>
        <SportsBasketballIcon edge="start" className={classes.logo} color="inherit" />
          <Typography className={classes.title} variant="h6" noWrap>
            Fanbase
          </Typography>
          <Autocomplete
            value={""}
            id="search"
            fullWidth
            clearOnEscape
            options={teams}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => 
              <div className={classes.search}>
                  <div className={classes.searchIcon}>
                  <SearchIcon />
                  </div>
                  <InputBase
                  placeholder="Search"
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
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button component={Link} to="/portfolio/user" color="inherit">Portfolio</Button>
            <Button component={Link} to="/team/nyk" color="inherit">Teams</Button>
            <Button component={Link} to="/leaderboard" color="inherit">Leaderboard</Button>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
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
        </Toolbar>
      </AppBar>
      <Toolbar />
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default AuthNavBar;