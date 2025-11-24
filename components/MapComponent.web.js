import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapComponent = ({ locations, onMarkerPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🗺️ Map View</Text>
      <Text style={styles.subtext}>
        Map is only available on mobile devices.
      </Text>
      <Text style={styles.hint}>
        Please use the List View or run the app on Android/iOS to see the map.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  text: {
    fontSize: 48,
    marginBottom: 16,
  },
  subtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default MapComponent;
