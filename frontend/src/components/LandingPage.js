import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoIcon } from '../assets/svgs/logo-04.svg';

import { makeStyles } from '@material-ui/core/styles';
import { 
    Card, Typography, Grid, Box, Button, ButtonGroup, Container, SvgIcon
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.primary.main,
        width: "100%",
        minHeight: '92.5vh',
        padding: theme.spacing(4),
    },
    title: {
        fontSize: "2.8rem",
        color: theme.palette.common.white,
    }, 
    subtitle: {
        color: theme.palette.common.white,
    }, 
    logo: {
        color: theme.palette.common.white,
        fontSize: "4rem",
        marginRight: theme.spacing(2),
    }
}));

const LandingPage = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Container component="main" maxWidth="md">
                <Grid className={classes.main} container spacing={4}>
                    <Grid item xs={12}>
                        {/* <SvgIcon component={LogoIcon} className={classes.logo} viewBox="0 0 1080 1080" /> */}
                        <Typography className={classes.title} variant="h1">
                            Fanbase
                        </Typography>
                    {/* </Grid>
                    <Grid item xs={12}> */}
                        <Typography className={classes.subtitle} variant="h1">
                            A Stock Market for Sports Fans.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ButtonGroup variant="contained" color="default" aria-label="contained primary button group">
                            <Button color="default">How it Works</Button>
                            <Button component={Link} to="/signup">Join the Beta</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
};

export default LandingPage;