import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  field: {
    margin: theme.spacing(2, 0, 0),
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

const LoginForm = () => {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextField
        className={classes.field}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        inputRef={register}
      />
      <TextField
        className={classes.field}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        inputRef={register}
      />
      {/* <FormControlLabel
        control={<Checkbox inputRef={register} name="remember" color="primary" defaultValue={false}/>}
        label="Remember me"
      /> */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Login
      </Button>
      <Grid container>
        <Grid item xs>
          <Link className={classes.link} to="#" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link className={classes.link} to="/signup" variant="body2">
            Don't have an account? Register
          </Link>
        </Grid>
      </Grid>
    </form>
  );
}

export default LoginForm;