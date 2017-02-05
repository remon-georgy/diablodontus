import React, { PropTypes } from 'react';
import { Text } from 'react-native';
import {isEmpty, reduce, has} from 'lodash';
import { Card, CardTitle, CardText} from 'carbon-ui'

// TODO refactor
export const Unit = ({rx, notes, movement}) => {
  let parts = [movement.name];
  
  if(has(rx, 'reps') && typeof rx.reps === 'string' && rx.reps.indexOf('./') > -1) {
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
 * Workout -> Cluster -> Timing -> FixedCyclesTiming
 ***************************************************/
const FixedCyclesTiming = ({deathBy, time, cycles}) => {
  let parts = []
  const cycle = (time % 60 > 0) ?
    `${time} seconds`:
    `${time / 60} minutes`
  parts.push(cycles)
  parts.push('cycles of ')
  parts.push(cycle)
  parts.push('each')
  if (deathBy) {
    parts.push('(Score is total number of completed cycles, plus number of reps completed in first incomplete cycle.)')
  }

  return (
    <Text>
      {parts.join(' ') + '\n'}
    </Text>
  )
}
FixedCyclesTiming.propTypes = {
  deathBy: PropTypes.bool,
  time: PropTypes.number.isRequired,
  cycles: PropTypes.number
}

/****************************************************
 * Workout -> Cluster -> Timing -> CappedTiming
 ***************************************************/
const CappedTiming = ({time}) => {
  let parts = ['In', time / 60, 'minutes']
  
  return (
     <Text>
       {parts.join(' ') + '\n'}
     </Text>
   )
}
CappedTiming.propTypes = {
  time: PropTypes.number.isRequired
}

/****************************************************
 * Workout -> Cluster -> Timing
 ***************************************************/
const Timing = ({type, alias, ...rest}) => {
  let output
  if (alias) {
    return <Text>{alias}{'\n'}</Text>
  }
  switch (type) {
    case 'FixedCycles':
      output = <FixedCyclesTiming {...rest} />
      break;
      
    case 'Capped':
      output = <CappedTiming {...rest} />
      break;
    
    default:
      output = null
  }
  return output;
}
Timing.propTypes = {
  alias: PropTypes.string,
  type: PropTypes.string.isRequired
}

/****************************************************
 * Workout -> Cluster -> RepScheme
 ***************************************************/
const RepScheme = ({repScheme}) => {
  if (Array.isArray(repScheme)) {
    return <Text>{repScheme.join(', ') + ' reps'}{'\n'}</Text>
  }
  else if (typeof repScheme === 'string') {
    return <Text>{repScheme}{'\n'}</Text>
  }
  else if (typeof repScheme === 'object' && repScheme !== null) {
    var {init, step, end = 10} = repScheme
    let reps = [init]
    for (let i = 1; i < end; i++) {
      reps.push(init + i*step);
    }
    
    return <Text>{reps.join(', ') + '...etc'}{'\n'}</Text>;
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
      <Text key={u}><Unit {...unit}/>{'\n'}</Text>
    );
  });
  
  let suffix
  if (builtinRest) {
    const {value, unit, between} = builtinRest
    suffix = `Rest ${value} ${unit} between ${between}`
  }

  return (
    <Text>
      {name && <Text>name{'\n'}</Text>}
      {/* @FIXME remove this condition */}
      {timing && timing.type !== 'TimedUnits' && <Timing {...timing} />}

      {rounds && <Text>{rounds} Rounds{'\n'}</Text>}
      {repScheme && <RepScheme repScheme={repScheme} /> }
      {unitsRend}
      { !isEmpty(suffix) && <Text>{suffix}{'\n'}</Text> }
    </Text>
  );
}
Cluster.propTypes = {
  name: PropTypes.string,
  timing: PropTypes.object,
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
const WorkoutView = ({ name, scoring, clusters, notes, style}) => {
  const rendClusters = clusters.map((cluster, i) => {
    return <Cluster
      key={i}
      {...cluster} />
  });
  
  const cardProps = { title: name };
  if (scoring) {
    cardProps.subtitle = `For ${scoring}`;
  }
  
  return (
    <Card style={style}>
      <CardTitle {...cardProps} />
      <CardText>
        {rendClusters}
        {notes &&
          <Text>{notes.join('\n')}</Text>
        }
      </CardText>
    </Card>
  );
}
WorkoutView.propTypes = {
  name: PropTypes.string.isRequired,
  scoring: PropTypes.string.isRequired,
  clusters: PropTypes.array.isRequired,
  notes: PropTypes.array,
}

export default WorkoutView;
