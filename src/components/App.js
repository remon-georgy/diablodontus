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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%'
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 2,
    width: 250,
    height: 50,
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
  console.log('workoutsNameFilter', inputName)
  return function({name}) {
    return name.toLowerCase().includes(inputName.toLowerCase());
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
  }

  onChangeText(value) {
    this.setState({nameFilter: value});
  }

  componentWillMount() {
    const p = syncData();

    p.then((data) => {
      this.setState(data);
    });
  }

  getFilteredWorkouts() {
    if (this.state.nameFilter !== '') {
      console.log('Filtering by', this.state.nameFilter)
        return this.state.workouts
      .filter(workoutsNameFilter(this.state.nameFilter));
    }
    return this.state.workouts
  }

  render() {
    const filteredWorkouts = this.getFilteredWorkouts()
    const movements = this.state.movements;
    console.log(this.state)
    return (
      <View style={styles.container}>
        <View>
          <TextInput style={styles.textInput}
            value={this.state.nameFilter}
            onChangeText={this.onChangeText}
          />
        </View>
        <MovementsFilter movements={movements}/>
        <WorkoutsListView workouts={filteredWorkouts}/>

      </View>
    );
  }
}