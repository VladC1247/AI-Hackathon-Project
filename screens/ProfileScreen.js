import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/150?img=5' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.name}>Vlad Developer</Text>
        <Text style={styles.email}>vlad@ai-hackathon.ro</Text>
        <Text style={styles.status}>Status: Conectat</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#007AFF', // Culoare Accent
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#28A745', // Verde (Succes)
  }
});

export default ProfileScreen;