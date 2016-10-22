/**
 * @flow
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import _ from 'lodash';

// TODO refactor into an SFC.
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

const Rounds = ({cluster}) => {
  const rounds = _.get(cluster, 'rounds', null);
  const repScheme = _.get(cluster, 'repScheme', null);
  if (rounds && repScheme) {
    const output = Array.from({length: cluster.rounds}, (k, $round) => {
      // TODO find an alternative to eval()
      return eval(cluster.repScheme);
    }).join('-');
    return (
      <Text>{output} reps</Text>
    );
  }
  else if(repScheme && _.isArray(repScheme)) {
    return <Text>{repScheme.join('-')} reps</Text>;
  }
  else if(rounds) {
    return <Text>{rounds} Rounds</Text>;
  }
  return null;
}

const Timing = ({timing}) => {
  if (_.isObject(timing) && !_.isEmpty(timing)) {
    let output;
    switch (timing.type) {
      case 'AMRAP':
        // TODO refactor to moment.js
        output = `AMRAP ${timing.timeCap / 60} minutes`;
        break;
      case 'FixedIntervals':
        // If there's a reminder (90, 150..etc) just print seconds as is.
        if (timing.time === 60) {
          output = 'EMOM';
        }
        else if (timing.time % 60) {
          output = `E${timing.time}sOM`;
        }
        else {
          output = `E${timing.time / 60}MOM`;
        }
        output += ` for ${timing.intervals} Rounds`;
        break;
      case 'TimedRounds':
        
        console.log('timing', timing);
        console.log('timing', timing);
        
    }
    // const timing = _.reduce(timing, (result, value, key) => {
    //   result = result || '';
    //   if (key === 'type') {
    //     switch (value) {
    //       case 'FixedIntervals':
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
      <Text>{output}</Text>
    );
  }
  return null;
}

const Scoring = ({scoring}) => <Text>For {scoring}</Text>

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

const WorkoutClusterView = ({cluster}) => {
  let view = cluster.units.map((unit, i) => {
    return (
      <WorkoutMovement key={i} unit={unit}/>
    );
  });
  return (
    <View>
      <Timing timing={cluster.timing}/>
      <Rounds cluster={cluster}/>
      <View>{view}</View>
    </View>
  );
}

const WorkoutView = ({workout}) => {
  var clusters = workout.clusters.map((cluster, i) => {
    return (
      <WorkoutClusterView key={i} cluster={cluster}/>
    );
  });
  return (
    <View style={styles.Workout}>
      <Text style={styles.name}>{workout.name}</Text>
      <Scoring scoring={workout.scoring}/>
      <Text>{workout.scoring.name}</Text>
      <View>{clusters}</View>
    </View>
  );
}

export default WorkoutView;

