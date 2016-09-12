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

export default class WodMeUp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <WorkoutsListView/>
      </View>
    );
  }
}