import React, { useLayoutEffect } from 'react';
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

// Sample Data
const holdings = [
    {
        name: "Atlanta Hawks",
        abr: "ATL",
        price: 1500.21,
        position: {
            bought: 1646.35,
            shares: 8,
            diversity: 0.09,
        }
    },
    {
        name: "New York Knicks",
        abr: "NYK",
        price: 1760.21,
        position: {
            bought: 1646.35,
            shares: 20,
            diversity: 0.15,
        }
    },
    {
        name: "Los Angeles Lakers",
        abr: "LAL",
        price: 1646.35,
        position: {
            bought: 1646.35,
            shares: 30,
            diversity: 0.45,
        }
    },
    {
        name: "Los Angeles Lakers",
        abr: "LAL",
        price: 1646.35,
        position: {
            bought: 1646.35,
            shares: 30,
            diversity: 0.45,
        }
    },
]

const TeamCardContainer = (props) => {
    const classes = useStyles();
    const cookies = new Cookies();
    useLayoutEffect(() => {
      props.refreshToken(cookies.get('csrf_refresh_token')).then(
        (res) => console.log(res),
        (err) => console.log(err)
      );
    }, []);

    return (
        <Container className={classes.container} component="main" maxWidth="md">
            <Typography className={classes.title} variant="h4">
                Will's Portfolio
            </Typography>
            <MainStockChart />
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