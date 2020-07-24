import React, { useState, useEffect } from 'react';
import * as NBAIcons from 'react-nba-logos';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { 
    Typography, Grid, Card, TextField, Tabs, Tab, Box, Button
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        border: "1px solid #EDF2F5",
        padding: theme.spacing(1.5),
        width: "100%",
    },
    field: {
        color: theme.palette.primary,
        backgroundColor: theme.palette.secondary.light,
    },
    label: {
        fontSize: "0.8rem",
        fontWeight: 500,
    },
    value: {
        fontWeight: 700,
        marginLeft: theme.spacing(1),
    },
    submit: {
        height: 40,
        width: "40%",
        margin: theme.spacing(4, 1, 1, 1),
    },
}));

const TradeTabs = withStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(1),
    },
    indicator: {
        backgroundColor: theme.palette.primary.main,
    },
  }))(Tabs);

const TradeTab = withStyles((theme) => ({
    root: {
      color: theme.palette.secondary.main,
      textTransform: 'none',
      marginRight: theme.spacing(0),
      minWidth: 5,
      fontSize: "1.2rem",
      fontWeight: 600,
      transition: "all 0.6s cubic-bezier(.25,.8,.25,1)",
      '&:hover': {
        color: theme.palette.primary.main,
        opacity: 1,
      },
      '&$selected': {

      },
      '&:focus': {
        color: theme.palette.primary,
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);

// sample data

const labels = {
    price: "Share Price",
    totalPrice: "Total Price",
    avFunds: "Available Funds",
    remFunds: "Remaining Funds"
}

const TeamBuySell = (props) => {
    const sample = {
        price: 1500,
        avFunds: 16000,
        totalPrice: 1500,
        remFunds: 16000,
    }

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [shares, setShares] = useState(0);
    const [data, setData] = useState(sample);

    const Logo = NBAIcons[props.abr];

    useEffect(() => {
        setData({...data, 
            price: props.price, 
            totalPrice: props.price * shares,
            remFunds: data.avFunds - (props.price * shares),
        });
    }, [props.price, shares])

    const handleTabChange = (e, newValue) => {
        setValue(newValue);
    };

    const handleFieldChange = e => {
        setShares(e.target.value);
    };

    const InfoItem = ({ label, info }) => {
        return (
            <Grid item xs={6}>
                <Typography display="inline" className={classes.label}>
                    {label}
                </Typography>
                <Typography display="inline" className={classes.value} variant="subtitle1">
                    {info}
                </Typography>
            </Grid>
        )
    };

    return (
        <Card variant="outlined" className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <TradeTabs 
                 value={value}
                 indicatorColor="primary"
                 textColor="primary"
                 onChange={handleTabChange}
                 aria-label="simple tabs example"
                >
                    <TradeTab label="Buy" />
                    <TradeTab label="Sell" />
                    <TradeTab label="Short" />
                </TradeTabs>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Shares"
                        fullWidth
                        variant="outlined"
                        type="number"
                        className={classes.field}
                        value={shares}
                        onChange={handleFieldChange}
                    />
                </Grid>
                <Grid container item xs={12} spacing={0}>
                    {Object.entries(data).map(([ label, info ]) => 
                        <InfoItem key={label} label={labels[label]} info={info.toFixed(2)} />
                    )}
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Submit
                </Button>
            </Grid>
        </Card>
    )
}

export default TeamBuySell;