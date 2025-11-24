import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importă ecranele (presupunem ca acestea exista in screens/)
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator pentru ecranul Explore
function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ExploreHome" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ 
            title: 'Detalii Locație', 
            headerBackTitle: 'Înapoi'
        }} 
      />
    </Stack.Navigator>
  );
}

// Tab Navigator (Meniul de Jos)
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline'; 
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'; 
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF', 
        tabBarInactiveTintColor: 'gray',
        headerShown: false, 
      })}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreStack} 
        options={{ title: 'Explorează' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Contul Meu' }} 
      />
    </Tab.Navigator>
  );
}