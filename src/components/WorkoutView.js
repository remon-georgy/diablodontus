/**
 * @flow
 */

import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';
import {isEmpty, reduce} from 'lodash';

// TODO refactor
export const Unit = ({rx, notes, movement}) => {
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
  const rndr = parts.join(' ');
  
  return <Text>{rndr}</Text>;
}
Unit.propTypes = {
  rx: PropTypes.object,
  movement: PropTypes.object,
  notes: PropTypes.array
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

  return (
    <Text>
      {parts.join(' ')}
    </Text>
  )
}
FixedCyclesTiming.propTypes = {
  alias: PropTypes.string,
  deathBy: PropTypes.bool,
  time: PropTypes.number.isRequired,
  cycles: PropTypes.number
}

/****************************************************
 * Workout -> Cluster -> Timing -> CappedTiming
 ***************************************************/
const CappedTiming = ({alias, time}) => {
  let parts = alias ? [alias] : ['In', time / 60, 'minutes']
  
  return (
     <Text>
       {parts.join(' ')}
     </Text>
   )
}
CappedTiming.propTypes = {
  alias: PropTypes.string,
  time: PropTypes.number.isRequired
}

/****************************************************
 * Workout -> Cluster -> Timing
 ***************************************************/
const Timing = ({type, ...rest}) => {
  let output
  switch (type) {
    //////////////////
    // TODO IF THER'S AN ALIAS, DISPLAY IT THEN RETURN EARLY
    // TODO don't check for alias in timing Components
    ////////////////////
    
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
RepScheme.propTypes = {
  repScheme: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
    React.PropTypes.shape({
      init: React.PropTypes.number.isRequired,
      step: React.PropTypes.number.isRequired,
      end: React.PropTypes.number
    }),
  ]).isRequired,
}

/****************************************************
 * Workout -> Cluster
 ***************************************************/
const Cluster = ({name, timing, units, rounds, builtinRest, repScheme, notes}) => {
  const unitsRend = units.map((unit, u) => {
    return (
      <Unit key={u} {...unit}/>
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
  name: PropTypes.string,
  timing: PropTypes.object.isRequired,
  units: PropTypes.array.isRequired,
  rounds: PropTypes.number,
  builtinRest: PropTypes.object,
  notes: PropTypes.array,
  repScheme: PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.array,
    React.PropTypes.shape({
      init: React.PropTypes.number.isRequired,
      step: React.PropTypes.number.isRequired,
      end: React.PropTypes.number
    }),
  ])
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
    <View>
      <Text>{name}</Text>
      <Scoring scoring={scoring} />
      <View>{rendClusters}</View>
      {notes &&
        <Text>{notes.join('\n')}</Text>
      }
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
