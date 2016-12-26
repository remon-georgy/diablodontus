import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import WorkoutsListView from './WorkoutsListView';
import Filter from './Filter';
import deepmerge from 'deepmerge';
import { WebStyles } from 'carbon-ui'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  drawer: {
    flexDirection: 'column',
    flexGrow: 0,
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
  // FIXME get url from config
  return fetch('http://192.168.1.108:8800/sync')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
}

function selectedOptions(options) {
  return options.filter(({value}) => value).map(({id}) => id)
}

/*****************************************************
 * FILTERS
 ****************************************************/
function workoutsNameFilter(inputName) {
  return function({name}) {
    return name.toLowerCase().includes(inputName.toLowerCase());
  }
}

function applyFilter(filterKey, selectedOptions) {
  return function(workout) {
    const intersection = workout[filterKey].filter((id) => {
      return selectedOptions.indexOf(id) !== -1
    })
    return intersection.length === workout[filterKey].length;
  }
}
/*****************************************************
 * APP
 ****************************************************/
export default class WodMeUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameFilter: '',
      workouts: [],
      filters: {
        movements: [],
        equipments: [],
        tags: [],
      }
    }

    this._onChangeText = this._onChangeText.bind(this)
    this._onFilterChanged = this._onFilterChanged.bind(this)
    this._onFilterAllChanged = this._onFilterAllChanged.bind(this)
  }

  _onChangeText(value) {
    this.setState(deepmerge(this.state, {nameFilter: value}));
  }

  componentWillMount() {
    const p = syncData();

    p.then((data) => {
      let { workouts, filters } = data;
      
      let filterOptions = {}
      Object.keys(data.filters).forEach((key) => {
        filterOptions[key] = filters[key].map((option) => { return {...option, value:true}})
      })
      
      this.setState(deepmerge(this.state, {
        workouts: workouts,
        filters: filterOptions
      }));
    });
  }

  _onFilterChanged(id, value, field, options) {
    const optionsNext = this.state.filters[field].map((option) => {
      if (option.id === id) {
        option.value = value
      }
      return option
    })
    this.setState(deepmerge(this.state, {
      filters: {
        [field]: optionsNext
      }
    }));
  }

  _onFilterAllChanged(value, field, options) {
    const optionsNext = this.state.filters[field].map((option) => {
      option.value = value
      return option
    })
    this.setState(deepmerge(this.state, {
      filters: {
        [field]: optionsNext
      }
    }));
  }

  getFilteredWorkouts() {
    const {filters} = this.state

    let workoutsNext = this.state.workouts;
    if (this.state.nameFilter !== '') {
      workoutsNext = this.state.workouts.filter(workoutsNameFilter(this.state.nameFilter));
    }
    
    Object.keys(filters).forEach((key) => {
      workoutsNext = workoutsNext.filter(applyFilter(key, selectedOptions(filters[key])))
    })
    
    return workoutsNext;
    
  }

  render() {
    const filteredWorkouts = this.getFilteredWorkouts()
    const { nameFilter, filters } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.drawer}>
          <TextInput style={styles.drawerTextInput}
            value={nameFilter}
            onChangeText={this._onChangeText}
          />
          <View style={styles.drawerFiltersContainer}>
            {Object.keys(filters).map((key) =>
              <Filter
                key={key}
                field={key}
                options={filters[key]}
                style={styles.drawerFilter}
                onFilterChanged={this._onFilterChanged}
                onFilterAllChanged={this._onFilterAllChanged}
              />
            )}
          </View>
        </View>
        <WorkoutsListView workouts={filteredWorkouts} style={styles.results}/>
        <WebStyles />
      </View>
    );
  }
}