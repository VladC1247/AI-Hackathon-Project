import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// eslint-disable-next-line import/no-unresolved
import { OPENROUTER_API_KEY } from '@env';

export default function DetailsScreen({ route }) {
  const { location } = route.params;
  const [description, setDescription] = useState(location.short_description);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBookPress = () => {
    const phoneNumber = '40700000000';
    const message = `Hello! I would like to make a reservation at ${location.name}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed or cannot be opened.');
      }
    });
  };

  const handleGenerateVibe = async () => {
    setIsGenerating(true);
    const prompt = `You are a local Romanian tourism expert. Write a detailed, engaging description (100-150 words) for "${location.name}" located at ${location.address}.

Include specific details about:
- Signature dishes or menu highlights (if it's a restaurant/cafe)
- Coffee quality and specialty drinks (if applicable)
- Service quality and staff friendliness
- Ambiance and atmosphere
- Best times to visit
- What makes this place unique and special
- Popular items or experiences visitors shouldn't miss

Make it sound authentic, inviting, and use a friendly, enthusiastic tone. Add relevant emojis to make it more engaging. Focus on creating a "vibe" that makes people want to visit.

Current description: "${location.short_description}"`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'X-Title': 'AI-Hackathon-App',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (response.ok && data.choices && data.choices[0] && data.choices[0].message) {
        setDescription(data.choices[0].message.content.trim());
      } else {
        Alert.alert('Error', 'Could not generate description. Please try again.');
        console.error('OpenRouter API Error:', data);
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or API issue.');
      console.error('Generate Vibe Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: location.image_url }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{location.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{location.rating}</Text>
          </View>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.address}>{location.address}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity
          style={[styles.aiButton, isGenerating && styles.aiButtonDisabled]}
          onPress={handleGenerateVibe}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.aiButtonText}>Generate Vibe Description</Text>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
          <Ionicons name="logo-whatsapp" size={24} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.bookButtonText}>Book via WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 20,
  },
  aiButton: {
    flexDirection: 'row',
    backgroundColor: '#9C27B0',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  aiButtonDisabled: {
    opacity: 0.7,
  },
  aiButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButton: {
    flexDirection: 'row',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});