import React, { useState } from 'react';
import * as NBAIcons from 'react-nba-logos';
import { makeStyles } from '@material-ui/core/styles';
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
    const [data, setData] = useState(sample);

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
                <Grid item xs={12}>
                    <Typography variant="body1">
                        Bought At
                    </Typography>
                    <Typography variant="h6">
                        ${1600}
                    </Typography>
                </Grid>
                <Grid container item xs={12} spacing={0}>
                    {Object.entries(data).map(([ label, info ]) => 
                        <InfoItem key={label} label={labels[label]} info={info} />
                    )}
                </Grid>
            </Grid>
        </Card>
    )
}

export default PositionCard;