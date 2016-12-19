/**
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { ScrollView } from 'react-native';
import WorkoutView from './WorkoutView';

const WorkoutsListView = ({ workouts }) => {
  const rows = workouts.map((workout, i) => {
    return <WorkoutView {...workout} key={i}/>
  });

  return (
    <ScrollView>
      {rows}
    </ScrollView>
  );
}
WorkoutsListView.propTypes = {
  workouts: PropTypes.array.isRequired
}

export default WorkoutsListView