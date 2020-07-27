import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, Tooltip, ResponsiveContainer, ReferenceLine, XAxis, YAxis, 
} from 'recharts';

// Material-UI Components
import { 
    Typography, 
} from '@material-ui/core';

const StockTooltip = (props) => {
    let timeStamp;
    if (props.range === "1D") {
        timeStamp = String(props.label).slice(11, 19);
    } else {
        timeStamp = String(props.label).slice(0, 10);
    }

    if (props.active) {
        return (
            <Typography color="secondary" variant={props.big ? "body1" : "body2"}>
                {props.big && timeStamp} ${props.payload[0].value.toFixed(2)}
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
            <YAxis type="number" domain={['dataMin - 100', 'dataMax + 100']} hide />
            <Tooltip 
                position={props.big ? { y: -20 } : { y: -15 }}
                offset={props.big ? -45 : -20}
                animationDuration={50}
                content={<StockTooltip range={props.range} big={props.big} />}
            />
            {props.referenceLine && <ReferenceLine y={1500} stroke="#000" strokeDasharray="3 3" />}
            <Line
                
                dataKey="price"
                label={(entry) => entry.date}
                isAnimationActive={false}
                animationDuration={600} 
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