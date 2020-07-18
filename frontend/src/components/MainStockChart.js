import React, { useState } from 'react';
import StockPrice from './StockPrice';
import StockChart from './StockChart';
import ChartRangePicker from './ChartRangePicker';

// Material-UI Components
import { 
    Grid,
} from '@material-ui/core';

const MainStockChart = (props) => {

    const [range, setRange] = useState('1D');
    const labels = ["1D", "1W", "1M", "YTD"];

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
                    data={props.chartData[range]}
                    height={250}
                    strokeWidth={3}
                    color={"#000"}
                />
            </Grid>
            <Grid  item xs={12}>
                <ChartRangePicker pickRange={range => setRange(labels[range])} />
            </Grid>
        </Grid>
    );
}

export default MainStockChart;
