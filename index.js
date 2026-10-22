import 'react-native-url-polyfill/auto';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 1. TextEncoder Polyfill for Android 10+ Support
const TextEncodingPolyfill = require('text-encoding');
Object.assign(global, {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
});

// 2. Ignore Specific Warnings (Optional)
LogBox.ignoreLogs(['Warning: ...']);


AppRegistry.registerComponent(appName, () => App);
