import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, FlatList, Platform } from 'react-native';
import LocationsData from '../data/locatii.json';
import LocationCard from '../components/LocationCard'; 
import MapView, { Marker } from 'react-native-maps'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isMapView, setIsMapView] = useState(false);
  
  // LOGICA: Adaugarea ID-ului unic la incarcare, deoarece nu exista in fisierul JSON
  const locationsWithId = useMemo(() => {
    return LocationsData.map((location, index) => ({
      ...location,
      id: (index + 1).toString(), // Atribuie un ID unic
    }));
  }, []);

  const locations = locationsWithId; 

  const renderItem = ({ item }) => (
    <LocationCard 
      location={item}
      onPress={() => navigation.navigate('Details', { locationId: item.id })} 
    />
  );
  
  const initialRegion = {
    latitude: 45.9432, 
    longitude: 24.9668,
    latitudeDelta: 5.0, 
    longitudeDelta: 5.0,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorează Locații</Text>
        <Button 
          title={isMapView ? "Afișează Listă" : "Afișează Hartă"} 
          onPress={() => setIsMapView(!isMapView)} 
          color={Platform.OS === 'ios' ? '#007AFF' : '#2196F3'} 
        />
      </View>
      
      <View style={styles.content}>
        {isMapView ? (
          // Map View
          <MapView 
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
          >
            {locations.map((location) => (
              <Marker
                key={location.id}
                coordinate={{
                  latitude: location.coordinates.lat, 
                  longitude: location.coordinates.long, 
                }}
                title={location.name}
                description={location.short_description}
                onPress={() => navigation.navigate('Details', { locationId: location.id })}
              />
            ))}
          </MapView>
        ) : (
          // List View
          <FlatList
            data={locations}
            renderItem={renderItem}
            keyExtractor={item => item.id} 
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? insets.top : 0,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20, 
  },
  map: {
    flex: 1, 
  },
});

export default HomeScreen;