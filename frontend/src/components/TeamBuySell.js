import React, { useState } from 'react';
import * as NBAIcons from 'react-nba-logos';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { 
    Typography, Grid, Card, TextField, Tabs, Tab, Box, Button
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        border: "1px solid #EDF2F5",
        padding: theme.spacing(1.5),
        width: 450,
    },
    field: {
        color: theme.palette.primary,
        backgroundColor: theme.palette.secondary.light,
    },
    right: {
        fontWeight: 700,
    },
    submit: {
        height: 40,
        margin: theme.spacing(2, 0, 1.5),
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

const RightLeftAlign = ({ left, right }) => {
    const classes = useStyles();

    return (
        <Grid item xs={6}>
            <Box display="flex">
                <Box flexGrow={1}>
                    <Typography variant="subtitle1">
                        {left}
                    </Typography>
                </Box>
                <Box p={0}>
                    <Typography className={classes.right} variant="subtitle1">
                        {right}
                    </Typography>
                </Box>
            </Box>
        </Grid>
    )
}

// sample data
const sample = {
    price: 1600,
    totalPrice: 1600,
    avFunds: 1600,
    remFunds: 1600,
}

const TeamBuySell = (props) => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [data, setData] = useState(sample);

    const abr = window.location.pathname.slice(6).toUpperCase();
    const Logo = NBAIcons[abr];

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
        <Card variant="outlined" className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {/* <Logo size={40} /> */}
                    <Typography display="inline" variant="h4">
                        {abr}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                <TradeTabs 
                 value={value}
                 indicatorColor="primary"
                 textColor="primary"
                 onChange={handleChange}
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
                    />
                </Grid>
                <Grid container item xs={12} spacing={1}>
                    <RightLeftAlign left="Share Price" right={data.price} />
                    <RightLeftAlign left="Available Funds" right={data.avFunds} />
                    <RightLeftAlign left="Total Price" right={data.totalPrice} />
                    <RightLeftAlign left="Remaining Funds" right={data.remFunds} />
                </Grid>
                <Button
                    type="submit"
                    fullWidth
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