import React from 'react';
import {
    AreaChart, Area, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
  
const StockChart = (props) => {
    return (
    <ResponsiveContainer width={props.width} height={props.height}>
        <AreaChart data={props.data} margin={{top: 0, right: 0, left: 0, bottom: 20,}}>
            <Tooltip />
            {props.referenceLine && <ReferenceLine y={50} stroke="#000" strokeDasharray="3 3" />}
            <Area 
                type="linear" 
                dataKey="price" 
                baseLine={100}
                unit="$"
                stroke="#000"
                strokeWidth={props.strokeWidth}
                fill="#FFF" 
                fillOpacity={0.5}
                />
        </AreaChart>
    </ResponsiveContainer>
    );
}

export default StockChart;