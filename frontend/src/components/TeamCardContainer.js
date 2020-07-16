import React from 'react';
import TeamCard from './TeamCard.js';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    title: {
        margin: theme.spacing(2, 0),
    }
}));

const TeamCardContainer = (props) => {

    const classes = useStyles();

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography className={classes.title} variant="h4">
                    My Teams
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    {props.holdings.map((holding) => 
                        <Grid item sm={6} md={3}>
                            <TeamCard key={holding.abr} data={holding} />
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default TeamCardContainer;