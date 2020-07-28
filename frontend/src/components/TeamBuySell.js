import React, { useState, useEffect } from 'react';
import { formatNumber } from '../utils/jsUtils';
import { connect } from 'react-redux';
import * as NBAIcons from 'react-nba-logos';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { 
    Typography, Grid, Card, TextField, Tabs, Tab, Button, Snackbar, IconButton
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

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

const buyLabels = {
    price: "Buy Price",
    total: "Total Cost",
    avFunds: "Available Funds",
    remFunds: "After Trade"
}

const TeamBuySell = (props) => {
    const defaultData = {
        price: 1500,
        avFunds: 15000,
        total: 1500,
        remFunds: 15000,
    }

    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [shares, setShares] = useState(1);
    const [lastShares, setLastShares] = useState(0);
    const [data, setData] = useState(defaultData);
    const [labels, setLabels] = useState(buyLabels);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const spreadPCT = 0.005;

    const Logo = NBAIcons[props.abr];

    const setAllData = () => {
        const multiplier = value == 0 ? (1 + spreadPCT) : (1 - spreadPCT);
        const change = value == 1 ? props.price * multiplier * shares : -props.price * multiplier * shares;
        setData({...data, 
            price: props.price * multiplier,
            total: Math.abs(change),
            avFunds: props.funds,
            remFunds: props.funds + (change),
        });
    }

    useEffect(() => {
        setValue(0);
        setShares(0);
        setOpen(false);
    }, [props.abr])

    useEffect(() => {
        setAllData();
    }, [props.funds])

    useEffect(() => {
        setAllData();
    }, [props.price, shares]);

    useEffect(() => {
        setShares(0);
        if (value == 0) {
            setLabels(buyLabels);
        } else if (value == 1) {
            setLabels({...labels,
                price: "Sell Price",
                total: "Total Credit",
                remFunds: "After Trade"
            });
        } else {
            setLabels({...labels,
                price: "Short Price",
            });
        }
        setAllData();
    }, [value]);

    const handleTrade = () => {
        if (shares > 0) {
            let type, forSnack;
            if (value == 0) {
                type = "buyShares";
                forSnack = "purchased";
            } else if (value == 1) {
                type = "sellShares";
                forSnack = "sold";
            } else {
                type = "shortShares";
                forSnack = "shorted";
            }
            const token = props.auth.user.access_token;
            const tradeInfo = {
                abr: props.abr,
                num_shares: shares,
            };
            const requestOpts = {
                method: 'POST',
                headers: {'Content-type': 'application/JSON', 'Authorization': 'Bearer ' + token},
                body: JSON.stringify(tradeInfo),
                credentials: 'include'
            };
            fetch(`http://localhost:5000/api/users/${type}`, requestOpts).then(res => {
                res.json().then(response => {
                    setMsg(forSnack);
                    setLastShares(shares)
                    setOpen(true);
                    setShares(0);
                    props.updatePosition();
                    props.updateFunds();
                    const multiplier = value == 0 ? (1 + spreadPCT) : (1 - spreadPCT);
                    const change = value == 1 ? props.price * multiplier * shares : -props.price * multiplier * shares;
                    setData({...data, 
                        avFunds: props.funds,
                        remFunds: props.funds + (change),
                    });
                }); 
            });
        }
    };

    const handleTabChange = (e, newValue) => {
        setValue(newValue);
    };

    const handleFieldChange = e => {
        if (!(e.target.value < 0 || 
            (value != 1 && e.target.value * data.price >= data.avFunds) ||
            (value == 1 && e.target.value > props.avShares))) {
            setShares(e.target.value);
        }
    };

    const InfoItem = ({ label, info }) => {
        return (
            <Grid item xs={6}>
                <Typography display="inline" className={classes.label}>
                    {label}
                </Typography>
                <Typography display="inline" className={classes.value} variant="subtitle1">
                    ${formatNumber(info)}
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
                    onClick={handleTrade}
                >
                    Submit
                </Button>
                <Snackbar autoHideDuration={5000} onClose={() => setOpen(false)} open={open}>
                    <Alert 
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setOpen(false);
                        }}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    } 
                    severity="success">
                    You successfully {msg} {lastShares} {lastShares == 1 ? "share": "shares"} of {props.abr}
                    </Alert>
                </Snackbar>
            </Grid>
        </Card>
    )
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth
    };
}

export default connect(mapStateToProps, {})(TeamBuySell);