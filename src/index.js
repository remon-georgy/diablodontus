import React from 'react'
import { AppRegistry, View, StyleSheet } from 'react-native'
import WodMeUp from './components/App';
import './index.css'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

// Carbon UI
import 'babel-polyfill'
import { WebStyles } from 'carbon-ui'

const StyledWodMeUp = () =>
  <View style={styles.container}>
    <WodMeUp />
    <WebStyles />
  </View>

AppRegistry.registerComponent('WodMeUp', () => StyledWodMeUp);
AppRegistry.runApplication('WodMeUp', {
  rootTag: document.getElementById('root')
});