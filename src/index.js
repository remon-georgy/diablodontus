import { AppRegistry } from 'react-native';
import WodMeUp from './components/App';

AppRegistry.registerComponent('WodMeUp', () => WodMeUp);
AppRegistry.runApplication('WodMeUp', {
  rootTag: document.getElementById('root')
});