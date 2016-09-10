import React, { Component, PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import _ from 'lodash';

export class WorkoutMovement extends Component {
  renderableMovement(unit) {
    let parts = [unit.movement.name];
    return parts = _.reduce(unit.rx, (result, value, key) => {
      result = result || [];
      if (key == 'reps') {
        result.unshift(value);
      }
      else {
        if (_.isArray(value)) {
          result.push(`(${value.join('/')})`);
        }
        else {
          result.push(value);
        }
      }
      return result;
    }, parts).join(' ');
  }
  
  render() {
    return (
      <View>
         <View style={[styles.base, {flexDirection: 'row'}]}>
          <Text className="Movement">{
            this.renderableMovement(this.props.unit)
          }</Text>
        </View>
      </View>
    );
  }
}

export class RepScheme extends Component {
  render() {
    var repScheme = Array.from(Array(this.props.cluster.rounds).keys()).map(($round) => {
      return eval(this.props.cluster.repScheme);
    }).join('/');
    console.log(repScheme);
    return (
      <View>{repScheme}</View>
    );
  }
}

export class WorkoutClusterView extends Component {
  render() {
    let view = this.props.cluster.units.map((unit, i) => {
      return (
        <WorkoutMovement key={i} unit={unit}/>
      );
    });
    console.log(this.props.cluster);
    return (
      <View>
        {this.props.cluster.repScheme && this.props.cluster.rounds ?
          <RepScheme cluster={this.props.cluster}/> :
          null}
        <View>{view}</View>
      </View>
    );
  }
}

export default class WorkoutView extends Component {
  render() {
    var clusters = this.props.workout.clusters.map((cluster, i) => {
      return (
        <WorkoutClusterView key={i} cluster={cluster}/>
      );
    });
    return (
      <View style={styles.Workout}>
        <Text style={styles.name}>{this.props.workout.name}</Text>
        <Text>{this.props.workout.scoring.name}</Text>
        <View>{clusters}</View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  base: {
    padding: 5,
  },
  name: {
    fontWeight: 'bold',
    paddingBottom: 5
  },
  Workout: {
    padding: 20,
    borderRadius: 3,
  },
  text: {
    color: '#FFF',
  },
});
