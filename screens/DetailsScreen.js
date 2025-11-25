import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert, Modal, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// eslint-disable-next-line import/no-unresolved
import { OPENROUTER_API_KEY } from '@env';
import { useAuth } from '../context/AuthContext';
import { checkFavorite, toggleFavorite, addReview, getLocationReviews } from '../utils/database';

export default function DetailsScreen({ route }) {
  const { location } = route.params;
  const { user } = useAuth();
  const [description, setDescription] = useState(location.short_description);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Favorites & Reviews state
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (user) {
      checkFavorite(user.id, location.id).then(setIsFavorite);
    }
    loadReviews();
  }, [user, location.id]);

  const loadReviews = async () => {
    const data = await getLocationReviews(location.id);
    setReviews(data);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add favorites');
      return;
    }
    const result = await toggleFavorite(user.id, location.id);
    if (result !== null) {
      setIsFavorite(result);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add reviews');
      return;
    }
    if (!newComment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }

    const success = await addReview(user.id, location.id, newRating, newComment);
    if (success) {
      Alert.alert('Success', 'Review added!');
      setNewComment('');
      setNewRating(5);
      setShowReviewModal(false);
      loadReviews();
    } else {
      Alert.alert('Error', 'Could not add review');
    }
  };

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

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image 
          source={{ uri: item.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }} 
          style={styles.reviewAvatar} 
        />
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUserName}>{item.user_name}</Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, i) => (
              <Ionicons 
                key={i} 
                name={i < item.rating ? "star" : "star-outline"} 
                size={14} 
                color="#FFD700" 
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={{ uri: location.image_url }} style={styles.image} />
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{location.name}</Text>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={28} 
                color={isFavorite ? "#f44336" : "#666"} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{location.rating}</Text>
            </View>
            <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
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
          
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity onPress={() => setShowReviewModal(true)}>
              <Text style={styles.addReviewText}>+ Add Review</Text>
            </TouchableOpacity>
          </View>

          {reviews.length > 0 ? (
            reviews.map((item, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image 
                    source={{ uri: item.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }} 
                    style={styles.reviewAvatar} 
                  />
                  <View style={styles.reviewUserInfo}>
                    <Text style={styles.reviewUserName}>{item.user_name}</Text>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons 
                          key={i} 
                          name={i < item.rating ? "star" : "star-outline"} 
                          size={14} 
                          color="#FFD700" 
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{item.comment}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noReviewsText}>No reviews yet. Be the first!</Text>
          )}

          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
            <Ionicons name="logo-whatsapp" size={24} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.bookButtonText}>Book via WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingInputContainer}>
              <Text style={styles.ratingLabel}>Rating:</Text>
              <View style={styles.starsInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                    <Ionicons 
                      name={star <= newRating ? "star" : "star-outline"} 
                      size={32} 
                      color="#FFD700" 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Share your experience..."
              multiline
              numberOfLines={4}
              value={newComment}
              onChangeText={setNewComment}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  favoriteButton: {
    padding: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  reviewCount: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
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
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
  reviewRating: {
    flexDirection: 'row',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingInputContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  starsInput: {
    flexDirection: 'row',
    gap: 8,
  },
  commentInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    height: 100,
    marginBottom: 20,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});