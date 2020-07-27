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
import Skeleton from '@material-ui/lab/Skeleton';

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
    const sample = getSampleData(0);
    const [price, setPrice] = useState(0);
    const [data, setData] = useState(sample);
    const [position, setPosition] = useState({});
    const [abr, setAbr] = useState("");

    // useEffect(() => {
    //     if (abr) {
    //         const token = props.auth.user.access_token;
    //         const requestOpts = {
    //             method: 'GET',
    //             headers: {'Content-type': 'application/JSON', 'Authorization': 'Bearer ' + token, 'Abr': abr},
    //             credentials: 'include'
    //         };
    //         fetch(`http://localhost:5000/api/teams/position`, requestOpts).then(res => {
    //             res.json().then(response => {
    //                 setPosition(response);
    //             }); 
    //         });
    //     }
    // }, [abr])

    useEffect(() => {
        setAbr(props.match.params.abr.toUpperCase());

        if (!isEmpty(props.teams.teams) && abr !== '') {
            setData(props.teams.teams[abr]['graph']);
            setPrice(props.teams.teams[abr]['price']['price']);
        }
    });

    useEffect(() => {
        if (!isEmpty(props.teams.teams) && abr !== '') {
            setData(props.teams.teams[abr]['graph']);
            setPrice(props.teams.teams[abr]['price']['price']);
        }
    }, [props.teams.teams]);

    const name = props.teams.names[abr];

    return (
        <Container component="main" maxWidth="md">
            <Typography className={classes.title} variant="h3">
                {name}
            </Typography>
            <Grid className={classes.main} container spacing={4}>
                <Grid item xs={12}>
                    <MainStockChart last={price} delta={200.02} pctInc={20.34} chartData={data} abr={abr}/>
                </Grid>
                <Divider />
                <Grid container item xs={12} spacing={3}>
                    <Grid item md={6} sm={10}>
                        <Typography className={classes.title} variant="h4">
                            Position
                        </Typography>
                        {price == 0 ? 
                        <Skeleton variant="rect" height={154} /> :
                        <PositionCard data={position}/>
                        }
                    </Grid>
                    <Grid item md={6} sm={10}>
                        <Typography className={classes.title} variant="h4">
                            Trade {abr}
                        </Typography>
                        {price == 0 ?
                        <Skeleton variant="rect" height={304.09} /> :
                        <TeamBuySell abr={abr} price={price}/>
                        }
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <GameCardContainer message={"This team has no games"}/>
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