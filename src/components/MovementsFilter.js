import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  View,
  Switch,
  Text
} from 'react-native';

const styles = StyleSheet.create({
   movementsFilter: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     
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
      <View>
        <Text>{name}</Text>
        <Switch
          value={value}
          onValueChange={this.onValueChanged}
        />
      </View>
    )
  }
}

const MovementsFilter = ({onFilterChecked, movements}) => {
  const filterItems = movements.map((movement, i) => {
    return <FilterItem
      key={i}
      onFilterChecked={onFilterChecked}
      {...movement} />
  })
  
  return (
    <View style={styles.movementsFilter}>
      {filterItems}
    </View>
  )
}
MovementsFilter.propTypes = {
  onFilterChecked: PropTypes.func.isRequired,
  movements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
  })).isRequired
}

export default MovementsFilter;