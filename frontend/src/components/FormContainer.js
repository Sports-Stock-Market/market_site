import React from 'react';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import {
  CssBaseline, Typography, Container,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }));

  const FormContainer = (props) => {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography variant="h5">
                    {props.title}
                </Typography>
                {props.children}
            </div>
        </Container>
    );
  }
  
  export default FormContainer;