import React from 'react';
import TeamCard from './TeamCard.js';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid,
    Typography,
    Container,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(2),
    }
}));

// Sample Data
const holdings = [
    {
        name: "Atlanta Hawks",
        abr: "ATL",
        price: 1500.21,
        position: {
            bought: 1646.35,
            shares: 8,
            diversity: 0.09,
        }
    },
    {
        name: "New York Knicks",
        abr: "NYK",
        price: 1760.21,
        position: {
            bought: 1646.35,
            shares: 20,
            diversity: 0.15,
        }
    },
    {
        name: "Los Angeles Lakers",
        abr: "LAL",
        price: 1646.35,
        position: {
            bought: 1646.35,
            shares: 30,
            diversity: 0.45,
        }
    },
]

const TeamCardContainer = () => {
    const classes = useStyles();

    const teamCards = holdings.map((holding) => 
        <Grid item xs={6} sm={4}>
            <TeamCard data={holding} />
        </Grid>
    );

    return (
        <Container component="main" maxWidth="md">
            <Typography className={classes.title} variant="h4">
                My Teams
            </Typography>
            <Grid container spacing={3}>
                {teamCards}
            </Grid>
        </Container>
    );
}

export default TeamCardContainer;