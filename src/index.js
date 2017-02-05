import React from 'react'
import { AppRegistry, View, StyleSheet } from 'react-native'
import { ThemeProvider} from 'carbon-ui';
import theme from './theme';
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
  <ThemeProvider theme={theme}>
    <View style={styles.container}>
      <WodMeUp />
      <WebStyles />
    </View>
  </ThemeProvider>

AppRegistry.registerComponent('WodMeUp', () => StyledWodMeUp);
AppRegistry.runApplication('WodMeUp', {
  rootTag: document.getElementById('root')
});