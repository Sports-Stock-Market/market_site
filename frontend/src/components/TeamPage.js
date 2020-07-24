import React, { useEffect, useState } from 'react';
import MainStockChart from './MainStockChart.js';
import GameCardContainer from './GameCardContainer.js';
import TeamBuySell from './TeamBuySell.js';
import { connect } from 'react-redux';
import { isEmpty, getSampleData } from '../utils/jsUtils';
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


const TeamPage = (props) => {
    const classes = useStyles();    
    const sample = getSampleData(1500.0);
    const [price, setPrice] = useState(1500.0);
    const [data, setData] = useState(sample);
    const [abr, setAbr] = useState("");

    useEffect(() => {
        setAbr(props.match.params.abr.toUpperCase());
        if (!isEmpty(props.teams.teams) && abr !== '') {
            console.log(abr);
            console.log(props.teams.teams[abr]);
            setData(props.teams.teams[abr]['graph']);
            setPrice(props.teams.teams[abr]['price']['price']);
        }
    });

    const name = props.teams.names[abr];

    return (
        <Container component="main" maxWidth="md">
            <Typography className={classes.title} variant="h3">
                {name}
            </Typography>
            <Grid className={classes.main} container spacing={4}>
                <Grid item xs={12}>
                    <MainStockChart last={price} delta={200.02} pctInc={20.34} chartData={data} />
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
                        <TeamBuySell price={price}/>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <GameCardContainer />
                </Grid>
            </Grid>
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      teams: state.teams
    };
}

export default connect(mapStateToProps, {})(TeamPage);