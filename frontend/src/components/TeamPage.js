import React, { useEffect, useState } from 'react';
import MainStockChart from './MainStockChart.js';
import GameCardContainer from './GameCardContainer.js';
import TeamBuySell from './TeamBuySell.js';

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

const sample = Array.from({length: 80}, (v, i) => {
    return {
        "date": `7/${i}/20`,
        "price": Math.round(Math.random() * 8000 + 10)/100,
    }
});

const TeamPage = (props) => {
    const classes = useStyles();
    const [data, setData] = useState(sample);

    return (
        <Container component="main" maxWidth="md">
            <Typography className={classes.title} variant="h3">
                Atlanta Hawks
            </Typography>
            <Grid className={classes.main} container spacing={4}>
                <Grid item xs={12}>
                    <MainStockChart last={1600.06} delta={200.02} pctInc={20.34} chartData={data} />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    <TeamBuySell />
                </Grid>
                <Grid item xs={12}>
                    <GameCardContainer />
                </Grid>
            </Grid>
        </Container>
    );
}

export default TeamPage;