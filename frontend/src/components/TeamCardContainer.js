import React from 'react';
import { Link } from 'react-router-dom';
import TeamCard from './TeamCard.js';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Typography, Button
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    title: {
        margin: theme.spacing(2, 0),
    }
}));

const TeamCardContainer = (props) => {
    const classes = useStyles();

    const Contents = () => {
        if (props.holdings.length == 0) {
            return (
                <>
                <Grid item xs={12}>
                    <Typography variant="subtitle1">
                        Oh no! You don't own any teams. Find teams from the search bar or teams page.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" component={Link} to="/teams" color="primary">
                        View Teams
                    </Button>
                </Grid>
                </>
            );
        } else {
            return (
                props.holdings.map((holding) => 
                    <Grid item sm={6} md={3}>
                        <TeamCard key={holding.abr} data={holding} />
                    </Grid>
                )
            );
        }
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography className={classes.title} variant="h4">
                    My Teams
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Contents />
                </Grid>
            </Grid>
        </Grid>
    );
}

export default TeamCardContainer;