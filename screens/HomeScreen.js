import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import LocationCard from '../components/LocationCard';
import locationsData from '../data/locations.json';

export default function HomeScreen() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setLocations(locationsData);
  }, []);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'map' : 'list');
  };

  const handleLocationPress = (location) => {
    navigation.navigate('Details', { location });
  };

  const renderListItem = ({ item }) => (
    <LocationCard location={item} onPress={() => handleLocationPress(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Locations</Text>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleViewMode}>
          <Ionicons 
            name={viewMode === 'list' ? 'map' : 'list'} 
            size={24} 
            color="#2196F3" 
          />
          <Text style={styles.toggleText}>
            {viewMode === 'list' ? 'Map View' : 'List View'}
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={locations}
          renderItem={renderListItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 46.0, // Center of Romania roughly
              longitude: 25.0,
              latitudeDelta: 5.0,
              longitudeDelta: 5.0,
            }}
          >
             <UrlTile
                urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
                flipY={false}
              />
            {locations.map((location, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: location.coordinates.lat,
                  longitude: location.coordinates.long,
                }}
                title={location.name}
                description={location.short_description}
                onCalloutPress={() => handleLocationPress(location)}
              />
            ))}
          </MapView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleText: {
    marginLeft: 6,
    color: '#2196F3',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});