import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
// Adaugam .js explicit la final pentru a evita erori de rezolutie
import AppNavigator from './navigation/AppNavigator.js'; 

export default function App() {
  return (
    // NavigationContainer este necesar pentru functionarea tuturor componentelor de navigare
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}