import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { connect } from 'react-redux';
import { authReq } from '../actions/authActions';

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

const SignUpForm = (props) => {
  const classes = useStyles();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [ formError, setFormError ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState()
  const history = useHistory();

  const values = getValues(["userName", "email", "password", "confirm-password"])

  const handleError = err => {
    setFormError(true);
    setErrorMessage(err['message']);
  }

  const isFieldError = (field) => {
    return formError && values[field] !== ""
  }

  const onSubmit = data => {
    const requestOpts = {
      method: 'POST',
      headers: {'Content-type': 'application/JSON'},
      body: JSON.stringify(data),
      credentials: 'include'
    };
    try {
      props.authReq('register', requestOpts).then(
        (res) => {
          if (res.hasOwnProperty('message')) {
            handleError(res);
          } else {
            const uname = res['username'];
            history.push('/portfolio/' + uname);
          }
        }
      );
    }
    catch(error) {
      console.log(error);
    }
  };

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={isFieldError("userName") ? true : false}
            helperText={isFieldError("userName") ? errorMessage : ""}
            autoComplete="uname"
            name="userName"
            variant="outlined"
            required
            fullWidth
            id="userName"
            label="Username"
            autoFocus
            inputRef={register}
            onChange={e => setValue('userName', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isFieldError("email") ? true : false}
            helperText={isFieldError("email") ? errorMessage : ""}          
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            inputRef={register}
            onChange={e => setValue('email', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isFieldError("password") ? true : false}
            helperText={isFieldError("password") ? errorMessage : ""}
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register}
            onChange={e => setValue('password', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isFieldError("confirm-password") ? true : false}
            helperText={isFieldError("confirm-password") ? errorMessage : ""}
            variant="outlined"
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="confirm-password"
            inputRef={register}
            onChange={e => setValue('confirm-password', e.target.value)}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign Up
      </Button>
      <Link className={classes.link} to="/login" variant="body2">
        Already have an account? Login
      </Link>
    </form>
  );
}

export default connect(null, { authReq })(SignUpForm);