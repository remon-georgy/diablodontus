import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import WorkoutsListView from './WorkoutsListView';
import Filter from './Filter';

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

function workoutsTagsFilter(selectedTags) {
  return function({tags}) {
    const intersection = tags.filter((id) => {
      return selectedTags.indexOf(id) !== -1
    })
    return intersection.length === tags.length;
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

    this._onChangeText = this._onChangeText.bind(this)
    this._onMovementFilterChecked = this._onMovementFilterChecked.bind(this)
    this._onEquipmentFilterChecked = this._onEquipmentFilterChecked.bind(this)
    this._onFilterChanged = this._onFilterChanged.bind(this)
  }

  _onChangeText(value) {
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
      tags = data.tags.map((tag) => {
        return {
          ...tag,
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
  
  _onFilterChanged(id, value, field, options) {
    const optionsNext = this.state[field].map((option) => {
      if (option.id === id) {
        option.value = value
      }
      return option
    })
    this.setState({options: optionsNext});
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
    
    let selectedTags = this.state.tags
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
    workoutsNext = workoutsNext.filter(workoutsEquipmentsFilter(selectedEquipments))
    workoutsNext = workoutsNext.filter(workoutsTagsFilter(selectedTags))
    return workoutsNext;
    
  }

  render() {
    const filteredWorkouts = this.getFilteredWorkouts()
    const { movements, equipments, tags } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.drawer}>
          <TextInput style={styles.drawerTextInput}
            value={this.state.nameFilter}
            onChangeText={this._onChangeText}
          />

          <View style={styles.drawerFiltersContainer}>
            <Filter
              field='movements'
              options={movements}
              style={styles.drawerFilter}
              onFilterChanged={this._onFilterChanged}
            />
            <Filter
              field='equipments'
              options={equipments}
              style={styles.drawerFilter}
              onFilterChanged={this._onFilterChanged}
            />
            <Filter
              field='tags'
              options={tags}
              style={styles.drawerFilter}
              onFilterChanged={this._onFilterChanged}
            />
          </View>
        </View>
        <WorkoutsListView workouts={filteredWorkouts} style={styles.results}/>
      </View>
    );
  }
}