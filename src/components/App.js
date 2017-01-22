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
import { fromPairs }  from 'lodash'

import PouchDB from 'pouchdb'
import pouchdbFind from 'pouchdb-find';

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
  return options.filter(({value}) => value).map(({_id}) => _id)
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

  /**
   * TODO Move database connection code somwhere else.
   */
  componentWillMount() {
    PouchDB.plugin(pouchdbFind)
    PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default)
  
    // TODO configure
    const url = 'http://0.0.0.0:9000'
    const _component = this;
    const remoteDB = PouchDB(`${url}/wodmeup`);
    const localDB = PouchDB('wodmeup')
    PouchDB.replicate(remoteDB, localDB, {live: true, retry: true})
      .on('change', function (info) {
        console.log(info)
      }).on('paused', function (err) {
        console.log(err)
      }).on('active', function () {
        console.log('active')
      }).on('denied', function (err) {
        console.log(err)
      }).on('complete', function (info) {
        console.log(info)
      }).on('error', function (err) {
        console.log(err)
    });

    localDB.find({selector: {type: 'workout'}})
      .then((result) => {
        let promises = [
          localDB.find({
            selector: {type: 'movement'},
            fields: ['_id', 'name', 'equipment'],
          }),
          localDB.find({
            selector: {type: 'equipment'},
            fields: ['_id', 'name'],
          }),
          localDB.find({
            selector: {type: 'tag'},
            fields: ['_id', 'name'],
          })
        ]
        
        Promise.all(promises).then(values => {
          values = values.map(collection => collection.docs.map(doc => {
            doc.value = true;
            return doc;
          }))
          // Prepare filter options
          const [movements, equipments, tags] = values;
          this.setState({
            filters: {movements, equipments, tags}
          });
          // Prepare metadata maps
          let movementsMap = fromPairs(movements.map(mvmt => {
            return [mvmt._id, mvmt]
          }))
          
          let workouts = result.docs;
          workouts.map((workout) => {
            workout.movements = [];
            workout.equipments = [];
      
            workout.clusters.map((cluster) => {
              cluster.timing = cluster.timing || {type: 'NoTiming'}
              cluster.units.map((unit) => {
                workout.movements.push(unit.movement)
                const movement = movementsMap[unit.movement]
                unit.movement = movement
                workout.equipments = workout.equipments.concat(movement.equipment)
                return unit
              })
              return cluster
            })
            return workout;
          })
          _component.setState(deepmerge(_component.state, {workouts: workouts}));
      
        })
        .catch((err) => console.log(err))
    })
  }

  _onFilterChanged(id, value, field, options) {
      const optionsNext = this.state.filters[field].map((option) => {
      if (option._id === id) {
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
      const selected =  selectedOptions(filters[key])
      workoutsNext = workoutsNext.filter(applyFilter(key, selected))
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