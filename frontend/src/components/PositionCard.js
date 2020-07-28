import React, { useState, useEffect } from 'react';
import { formatNumber } from '../utils/jsUtils';
import * as NBAIcons from 'react-nba-logos';
import { makeStyles } from '@material-ui/core/styles';
import { isEmpty } from '../utils/jsUtils';
import { 
    Typography, Grid, Card,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        border: "1px solid #EDF2F5",
        padding: theme.spacing(1.5),
        width: "100%",
    },
    label: {
        fontSize: "0.8rem",
        fontWeight: 500,
    },
    value: {
        fontWeight: 700,
        marginLeft: theme.spacing(1.5),
    },
    submit: {
        height: 40,
        width: "40%",
        margin: theme.spacing(4, 1, 1, 1),
    },
}));

// sample data
const sample = {
    shares: 8,
    weight: 16000,
    dailyDelta: 10,
    ovrDelta: 20,
}

const labels = {
    shares: "Shares Owned",
    weight: "Portfolio Weight",
    dailyDelta: "Today's Return",
    ovrDelta: "Total Return"
}

const PositionCard = (props) => {
    const classes = useStyles();
    const [data, setData] = useState({});
    const [bought, setBought] = useState(0);

    useEffect(() => {
        if (!isEmpty(props.data)) {
            setBought(props.data.bought_at.toFixed(2));
            const todayStart = props.teamData['1D'][0].price;
            setData({
                shares: props.data.num_shares,
                weight: `${(props.data.weight * 100).toFixed(2)}%`,
                dailyDelta: `${(((props.curr - todayStart)/todayStart) * 100).toFixed(2)}%`,
                ovrDelta: `${(((props.curr - props.data.bought_at)/props.data.bought_at) * 100).toFixed(2)}%`,
            });
        } else {
            setData({});
        }
    }, [props.data])

    const Logo = NBAIcons[props.abr];

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
            { isEmpty(data) || bought == 0 ?
                <Grid item xs={12}>
                    <Typography variant="body1">
                        You own no shares of {props.abr}
                    </Typography>
                </Grid> : 
                <React.Fragment>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Bought At
                    </Typography>
                    <Typography variant="h6">
                        ${formatNumber(bought)}
                    </Typography>
                </Grid>
                <Grid container item xs={12} spacing={0}>
                    {Object.entries(data).map(([ label, info ]) => 
                        <InfoItem key={label} label={labels[label]} info={info} />
                    )}
                </Grid>
                </React.Fragment>
            }
            </Grid>
        </Card>
    )
}

export default PositionCard;