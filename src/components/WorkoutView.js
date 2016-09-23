/**
 * @flow
 */

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

export class Rounds extends Component {
  render() {
    const rounds = _.get(this.props.cluster, 'rounds', null);
    const repScheme = _.get(this.props.cluster, 'repScheme', null);
    if (rounds && repScheme) {
      const output = Array.from({length: this.props.cluster.rounds}, (k, $round) => {
        // TODO find an alternative to eval()
        return eval(this.props.cluster.repScheme);
      }).join('-');
      return (
        <Text>{output} reps</Text>
      );
    }
    else if(repScheme && _.isArray(repScheme)) {
      return <Text>{repScheme.join('-')} reps</Text>;
    }
    else if(rounds) {
      return <Text>{rounds} rounds</Text>;
    }
    return null;
  }
}

export class Timing extends Component {
  render() {
    if (_.isObject(this.props.timing) && !_.isEmpty(this.props.timing)) {
      let timing;
      switch (this.props.timing.type) {
        case 'AMRAP':
          // TODO refactor to moment.js
          timing = `AMRAP ${this.props.timing.timeCap / 60} minutes`;
          break;
        case 'FixedInterval':
          // If there's a reminder (90, 150..etc) just print seconds as is.
          if (this.props.timing.time === 60) {
            timing = 'EMOM';
          }
          else if (this.props.timing.time % 60) {
            timing = `E${this.props.timing.time}sOM`;
          }
          else {
            timing = `E${this.props.timing.time / 60}MOM`;
          }
          timing += ` for ${this.props.timing.count} rounds`;
          break;
        case 'TimedRounds':
          
          console.log('this.props.timing', this.props.timing);
          console.log('timing', timing);
          
      }
      // const timing = _.reduce(this.props.timing, (result, value, key) => {
      //   result = result || '';
      //   if (key === 'type') {
      //     switch (value) {
      //       case 'FixedInterval':
      //         return result + 'EMOM';
      //       case 'TimedRounds':
      //         return result + 'Tabata';
      //       default:
      //         return result + value;
      //     }
      //   }
      //   else {
      //     result += value;
      //   }
      // });
      
      return (
        <Text>{timing}</Text>
      );
    }
    return null;
  }
}

export class Scoring extends Component {
  render() {
    return (
      <Text>For {this.props.scoring}</Text>
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
        <Timing timing={this.props.cluster.timing}/>
        <Rounds cluster={this.props.cluster}/>
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
        <Scoring scoring={this.props.workout.scoring}/>
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
