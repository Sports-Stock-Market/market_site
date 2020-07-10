import React from 'react';
import StockPrice from './StockPrice';
import StockChart from './StockChart';
import ChartRangePicker from './ChartRangePicker';

const data = Array.from({length: 80}, (v, i) => {
    return {
        "date": v,
        "price": Math.round(Math.random() * 8000 + 10)/100,
    }
});

const MainStockChart = (props) => {
    return (
        <>
        <StockPrice 
            big
            price={16785.22}
            change={4650.35}
            pct_change={0.3832}
        />
        <StockChart 
            data={data}
            height={250}
            strokeWidth={3}
        />
        <ChartRangePicker />
        </>
    );
}

export default MainStockChart;
