import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

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

const onSubmit = data => {
  console.log(JSON.stringify(data));
  // this is where you send data to API
};

const SignUpForm = () => {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="fname"
            name="firstName"
            variant="outlined"
            required
            fullWidth
            id="firstName"
            label="First Name"
            autoFocus
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign Up
      </Button>
      <Grid container justify="flex-end">
        <Grid item>
          <Link className={classes.link} to="/login" variant="body2">
            Already have an account? Login
          </Link>
        </Grid>
      </Grid>
    </form>
  );
}

export default SignUpForm;