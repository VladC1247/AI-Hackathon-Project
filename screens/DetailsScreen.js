import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, Button, ActivityIndicator, Dimensions, Alert } from 'react-native';
import LocationsData from '../data/locatii.json';
import { Ionicons } from '@expo/vector-icons';
import { generateVibe } from '../utils/ai-service'; 
import { getStatusBarHeight } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route }) => {
  const { locationId } = route.params; 
  
  // LOGICA: Găsirea locației prin ID (replică logica de adăugare ID din HomeScreen)
  const location = LocationsData.map((loc, index) => ({
      ...loc,
      id: (index + 1).toString(), // Adaugă ID-ul la fel ca în HomeScreen
  })).find(loc => loc.id === locationId);

  const [currentDescription, setCurrentDescription] = useState(location ? location.short_description : '');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
      if (location) {
          setCurrentDescription(location.short_description);
      }
  }, [locationId]);

  // Funcție de navigare WhatsApp
  const handleReserve = () => {
    const url = `whatsapp://send?phone=0722123456&text=Buna ziua, doresc o rezervare la ${location.name}.`;
    Linking.openURL(url).catch(() => {
        Alert.alert("Eroare", "Vă rugăm să instalați aplicația WhatsApp.");
    });
  };

  // Functia pentru AI Magic (Generarea Vibe-ului)
  const handleGenerateVibe = async () => {
    if (isLoadingAI) return;
    setIsLoadingAI(true);
    
    const newVibe = await generateVibe(location.name, location.short_description);
    
    if (newVibe && !newVibe.includes("Eroare")) {
        setCurrentDescription(newVibe);
    } else {
        Alert.alert("Eroare AI", newVibe); 
    }
    setIsLoadingAI(false);
  };
  
  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Locația nu a fost găsită.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: location.image_url }} 
        style={styles.image} 
      />

      <View style={styles.detailsBox}>
        <Text style={styles.name}>{location.name}</Text>
        
        <View style={styles.ratingRow}>
            <Ionicons name="star" size={20} color="#FFC107" />
            <Text style={styles.ratingText}>{location.rating.toFixed(1)} / 5</Text>
        </View>

        <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#666" style={{marginRight: 5}} />
            <Text style={styles.address}>{location.address}</Text>
        </View>

        {/* Butonul AI Magic */}
        <View style={styles.buttonContainer}>
            <Button 
                title={isLoadingAI ? "Se Generează Vibe..." : "✨ Generează Descriere Vibe (AI Magic)"} 
                onPress={handleGenerateVibe} 
                disabled={isLoadingAI}
                color={isLoadingAI ? 'gray' : '#007AFF'}
            />
            
            {isLoadingAI && <ActivityIndicator size="small" color="#007AFF" style={{marginTop: 10}} />}
        </View>
        
        {/* Descriere */}
        <Text style={styles.sectionTitle}>Descriere Vibe</Text>
        <Text style={styles.description}>{currentDescription}</Text>
        
        <View style={styles.reserveButton}>
            {/* Buton Rezervă (WhatsApp) */}
            <Button 
                title="📲 Rezervă (WhatsApp)" 
                onPress={handleReserve} 
                color="#25D366" // Verde WhatsApp
            />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: getStatusBarHeight(),
  },
  image: {
    width: width,
    height: width * 0.7, 
  },
  detailsBox: {
    padding: 20,
    marginTop: -20, 
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 5,
    color: '#FFC107',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 15,
  },
  reserveButton: {
      marginTop: 20,
      marginBottom: 30,
  }
});

export default DetailsScreen;