import React, {PropTypes} from 'react';
import {
  View,
  Switch,
  Text
} from 'react-native';

const FilterItem = ({label, value = true}) => {
  return (
    <View>
      <Text>{label}</Text>
      <Switch value={value}/>
    </View>
  )
}
FilterItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool,
}

const MovementsFilter = ({movements}) => {
  console.log(movements)
  const filterItems = movements.map((movement, i) => {
    return <FilterItem key={i} label={movement}/>
  })
  
  return (
    <View>
      {/* {filterItems} */}
    </View>
  )
}
MovementsFilter.propTypes = {
  movements: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default MovementsFilter;