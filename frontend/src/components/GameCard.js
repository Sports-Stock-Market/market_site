import React from 'react';
import * as NBAIcons from 'react-nba-logos';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Card, Typography, Grid, Box,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: "8px",
        backgroundColor: "#FFF",
        width: "100%",
        border: "1px solid #EDF2F5",
        padding: theme.spacing(1.5),
    },
    infoContainer: {
        margin: theme.spacing(1, 0, 1.5, 0),
    },
    teamContainer: {
        marginBottom: theme.spacing(0.8),
    },
    team: {
        display: "inline",
        marginRight: theme.spacing(1),
    },
}));

const GameCard = (props) => {
    const classes = useStyles();

    const HomeLogo = NBAIcons[props.data.home_team.abr];
    const AwayLogo = NBAIcons[props.data.away_team.abr];

    let time, score;
    switch(props.data.status) {
        case "not started":
            score = [`$${props.data.home_team.price}`, `$${props.data.away_team.price}`]
            time = props.data.time;
            break;
        case "live":
            score = [props.data.home_team.score, props.data.away_team.score]
            time = `${props.data.time_left} Q${props.data.quarter}`;
            break;
        case "finished":
            score = [props.data.home_team.score, props.data.away_team.score]
            time = "Final";
            break;
    }

    return (
        <div style={{ width: "100%" }}>
            <Box className={classes.infoContainer} display="flex">
                <Box flexGrow={1}>
                    <Typography variant="subtitle1">
                        {props.data.location}
                    </Typography>
                </Box>
                <Box p={0}>
                    <Typography variant="subtitle1">
                        {time}
                    </Typography>
                </Box>
            </Box>
            <Box className={classes.teamContainer} display="flex">
                <Box flexGrow={1}>
                    {/* <HomeLogo size={50}/> */}
                    <Typography className={classes.team} variant="h6">
                        {props.data.home_team.name}
                    </Typography>
                    <Typography display="inline" variant="subtitle1">
                        ({props.data.home_team.record})
                    </Typography>
                </Box>
                <Box >
                    <Typography variant="h6">
                        {score[0]}
                    </Typography>
                </Box>
            </Box>
            <Box className={classes.teamContainer} display="flex">
                <Box flexGrow={1}>
                    {/* <AwayLogo size={50}/> */}
                    <Typography className={classes.team} variant="h6">
                        {props.data.away_team.name}
                    </Typography>
                    <Typography display="inline" variant="subtitle1">
                        ({props.data.away_team.record})
                    </Typography>
                </Box>
                <Box >
                    <Typography  variant="h6">
                        {score[1]}
                    </Typography>
                </Box>
            </Box>
        </div>
    )
}

export default GameCard;
