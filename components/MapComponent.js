import React from 'react';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

const MapComponent = ({ locations, onMarkerPress }) => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 46.0,
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
          onCalloutPress={() => onMarkerPress(location)}
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapComponent;
