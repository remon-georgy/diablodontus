import { AppRegistry } from 'react-native';
import WodMeUp from './src/components/App'
import matchMedia from 'react-native-match-media'
// Only for native, will already be set on web
global.matchMedia = matchMedia

AppRegistry.registerComponent('WodMeUp', () => WodMeUp);