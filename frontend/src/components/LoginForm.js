import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
  Button, TextField, Grid,
  // FormControlLabel,
  // Checkbox,
  Collapse, IconButton,
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

const LoginForm = () => {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const [ formError, setFormError ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState();
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
    fetch('http://127.0.0.1:5000/api/auth/login', requestOpts)
      .then(response => {
        if (response.status === 400) {
          response.json().then(err => {
            handleError(err);
          });
        } else if (response.status === 200) {
          response.json().then(data => {
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
        <Grid style={{marginTop: -10}} item xs={12}>
          <Link className={classes.link} to="/signup">
            Don't have an account? Register
          </Link>
        </Grid>
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

export default LoginForm;