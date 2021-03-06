import React from 'react';
import Poll from '../../Polls/Poll';
import Discussion from './Discussion';
import { Divider, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: { width: 'auto', margin: 0 },
  element: {
    margin: theme.spacing(1)
  }
}));

const ListingDataOf = ({ polls, discussions }) => {
  const classes = useStyles();

  return (
    <Grid>
      {polls === undefined
        ? discussions.map(disc => (
            <div className={classes.element}>
              <Divider />
              <Discussion discID={disc} />
            </div>
          ))
        : polls.map(poll => (
            <div className={classes.element}>
              <Divider />
              <Poll pollID={poll} />
            </div>
          ))}
    </Grid>
  );
};

export default ListingDataOf;
