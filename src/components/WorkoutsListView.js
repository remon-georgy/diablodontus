/**
 * @flow
 */

import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import WorkoutView from './WorkoutView';

export default class WorkoutsListView extends Component {
  render() {
    const { workouts } = this.props
    const rows = workouts.map((workout) => <WorkoutView key={workout.name} workout={workout}/>);

    return (
      <ScrollView>
        {rows}
      </ScrollView>
    );
  }
}

WorkoutsListView.propTypes = {
  workouts: React.PropTypes.array.isRequired
}