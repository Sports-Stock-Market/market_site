import React from 'react';
import { Link } from 'react-router-dom';
import * as NBAIcons from 'react-nba-logos';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Card,
    Typography,
    Grid,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
        '&:hover': {
            boxShadow: "0 3px 6px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.22)",
        },
    },
    default: {
        color: theme.palette.default,
    },
    positive: {
        color: theme.palette.green.main,
    },
    negative: {
        color: theme.palette.red.main,
    }
}));

const TeamCard = (props) => {
    const classes = useStyles();

    const Logo = NBAIcons[props.data.abr];
    const change = Math.round((props.data.price-props.data.position.bought) * 100) / 100;
    const pct_change = Math.round((change / props.data.position.bought) * 100) / 100;

    let textColor = classes.default;
    let sign = "+";
    if (change < 0) {
        textColor = classes.negative;
        sign = "-";
    } else if (change > 0) {
        textColor = classes.positive;
    }

    return (
        <Link to={`/team/${props.data.abr.toLowerCase()}`} style={{ textDecoration: 'none' }}>
            <Card className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={9}>
                        <Typography variant="h5">
                            {props.data.name}
                        </Typography>
                        <Typography variant="subtitle2">
                            {props.data.position.shares} shares ({props.data.position.diversity*100}% diversity) 
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Logo size={80} />
                    </Grid>
                    <Grid item xs={12}>
                        Chart goes here
                    </Grid>
                    <Grid item xs={9}>
                        <Typography className={textColor} variant="h4">
                            ${props.data.price}
                        </Typography>
                        <Typography className={textColor} variant="subtitle2">
                            {sign}${Math.abs(change)} ({sign}{Math.abs(pct_change)}%) 
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        </Link>
    );
}

export default TeamCard;