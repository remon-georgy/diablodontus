import  React, {Component, PropTypes} from 'react'
import { View, StyleSheet, Switch, Text } from 'react-native'

const styles = StyleSheet.create({
   filterItem: {
     flexDirection: 'row'
   }
})

class FilterItem extends Component {
  static propTypes = {
    _id: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onFilterChecked: PropTypes.func.isRequired
  }
  
  constructor(props) {
    super(props);
    this.onValueChanged = this.onValueChanged.bind(this)
  }

  onValueChanged(value) {
    const {_id, onFilterChecked} = this.props;
    onFilterChecked(_id, value);
  }
  
  render() {
    const {name, value} = this.props;
    return (
      <View style={styles.filterItem}>
        <Switch
          value={value}
          onValueChange={this.onValueChanged}
        />
        <Text>{name}</Text>
      </View>
    )
  }
}

class Filter extends Component {
  constructor(props, state) {
    super(props, state);
    this._onValueChaned = this._onValueChaned.bind(this)
    this._onAllValueChanged = this._onAllValueChanged.bind(this)
    this.state = {
      all: true
    }
  }
  
  _onValueChaned(_id, value) {
    const {field, options} = this.props;
    this.props.onFilterChanged(_id, value, field, options)
  }
  
  _onAllValueChanged(_id, value) {
    const {field, options} = this.props;
    this.setState({all: value})
    this.props.onFilterAllChanged(value, field, options)
  }
  
  render() {
    const { options } = this.props
    const filterItems = options.map((option, i) => {
      return <FilterItem
        key={i}
        {...option}
        onFilterChecked={this._onValueChaned}
             />
    })
    
    return (
      <View>
        <FilterItem
          _id='all'
          name='Check All'
          value={this.state.all}
          onFilterChecked={this._onAllValueChanged}
        />
        <View>
          {filterItems}
        </View>
      </View>
    )
  }

  static propTypes = {
    field: PropTypes.string.isRequired,
    onFilterChanged: PropTypes.func.isRequired,
    onFilterAllChanged: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.bool.isRequired,
    })).isRequired,
  }
}
export default Filter