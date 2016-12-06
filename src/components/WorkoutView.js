/**
 * @flow
 */

import React, { PropTypes, Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {get, isEmpty, reduce} from 'lodash';
import math from 'mathjs'

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

// TODO refactor
export class WorkoutMovement extends Component {
  renderableMovement(unit) {
    let parts = [unit.movement.name];
    return parts = reduce(unit.rx, (result, value, key) => {
      result = result || [];
      if (typeof value === 'string') {
        value = value.replace('$', '');
      }
      if (key === 'reps') {
        result.unshift(value);
      }
      else {
        if (Array.isArray(value)) {
          result.push(value.join('/'));
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
//
// // Destructure cluster object
// const Rounds = ({cluster}) => {
//   const rounds = get(cluster, 'rounds', null);
//   const repScheme = get(cluster, '', null);
//   if (rounds && ) {
//     const output = Array.from({length: cluster.rounds}, (k, $round) => {
//       // TODO find an alternative to eval()
//       return cluster.;
//     }).join('-');
//     return (
//       <Text>{output} reps</Text>
//     );
//   }
//   else if( && Array.isArray()) {
//     return <Text>{.join('-')} reps</Text>;
//   }
//   else if(rounds) {
//     return <Text>{rounds} Rounds</Text>;
//   }
//   return null;
// }

const TimingOLD = ({timing}) => {
  const output = timing.type;
    switch (timing.type) {
      case 'NoTiming':
      default:
        return null
         
     
   }
  //     // TODO refactor to moment.js
  //     output = `AMRAP ${timing.timeCap / 60} minutes`;
  //     break;
  //   case 'FixedIntervals':
  //     // If there's a reminder (90, 150..etc) just print seconds as is.
  //     if (timing.time === 60) {
  //       output = 'EMOM';
  //     }
  //     else if (timing.time % 60) {
  //       output = `E${timing.time}sOM`;
  //     }
  //     else {
  //       output = `E${timing.time / 60}MOM`;
  //     }
  //     output += ` for ${timing.intervals} Rounds`;
  //     break;
  //   case 'TimedRounds':
  //
  //     console.log('timing', timing);
  //     console.log('timing', timing);
  //
  // }
  // const timing = reduce(timing, (result, value, key) => {
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


/****************************************************
 * Workout -> Scoring
 ***************************************************/
const Scoring = ({scoring}) => <Text>For {scoring}</Text>
Scoring.propTypes = {
  scoring: PropTypes.string.isRequired
}

/****************************************************
 * Workout -> Cluster -> Timing -> FixedIntervalsTiming
 ***************************************************/
const FixedIntervalsTiming = ({alias, deathBy, time, intervals}) => {
  let parts = []
  if (alias) {
    parts.push(alias)
  }
  else {
    parts.push('Each')
    const interval = (time % 60 > 0) ?
      `${time} seconds`:
      `${time / 60} Minute`
    parts.push(interval)
    parts.push('For')
    parts.push(intervals)
    parts.push('rounds')
  }
  if (deathBy) {
    parts.push('(Score is total number of rounds completed, plus number of reps completed in first incomplete round)')
  }
  
  return <Text>{parts.join(' ')}</Text>
}

/****************************************************
 * Workout -> Cluster -> Timing -> CappedTiming
 ***************************************************/
const CappedTiming = ({alias, timeCap}) => {
  let parts = []
  if (alias) {
    parts.push(alias)
  }
  else {
    parts = parts.concat(['AMRAP', 'in', timeCap / 60, 'minutes'])
  }
  
  return <Text>{parts.join(' ')}</Text>
}

/****************************************************
 * Workout -> Cluster -> Timing
 ***************************************************/
const Timing = ({type, ...rest}) => {
  let output
  switch (type) {
    // EMOM, Tabata, Fixed intervals in general
    case 'FixedIntervals':
      output = <FixedIntervalsTiming {...rest} />
      break;
      
    case 'Capped':
      output = <CappedTiming {...rest} />
      break;
    
    default:
      output = null
  }
  return output
  
  
}
Timing.propTypes = {
  type: PropTypes.string.isRequired
}

/****************************************************
 * Workout -> Cluster -> RepScheme
 ***************************************************/
const RepScheme = ({repScheme}) => {
  
  if (Array.isArray(repScheme)) {
    return <Text>{repScheme.join('-') + ' reps'}</Text>
  }
  else if (typeof repScheme === 'string') {
    return <Text>{repScheme}</Text>
  }
  else if (typeof repScheme === 'object' && repScheme !== null) {
    var {init, step, end = 10} = repScheme
    let reps = [init]
    for (let i = 1; i < end; i++) {
      reps.push(init + i*step);
    }
    
    return <Text>{reps.join(', ') + '...etc'}</Text>;
  }
  return null;
}

/****************************************************
 * Workout -> Cluster
 ***************************************************/
const Cluster = ({name, timing, units, rounds, restBetweenRounds, repScheme}) => {
  const unitsRend = units.map((unit, u) => {
    return (
      <WorkoutMovement key={u} unit={unit}/>
    );
  });
  
  let suffix
  if (restBetweenRounds) {
    const {value, unit} = restBetweenRounds
    const rest = math.unit(value, unit).to('minutes').toString()
    suffix = `Rest ${rest} between rounds`
  }

  return (
    <View>
      {name && <Text>{name}</Text>}
      {rounds && <Text>{rounds} Rounds</Text>}
      {timing && <Timing {...timing} /> }
      {repScheme && <RepScheme repScheme={repScheme} /> }
      <View>{unitsRend}</View>
      { !isEmpty(suffix) && <Text>{suffix}</Text> }
    </View>
  );
}
Cluster.propTypes = {
  timing: PropTypes.object.isRequired,
  units: PropTypes.array.isRequired,
  rounds: PropTypes.number,
  restBetweenRounds: PropTypes.object,
  notes: PropTypes.array,
}

/****************************************************
 * Workout
 ***************************************************/
const WorkoutView = ({ name, scoring, clusters, notes}) => {
  const rendClusters = clusters.map((cluster, i) => {
    return <Cluster
      key={i}
      {...cluster} />
  });
  
  console.log('notes', notes)
  
  return (
    <View style={styles.Workout}>
      <Text style={styles.name}>{name}</Text>
      <Scoring scoring={scoring} />
      <View>{rendClusters}</View>
      {notes && notes.join('\n')}
    </View>
  );
}
WorkoutView.propTypes = {
  name: PropTypes.string.isRequired,
  scoring: PropTypes.string.isRequired,
  clusters: PropTypes.array.isRequired,
  notes: PropTypes.array,
}

export default WorkoutView;
