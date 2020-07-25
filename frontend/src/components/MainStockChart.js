import React, { useState } from 'react';
import StockPrice from './StockPrice';
import StockChart from './StockChart';
import ChartRangePicker from './ChartRangePicker';
import Skeleton from '@material-ui/lab/Skeleton';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    bigHeader: {
        fontSize: "2rem",
    },
    bigSubtitle: {
        fontSize: "1rem",
    },
}));

const MainStockChart = (props) => {
    const classes = useStyles();

    const [range, setRange] = useState('1D');
    const labels = ["1D", "1W", "1M", "SZN"];

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                { props.last == 0 ?
                    <>
                    <Typography className={classes.bigHeader} variant="h5">
                        <Skeleton />
                    </Typography>
                    <Typography className={classes.bigSubtitle} variant="subtitle1">
                        <Skeleton />
                    </Typography>
                    </> :
                <StockPrice 
                    big
                    price={props.last}
                    change={props.delta}
                    pct_change={props.pctInc}
                />}
            </Grid>
            <Grid item xs={12}>
                { props.last == 0 ? 
                    <Skeleton variant="rect" height={250} /> :
                <StockChart
                    range={range}
                    big
                    referenceLine 
                    data={props.chartData[range]}
                    height={250}
                    strokeWidth={3}
                    color={"#000"}
                />}
            </Grid>
            <Grid  item xs={12}>
                <ChartRangePicker pickRange={range => setRange(labels[range])} />
            </Grid>
        </Grid>
    );
}

export default MainStockChart;
