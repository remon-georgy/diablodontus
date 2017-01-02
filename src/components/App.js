import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  IconToggle,
  Dialog,
  TextField
} from 'carbon-ui'
import AppBar from './Alt/AppBar'
import WorkoutsListView from './WorkoutsListView';
import Filter from './Filter';
import deepmerge from 'deepmerge';
import { applyFilter } from '../utils/filter';
import { syncData } from '../utils/data';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  appBar: {
    flexShrink: 0,
    flexGrow: 0
  },
  drawerFilter: {
    flexGrow: 0,
    flexShrink: 0,
  },
  drawerFiltersContainer: {
    flexDirection: 'row',
    flexGrow: 0,
  },
});

/*****************************************************
 * UTILITIES
 ****************************************************/
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


/*****************************************************
 * APP
 TODO refactor into Container ( Functional )
 ****************************************************/
export default class WodMeUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameFilter: '',
      filtersDialogOpen: false,
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
    this._toggleFiltersDialog = this._toggleFiltersDialog.bind(this)
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
  
  _toggleFiltersDialog() {
    this.setState({filtersDialogOpen: !this.state.filtersDialogOpen})
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
          {/* App bar */}
          <AppBar
            // style={styles.appBar}
            title="Workouts"
            children={[
              <TextField
                key='text-field'
                singleLine
                value={nameFilter}
                onChangeText={this._onChangeText}
              />,
              <IconToggle name="filter_list"
                key='icon-toggle'
                onPress={this._toggleFiltersDialog}
              />
            ]}
          />

          {/* Results */}
          <WorkoutsListView workouts={filteredWorkouts}/>

          {/* Filters dialog */}
          <Dialog
            onOverlayPress={this._toggleFiltersDialog}
            active={this.state.filtersDialogOpen}>
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
          </Dialog>
        </View>
       
    );
  }
}