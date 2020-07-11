import React from 'react';
import StockPrice from './StockPrice';
import StockChart from './StockChart';
import ChartRangePicker from './ChartRangePicker';

// Material-UI Components
import { 
    Grid,
} from '@material-ui/core';

const data = Array.from({length: 80}, (v, i) => {
    return {
        "date": v,
        "price": Math.round(Math.random() * 8000 + 10)/100,
    }
});

const MainStockChart = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <StockPrice 
                    big
                    price={16785.22}
                    change={4650.35}
                    pct_change={0.3832}
                />
            </Grid>
            <Grid item xs={12}>
                <StockChart
                    referenceLine 
                    data={data}
                    height={250}
                    strokeWidth={2}
                />
            </Grid>
            <Grid style={{ marginTop: -20}}item xs={12}>
                <ChartRangePicker />
            </Grid>
        </Grid>
    );
}

export default MainStockChart;
