import React from 'react';
import {
    AreaChart, Area, Tooltip, ResponsiveContainer, ReferenceLine, XAxis, Legend, 
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
        <AreaChart data={props.data}>
        <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00893B" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#00893B" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EC1C24" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#EC1C24" stopOpacity={0}/>
            </linearGradient>
        </defs>
            <XAxis dataKey="date" hide />
            <Tooltip 
                position={props.big ? { y: -20 } : { y: -15 }}
                offset={props.big ? -45 : -20}
                animationDuration={200}
                content={<StockTooltip big={props.big} />}
            />
            {props.referenceLine && <ReferenceLine y={50} stroke="#000" strokeDasharray="3 3" />}
            <Area 
                type="linear" 
                dataKey="price"
                label={(entry) => entry.date}
                animationDuration={800} 
                unit="$"
                stroke="#000"
                strokeWidth={props.strokeWidth}
                fill="url(#colorPv)" 
                fillOpacity={0.5}
                activeDot={props.big ? { r: 6 } : { r: 4 }}
                />
        </AreaChart>
    </ResponsiveContainer>
    );
}

export default StockChart;