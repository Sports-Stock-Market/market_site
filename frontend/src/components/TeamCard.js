import React from 'react';
import { Link } from 'react-router-dom';
import * as NBAIcons from 'react-nba-logos';
import StockChart from './StockChart.js';
import StockPrice from './StockPrice.js';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Card, Typography, Grid,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: "8px",
        backgroundColor: "#FFF",
        width: "100%",
        border: "1px solid #EDF2F5",
        padding: theme.spacing(1.5),
        // boxShadow: "0 1px 1px 1px rgba(0,0,0,0.1)",
        transition: "all 0.5s cubic-bezier(.25,.8,.25,1)",
        // transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
        '&:hover': {
            cursor: "pointer",
            // boxShadow: "0 2px 6px 1px rgba(0,0,0,0.15)",
            // boxShadow: "0 1px 3px 1px rgba(0,0,0,0.1)",
            backgroundColor: theme.palette.secondary.light
        },
    },
}));

const data = Array.from({length: 40}, (_, i) => {
    return {
        "date": `7/${i}/20`,
        "price": Math.round(Math.random() * 8000 + 10)/100,
    }
});

const TeamCard = (props) => {
    const classes = useStyles();

    console.log(props.data);

    const Logo = NBAIcons[props.key];
    const change = Math.round((props.data.price-props.data.position.bought) * 100) / 100;
    const pct_change = Math.round((change / props.data.position.bought) * 100) / 100;

    return (
        <Link to={`/team/${props.data.abr.toLowerCase()}`} style={{ textDecoration: 'none' }}>
            <Card variant="outlined" className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item md={9} xs={10}>
                        <Typography variant="h5">
                            {props.data.name}
                        </Typography>
                        <Typography variant="subtitle2">
                            {props.data.position.shares} Shares ({props.data.position.diversity*100}% Portfolio) 
                        </Typography>
                    </Grid>
                    <Grid style={{ marginTop: -9}} item xs={2}>
                        <Logo size={50} />
                    </Grid>
                    <Grid item xs={12}>
                        <StockChart 
                            data={data} 
                            width={"90%"} 
                            height={80} 
                            strokeWidth={2}
                            color={"#000"}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <StockPrice 
                            price={props.data.price}
                            change={change}
                            pct_change={pct_change}
                        />
                    </Grid>
                </Grid>
            </Card>
        </Link>
    );
}

export default TeamCard;