import React from 'react';
import MainStockChart from './MainStockChart.js';
import TeamCardContainer from './TeamCardContainer.js';
import GameCardContainer from './GameCardContainer.js';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Typography, Container, Divider,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    title: {
        margin: theme.spacing(2, 0),
    },
    main: {
        marginTop: theme.spacing(3)
    },
}));

const Portfolio = () => {
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="md">
            <Typography className={classes.title} variant="h3">
                Will's Fanbase
            </Typography>
            <Grid className={classes.main} container spacing={4}>
                <Grid item xs={12}>
                    <MainStockChart />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    <TeamCardContainer />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    <GameCardContainer />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Portfolio;