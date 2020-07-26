import React, { useEffect, useState } from 'react';
import MainStockChart from './MainStockChart.js';
import TeamCardContainer from './TeamCardContainer.js';
import GameCardContainer from './GameCardContainer.js';
import Cookies from 'universal-cookie';
import { refreshToken } from '../actions/authActions';
import { connect } from 'react-redux';
import { getSampleData } from '../utils/jsUtils';

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


const Portfolio = (props) => {

    const sample = getSampleData(15000.0);

    const classes = useStyles();
    const [avFunds, setAvFunds] = useState(0.0);
    const [holdings, setHoldings] = useState([]);
    const [data, setData] = useState(sample);

    const username = window.location.pathname.slice(11);
    const requestOpts = {
        method: 'GET',
        headers: {'Content-type': 'application/JSON',
                'username': username},
        credentials: 'include'
    };
    const getUsrData = () => {
        fetch('http://localhost:5000/api/users/usrPg', requestOpts).then(
            res => res.json().then(data_ => {
                console.log(data_['holdings']);
                setAvFunds(data_['available_funds']);
                setHoldings(data_['holdings']);
                setData(data_['graphData']);
            })
        );
    }

    let last = data['1D'][data['1D'].length - 1]['price'];
    let sndLast = data['1D'][data['1D'].length - 2]['price'];
    let delta = last - sndLast;
    let pctInc = (last / sndLast) - 1;

    useEffect(() => {
        getUsrData();
    }, []);

    return (
        <Container component="main" maxWidth="md">
            <Typography className={classes.title} variant="h3">
                {username}'s Fanbase
            </Typography>
            <Grid className={classes.main} container spacing={4}>
                <Grid item xs={12}>
                    <MainStockChart last={last} delta={delta} pctInc={pctInc} chartData={data} />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    <TeamCardContainer holdings={holdings} />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                    <GameCardContainer message={"Once you purchase some teams, their games will show up here"}/>
                </Grid>
            </Grid>
        </Container>
    );
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth
    };
}

export default connect(mapStateToProps, {})(Portfolio);