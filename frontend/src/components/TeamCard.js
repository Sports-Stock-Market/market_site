import React, { useState, useEffect } from 'react';
import * as NBAIcons from 'react-nba-logos';

// Material-UI Components
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    
}));

const TeamCard = (props) => {
    const Logo = NBAIcons[props.data.abr];

    return (
        <Logo />
    );
}

export default TeamCard;