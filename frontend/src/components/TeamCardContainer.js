import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeamCard from './TeamCard.js';
import { connect } from 'react-redux';
import { isEmpty } from '../utils/jsUtils';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import { 
    Grid, Typography, Button
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
    title: {
        margin: theme.spacing(2, 0),
    }
}));

const TeamCardContainer = (props) => {
    const classes = useStyles();
    const [teamData, setTeamData] = useState({});

    useEffect(() => {
        if (!isEmpty(props.teams.teams)) {
            setTeamData(props.teams.teams)
        }
    });

    const Contents = () => {
        if (isEmpty(props.holdings)) {
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
                Object.entries(props.holdings).map(holding => 
                    <Grid item sm={6} md={3}>
                        { isEmpty(teamData) ? 
                            <Skeleton variant="rect" height={216} /> :
                            <TeamCard 
                                key={holding[0]} 
                                name={props.teams.names[holding[0]]} 
                                price={teamData[holding[0]]['price']['price']} 
                                abr={holding[0]} 
                                data={holding[1]} 
                                chartData={teamData[holding[0]]['graph']}
                            />
                        }
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

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      teams: state.teams
    };
}

export default connect(mapStateToProps, {})(TeamCardContainer);