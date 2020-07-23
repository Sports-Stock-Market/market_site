import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { connect } from 'react-redux';
import { authReq } from '../actions/authActions';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
  Button, TextField, Grid, Snackbar, IconButton
  // FormControlLabel,
  // Checkbox,
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
    marginTop: -20,
    color: 'black',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  }
}));

const LoginForm = (props) => {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const [ formError, setFormError ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ open, setOpen ] = useState(false);
  const history = useHistory();

  const handleError = err => {
    setOpen(true);
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
    try {
      props.authReq('login', requestOpts).then(
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
            error={formError ? true : false}
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={formError ? true : false}
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
        {/* <FormControlLabel
          control={<Checkbox inputRef={register} name="remember" color="primary" defaultValue={false}/>}
          label="Remember me"
        /> */}
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Login
      </Button>
      <Snackbar open={open}>
        <Alert 
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          } 
          severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
      <Link className={classes.link} to="/signup">
        Don't have an account? Register
      </Link>
    </form>
  );
}

export default connect(null, { authReq })(LoginForm);