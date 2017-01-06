/**
 * @flow
 */

import React, { PropTypes } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import WorkoutView from './WorkoutView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

const WorkoutsListView = ({ workouts }) => {
  const rows = workouts.map((workout, i) => {
    return <WorkoutView {...workout} key={i}/>
  });

  return (
    <ScrollView
      style={styles.container}
      children={rows}
    />
  );
}
WorkoutsListView.propTypes = {
  workouts: PropTypes.array.isRequired
}

export default WorkoutsListView