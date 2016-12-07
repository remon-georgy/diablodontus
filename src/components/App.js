/**
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import WorkoutsListView from './WorkoutsListView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

function getWorkouts() {
  return fetch('/workouts')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
}

export default class WodMeUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workouts: []
    }
  }
  
  componentWillMount() {
    const p = getWorkouts();
    
    p.then((workouts) => {
      this.setState({workouts: workouts});
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <WorkoutsListView workouts={this.state.workouts}/>
      </View>
    );
  }
}