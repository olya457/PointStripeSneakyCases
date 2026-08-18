import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { MainNavigator } from './src/navigation/MainNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0f1e5a" />
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
