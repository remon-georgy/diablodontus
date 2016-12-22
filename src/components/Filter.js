import  React, {Component, PropTypes} from 'react'
import { View, StyleSheet, Switch, Text } from 'react-native'

const styles = StyleSheet.create({
   filterItem: {
     flexDirection: 'row'
   }
})

class FilterItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    onFilterChecked: PropTypes.func.isRequired
  }
  
  constructor(props) {
    super(props);
    this.onValueChanged = this.onValueChanged.bind(this)
  }

  onValueChanged(value) {
    const {id, onFilterChecked} = this.props;
    onFilterChecked(id, value);
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
  }
  
  _onValueChaned(id, value) {
    const {field, options} = this.props;
    this.props.onFilterChanged(id, value, field, options)
  }
  
  render() {
    const { options } = this.props
    const filterItems = options.map((option, i) => {
      return <FilterItem
        key={i}
        onFilterChecked={this._onValueChaned}
        {...option} />
    })
    
    return (
      <View>
        {filterItems}
      </View>
    )
  }

  static propTypes = {
    field: PropTypes.string.isRequired,
    onFilterChanged: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.bool.isRequired,
    })).isRequired,
  }
}
export default Filter