import React from 'react';
import {
    LineChart, Line, Tooltip, ResponsiveContainer, ReferenceLine, XAxis, Legend, 
} from 'recharts';

// Material-UI Components
import { 
    Typography, 
} from '@material-ui/core';

const StockTooltip = (props) => {
    if (props.active) {
        return (
            <Typography color="secondary" variant={props.big ? "body1" : "body2"}>
                {props.big && props.label} ${props.payload[0].value}
            </Typography>
        );
    }
    return null;
}

const StockChart = (props) => {
    return (
    <ResponsiveContainer width={props.width} height={props.height}>
        <LineChart data={props.data}>
            <XAxis dataKey="date" hide />
            <Tooltip 
                position={props.big ? { y: -20 } : { y: -15 }}
                offset={props.big ? -45 : -20}
                animationDuration={200}
                content={<StockTooltip big={props.big} />}
            />
            {props.referenceLine && <ReferenceLine y={50} stroke="#000" strokeDasharray="3 3" />}
            <Line
                
                dataKey="price"
                label={(entry) => entry.date}
                isAnimationActive={true}
                animationDuration={800} 
                unit="$"
                stroke={props.color}
                strokeWidth={props.strokeWidth}
                dot={false}
                activeDot={props.big ? { r: 6 } : { r: 4 }}
                />
        </LineChart>
    </ResponsiveContainer>
    );
}

export default StockChart;