import React from 'react';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    bigHeader: {
        fontSize: "2rem",
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
            ${props.price}
        </Typography>
        <Typography className={props.big ? classes.bigSubtitle : null} variant="subtitle2">
            {sign}${Math.abs(props.change)} ({sign}{Math.abs(props.pct_change)}%) 
        </Typography>
        </>
    );
}

export default StockPrice;