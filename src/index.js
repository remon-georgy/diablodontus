import { AppRegistry } from 'react-native-universal'
import WodMeUp from './components/App';

AppRegistry.registerComponent('WodMeUp', () => WodMeUp);
AppRegistry.runApplication('WodMeUp', {
  rootTag: document.getElementById('root')
});