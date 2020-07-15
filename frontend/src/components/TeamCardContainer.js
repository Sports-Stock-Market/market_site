import React, { useEffect, useState } from 'react';
import TeamCard from './TeamCard.js';
import Cookies from 'universal-cookie';
import { refreshToken } from '../actions/authActions';
import { connect } from 'react-redux';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Typography, Container,
} from '@material-ui/core';
import MainStockChart from './MainStockChart.js';

const useStyles = makeStyles((theme) => ({
    title: {
        margin: theme.spacing(2, 0),
    }
}));

const TeamCardContainer = (props) => {

    const [avFunds, setAvFunds] = useState(0.0);
    const [holdings, setHoldings] = useState([]);
    const [data, setData] = useState([]);

    const classes = useStyles();
    const cookies = new Cookies();
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
              setAvFunds(data_['available_funds']);
              setHoldings(data_['holdings']);
              setData(data_['graphData']);
            })
        );
    }

    useEffect(() => {
        props.refreshToken(cookies.get('csrf_refresh_token'));
    }, []);

    useEffect(() => {
        getUsrData();
    }, []);

    var last = 0;
    var sndLast = 0;
    var delta = 0;
    var pctInc = 0;
    if (data.length !== 0) {
        last = data[data.length - 1]['price'];
        sndLast = data[data.length - 2]['price'];
        delta = last - sndLast;
        pctInc = (last / sndLast) - 1;
    }

    return (
        <Container className={classes.container} component="main" maxWidth="md">
            <Typography className={classes.title} variant="h4">
                {username}'s Portfolio
            </Typography>
            <MainStockChart chartData={data} delta={delta} pctInc={pctInc} last={last} />
            <Typography className={classes.title} variant="h4">
                My Teams
            </Typography>
            <Grid container spacing={3}>
                {holdings.map((holding) => 
                    <Grid item sm={6} md={3}>
                        <TeamCard data={holding} />
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, { refreshToken })(TeamCardContainer);