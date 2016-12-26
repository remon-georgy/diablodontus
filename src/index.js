import React from 'react'
import { AppRegistry, View } from 'react-native'
import WodMeUp from './components/App';
import { WebStyles } from 'carbon-ui'

const StyledWodMeUp = () =>
  <View>
    <WodMeUp />
    <WebStyles />
  </View>

AppRegistry.registerComponent('WodMeUp', () => StyledWodMeUp);
AppRegistry.runApplication('WodMeUp', {
  rootTag: document.getElementById('root')
});