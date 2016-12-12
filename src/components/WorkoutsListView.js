/**
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import { ScrollView } from 'react-native';
import WorkoutView from './WorkoutView';

export default class WorkoutsListView extends Component {
  static propTypes = {
    workouts: PropTypes.array.isRequired
  }
  
  render() {
    const { workouts } = this.props
    const rows = workouts.map((workout, i) => {
      return <WorkoutView {...workout} key={i}/>
    });

    return (
      <ScrollView>
        {rows}
      </ScrollView>
    );
  }
}

WorkoutsListView.propTypes = {
  workouts: PropTypes.array.isRequired
}