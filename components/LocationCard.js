import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Functie ajutatoare pentru a afisa ratingul ca stele
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const stars = [];
  
  for (let i = 0; i < 5; i++) {
    let iconName = 'star-outline';
    if (i < fullStars) {
      iconName = 'star';
    } else if (i === fullStars && (rating - fullStars) >= 0.5) {
      iconName = 'star-half';
    }

    stars.push(
      <Ionicons 
        key={i} 
        name={iconName} 
        size={16} 
        color="#FFC107" // Galben Auriu
        style={styles.starIcon} 
      />
    );
  }
  return <View style={styles.starContainer}>{stars}</View>;
};


const LocationCard = ({ location, onPress }) => {
  const { name, address, rating, image_url } = location;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        style={styles.image} 
        source={{ uri: image_url }} 
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.address} numberOfLines={1}>{address}</Text>
        <View style={styles.ratingRow}>
          {renderStars(rating)}
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text> 
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: width * 0.5, 
    backgroundColor: '#eee',
  },
  infoContainer: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginRight: 1,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
    color: '#333',
  },
});

export default LocationCard;