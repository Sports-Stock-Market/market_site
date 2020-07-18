import React from 'react';
import StockPrice from './StockPrice';
import StockChart from './StockChart';
import ChartRangePicker from './ChartRangePicker';

// Material-UI Components
import { 
    Grid,
} from '@material-ui/core';

const MainStockChart = (props) => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <StockPrice 
                    big
                    price={props.last}
                    change={props.delta}
                    pct_change={props.pctInc}
                />
            </Grid>
            <Grid item xs={12}>
                <StockChart
                    big
                    referenceLine 
                    data={props.chartData}
                    height={250}
                    strokeWidth={3}
                    color={"#000"}
                />
            </Grid>
            <Grid  item xs={12}>
                <ChartRangePicker />
            </Grid>
        </Grid>
    );
}

export default MainStockChart;
