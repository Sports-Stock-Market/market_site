import React, { useEffect, useState } from 'react';
import MainStockChart from './MainStockChart.js';
import GameCardContainer from './GameCardContainer.js';
import TeamBuySell from './TeamBuySell.js';
import PositionCard from './PositionCard.js';

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

const sample = {"1D": Array.from({length: 80}, (v, i) => {
    return {
        "date": `7/${i}/20`,
        "price": Math.round(Math.random() * 8000 + 10)/100,
    }
})};

const TeamPage = (props) => {
    const classes = useStyles();
    const [data, setData] = useState(sample);
    const [abr, setAbr] = useState("");

    useEffect(() => {
        setAbr(props.match.params.abr.toUpperCase());
    }, [props.match])

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
                <Grid container item xs={12} spacing={3}>
                    <Grid item md={6} xs={12}>
                        <Typography className={classes.title} variant="h4">
                            Position
                        </Typography>
                        <PositionCard />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Typography className={classes.title} variant="h4">
                            Trade {abr}
                        </Typography>
                        <TeamBuySell />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <GameCardContainer />
                </Grid>
            </Grid>
        </Container>
    );
}

export default TeamPage;