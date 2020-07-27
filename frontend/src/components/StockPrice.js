import React from 'react';
import { formatNumber } from '../utils/jsUtils';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    bigHeader: {
        fontSize: "2.2rem",
    },
    bigSubtitle: {
        fontSize: "1rem",
    },
}));

const StockPrice = (props) => {
    const classes = useStyles();

    const sign = props.change < 0 ? "-" : "+";

    return (
        <>
        <Typography className={props.big ? classes.bigHeader : null} variant="h5">
            ${formatNumber(props.price.toFixed(2))}
        </Typography>
        <Typography className={props.big ? classes.bigSubtitle : null} variant="subtitle2">
            {sign}${formatNumber(Math.abs(props.change).toFixed(2))} ({sign}{Math.abs(props.pct_change).toFixed(2)}%) 
        </Typography>
        </>
    );
}

export default StockPrice;