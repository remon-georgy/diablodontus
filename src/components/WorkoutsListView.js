import React, { Component } from 'react';
import { ListView, Text } from 'react-native';
import WorkoutView from './WorkoutView';

export default class WorkoutsListView extends Component {

  constructor(props) {
    super(props);
    var _component = this;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      scrollEnabled: true
    };
    
    const p = _component.getWorkouts();
    
    p.then((jsonData) => {
      _component.setState({
        dataSource: ds.cloneWithRows(jsonData),
      });
    });

    // TODO
    // this.newFunction = this.newFunction.bind(this);
  }
  
  getWorkouts() {
    return fetch('/workouts')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  _renderRow(rowData) {
    return (
       <WorkoutView workout={rowData}/>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
    );
  }
}