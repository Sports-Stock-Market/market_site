import React from 'react';
import GameCard from './GameCard.js';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Typography, List, ListItem, Divider,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {

    },
    title: {
        margin: theme.spacing(2, 0),
    },
    item: {
        padding: 0
    }
}));

// Sample Data
const games = [
    {
        date: "07-30-20",
        time: "08:00 PM",
        location: "Madison Square Garden",
        away_team: {
            name: "New Orleans Pelicans",
            abr: "NOP",
            record: "24-26",
            price: 1644.72,
            score: 0,
        },
        home_team: {
            name: "New York Knicks",
            abr: "NYK",
            record: "21-30",
            price: 1565.22,
            score: 0,
        },
        status: "not started",
        time_left: "12:00",
        quarter: 1,
    },
    {
        date: "07-30-20",
        time: "08:00 PM",
        location: "Madison Square Garden",
        away_team: {
            name: "New Orleans Pelicans",
            abr: "NOP",
            record: "24-26",
            price: 1644.72,
            score: 42,
        },
        home_team: {
            name: "New York Knicks",
            abr: "NYK",
            record: "21-30",
            price: 1565.22,
            score: 63,
        },
        status: "live",
        time_left: "10:42",
        quarter: 3,
    },
    {
        date: "07-30-20",
        time: "08:00 PM",
        location: "Madison Square Garden",
        away_team: {
            name: "New Orleans Pelicans",
            abr: "NOP",
            record: "24-26",
            price: 1644.72,
            score: 80,
        },
        home_team: {
            name: "New York Knicks",
            abr: "NYK",
            record: "21-30",
            price: 1565.22,
            score: 98,
        },
        status: "finished",
        time_left: "00:00",
        quarter: 4,
    },
]

const GameCardContainer = () => {
    const classes = useStyles();

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography className={classes.title} variant="h4">
                    Schedule
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <List className={classes.root}>
                    <Divider />
                    {games.map((game) => 
                        <>
                        <ListItem className={classes.item} item>
                            <GameCard key={game.date} data={game} />
                        </ListItem>
                        <Divider />
                        </>
                    )}
                </List>
            </Grid>
        </Grid>
    );
}

export default GameCardContainer;