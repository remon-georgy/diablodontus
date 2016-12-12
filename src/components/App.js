import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import WorkoutsListView from './WorkoutsListView';
import MovementsFilter from './MovementsFilter'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  drawer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
  },
  results: {
    flexDirection: 'column',
    flex: 2,
    alignItems: 'flex-start',
  },
  textInput: {
    borderBottomWidth: 2,
    fontSize: 30
  }
});

/*****************************************************
 * UTILITIES
 ****************************************************/
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

function syncData() {
  return fetch('/sync')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
}

/*****************************************************
 * FILTERS
 ****************************************************/
function workoutsNameFilter(inputName) {
  return function({name}) {
    return name.toLowerCase().includes(inputName.toLowerCase());
  }
}

function workoutsMovementsFilter(selectedMovements) {
  return function({movements}) {
    const intersection = movements.filter((id) => {
      return selectedMovements.indexOf(id) !== -1
    })
    return intersection.length === movements.length;
  }
}

/*****************************************************
 * APP
 ****************************************************/
export default class WodMeUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workouts: [],
      movements: [],
      nameFilter: '',
    }

    this.onChangeText = this.onChangeText.bind(this)
    this._onFilterChecked = this._onFilterChecked.bind(this)
  }

  onChangeText(value) {
    this.setState({nameFilter: value});
  }

  componentWillMount() {
    const p = syncData();

    p.then((data) => {
      let { workouts, movements } = data;
      movements = data.movements.map((movement) => {
        return {
          ...movement,
          value: true,
        }
      });
      this.setState({
        workouts: workouts,
        movements: movements
      });
    });
  }

  _onFilterChecked(id, value) {
    const movementsNext = this.state.movements.map((movement) => {
      if (movement.id === id) {
        movement.value = value
      }
      return movement
    })
    this.setState({movements: movementsNext});
  }

  getFilteredWorkouts() {
    let selectedMovements = this.state.movements
    .filter(({value}) => {
      return value;
    })
    .map(({id}) => {
      return id
    });
    
    let workoutsNext = this.state.workouts;
    if (this.state.nameFilter !== '') {
      workoutsNext = this.state.workouts.filter(workoutsNameFilter(this.state.nameFilter));
    }
    workoutsNext = workoutsNext.filter(workoutsMovementsFilter(selectedMovements))
    return workoutsNext;
  }

  render() {
    const filteredWorkouts = this.getFilteredWorkouts()
    const movements = this.state.movements;
    return (
      <View style={styles.container}>
        <View style={styles.drawer}>
          <TextInput style={styles.textInput}
            value={this.state.nameFilter}
            onChangeText={this.onChangeText}
          />
          <MovementsFilter
            movements={movements}
            onFilterChecked={this._onFilterChecked}
          />
        </View>
        <WorkoutsListView workouts={filteredWorkouts} style={styles.results}/>
      </View>
    );
  }
}