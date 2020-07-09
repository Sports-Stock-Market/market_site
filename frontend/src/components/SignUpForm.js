import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
  Button, TextField, Grid, Collapse, IconButton,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    height: 40,
    margin: theme.spacing(2, 0, 1.5),
  },
  link: {
    color: 'black',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  }
}));

const SignUpForm = () => {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const [ formError, setFormError ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState()
  const history = useHistory();

  const handleError = err => {
    setFormError(true);
    setErrorMessage(err['message']);
  }

  const onSubmit = data => {
    const requestOpts = {
      method: 'POST',
      headers: {'Content-type': 'application/JSON'},
      body: JSON.stringify(data),
      credentials: 'include'
    };
    fetch('http://127.0.0.1:5000/api/auth/register', requestOpts)
      .then(response => {
        if (response.status === 400) {
          response.json().then(err => {
            handleError(err);
          });
        } else if (response.status === 201) {
          response.json().then(data => {
            localStorage.setItem('access_token', data['access_token']);
            history.push("/portfolio/user");
          });
        }
      });
  };

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoComplete="uname"
            name="userName"
            variant="outlined"
            required
            fullWidth
            id="userName"
            label="Username"
            autoFocus
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="confirm-password"
            inputRef={register}
          />
        </Grid>
      </Grid>
      <Link className={classes.link} to="/login" variant="body2">
        Already have an account? Login
      </Link>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign Up
      </Button>
      <Collapse in={formError}>
        <Alert 
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setFormError(false);
              }}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          } 
          variant="outlined" severity="error">
          {errorMessage}
        </Alert>
      </Collapse>
    </form>
  );
}

export default SignUpForm;