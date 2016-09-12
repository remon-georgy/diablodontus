import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import _ from 'lodash';

export class WorkoutMovement extends Component {
  renderableMovement(unit) {
    let parts = [unit.movement.name];
    return parts = _.reduce(unit.rx, (result, value, key) => {
      result = result || [];
      if (key === 'reps') {
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
    const repScheme = Array.from({length: this.props.cluster.rounds}, (k, $round) => {
      console.log($round);
      // TODO find an alternative to eval()
      return eval(this.props.cluster.repScheme);
    }).join('/');
    console.log('repScheme', repScheme);
    return (
      <Text>{repScheme}</Text>
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
    return (
      <View>
        {this.props.cluster.repScheme && this.props.cluster.rounds ?
          <RepScheme cluster={this.props.cluster}/> :
          null}
          {/* <RepScheme cluster={this.props.cluster}/> */}
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
