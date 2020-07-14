import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { connect } from 'react-redux';
import { authReq } from '../actions/authActions';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
  Button, TextField,
  // FormControlLabel,
  // Checkbox,
  Collapse, IconButton,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

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

const LoginForm = (props) => {
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
      <TextField
        className={classes.field}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Username"
        name="username"
        autoComplete="username"
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
      <Link className={classes.link} to="/signup">
        Don't have an account? Register
      </Link>
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

export default connect(null, { authReq })(LoginForm);