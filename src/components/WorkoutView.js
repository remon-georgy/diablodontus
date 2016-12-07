/**
 * @flow
 */

import React, { PropTypes, Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {isEmpty, reduce} from 'lodash';

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
  renderableMovement({rx, notes, movement}) {
    let parts = [movement.name];

    if(rx.reps && typeof rx.reps === 'string' && rx.reps.indexOf('./') > -1) {
      const attr = rx.reps.replace('./', '')
      rx.reps = rx[attr]
      delete rx[attr]
    }

    parts = reduce(rx, (result, value, key) => {
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
        else if (typeof value === 'string') {
          result.push(value);
        }
        else {
          result.push(value);
        }
      }
      return result;
    }, parts)
    
    if (notes) {
      parts.push(`(${notes.join('. ')})`)
    }
    return parts.join(' ');
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

/****************************************************
 * Workout -> Scoring
 ***************************************************/
const Scoring = ({scoring}) => <Text>For {scoring}</Text>
Scoring.propTypes = {
  scoring: PropTypes.string.isRequired
}

/****************************************************
 * Workout -> Cluster -> Timing -> FixedCyclesTiming
 ***************************************************/
const FixedCyclesTiming = ({alias, deathBy, time, cycles}) => {
  let parts = []
  if (alias) {
    parts.push(alias)
  }
  else {
    const cycle = (time % 60 > 0) ?
      `${time} seconds`:
      `${time / 60} minutes`
    parts.push(cycles)
    parts.push('cycles of ')
    parts.push(cycle)
    parts.push('each')
  }
  if (deathBy) {
    parts.push('(Score is total number of completed cycles, plus number of reps completed in first incomplete cycle.)')
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
    parts = parts.concat(['In', timeCap / 60, 'minutes'])
  }
  
  return <Text>{parts.join(' ')}</Text>
}

/****************************************************
 * Workout -> Cluster -> Timing
 ***************************************************/
const Timing = ({type, ...rest}) => {
  let output
  switch (type) {
    // EMOM, Tabata, Fixed cycles in general
    case 'FixedCycles':
      output = <FixedCyclesTiming {...rest} />
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
    return <Text>{repScheme.join(', ') + ' reps'}</Text>
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
const Cluster = ({name, timing, units, rounds, builtinRest, repScheme, notes}) => {
  const unitsRend = units.map((unit, u) => {
    return (
      <WorkoutMovement key={u} unit={unit}/>
    );
  });
  
  let suffix
  if (builtinRest) {
    const {value, unit, between} = builtinRest
    suffix = `Rest ${value} ${unit} between ${between}`
  }

  return (
    <View>
      {name && <Text>{name}</Text>}
      {timing && <Timing {...timing} /> }
      {rounds && <Text>{rounds} Rounds</Text>}
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
  builtinRest: PropTypes.object,
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
