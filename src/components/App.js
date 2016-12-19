import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import WorkoutsListView from './WorkoutsListView';
import { MovementsFilter, EquipmentsFilter } from './Filters'


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  drawer: {
    flexDirection: 'column',
    flexGrow: 0
  },
  results: {
    flexDirection: 'column',
    flexGrow: 1,
    flexBasis: 200,
  },
  drawerFilter: {
    flexGrow: 0,
  },
  drawerFiltersContainer: {
    flexDirection: 'row',
    flexGrow: 0,
  },
  drawerTextInput: {
    flexGrow: 0,
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

function workoutsEquipmentsFilter(selectedEquipments) {
  return function({equipments}) {
    const intersection = equipments.filter((id) => {
      return selectedEquipments.indexOf(id) !== -1
    })
    return intersection.length === equipments.length;
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
      equipments: [],
      tags: [],
      nameFilter: '',
    }

    this.onChangeText = this.onChangeText.bind(this)
    this._onMovementFilterChecked = this._onMovementFilterChecked.bind(this)
    this._onEquipmentFilterChecked = this._onEquipmentFilterChecked.bind(this)
  }

  onChangeText(value) {
    this.setState({nameFilter: value});
  }

  componentWillMount() {
    const p = syncData();

    p.then((data) => {
      let { workouts, movements, equipments, tags } = data;
      movements = data.movements.map((movement) => {
        return {
          ...movement,
          value: true,
        }
      });
      equipments = data.equipments.map((equipment) => {
        return {
          ...equipment,
          value: true,
        }
      });
      this.setState({
        workouts: workouts,
        movements: movements,
        equipments: equipments,
        tags: tags,
      });
      
    });
  }

  _onMovementFilterChecked(id, value) {
    const movementsNext = this.state.movements.map((movement) => {
      if (movement.id === id) {
        movement.value = value
      }
      return movement
    })
    this.setState({movements: movementsNext});
  }
  
  _onEquipmentFilterChecked(id, value) {
    const equipmentNext = this.state.equipments.map((equipment) => {
      if (equipment.id === id) {
        equipment.value = value
      }
      return equipment
    })
    this.setState({equipments: equipmentNext});
  }

  getFilteredWorkouts() {

    let selectedMovements = this.state.movements
    .filter(({value}) => {
      return value;
    })
    .map(({id}) => {
      return id
    });

    let selectedEquipments = this.state.equipments
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
    console.log(workoutsNext)
    workoutsNext = workoutsNext.filter(workoutsEquipmentsFilter(selectedEquipments))
    console.log(workoutsNext)
    return workoutsNext;
    
  }

  render() {
    const filteredWorkouts = this.getFilteredWorkouts()
    const { movements, equipments } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.drawer}>
          <TextInput style={styles.drawerTextInput}
            value={this.state.nameFilter}
            onChangeText={this.onChangeText}
          />
          <View style={styles.drawerFiltersContainer}>
            <MovementsFilter
              style={styles.drawerFilter}
              movements={movements}
              onFilterChecked={this._onMovementFilterChecked}
            />
            <EquipmentsFilter
              style={styles.drawerFilter}
              equipments={equipments}
              onFilterChecked={this._onEquipmentFilterChecked}
            />
          </View>
        </View>
        <WorkoutsListView workouts={filteredWorkouts} style={styles.results}/>
      </View>
    );
  }
}