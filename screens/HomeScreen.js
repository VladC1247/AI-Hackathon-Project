import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, StatusBar, TextInput, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import LocationCard from '../components/LocationCard';
import MapComponent from '../components/MapComponent';
import locationsData from '../data/locatii.json';

export default function HomeScreen() {
  const [viewMode, setViewMode] = useState('list');
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  
  const navigation = useNavigation();

  // Extract county from address (3rd parameter after splitting by comma)
  const getCountyFromAddress = (address) => {
    const parts = address.split(',').map(p => p.trim());
    return parts.length >= 3 ? parts[2] : parts[parts.length - 1];
  };

  // Get unique counties from locations
  const getUniqueCounties = () => {
    const counties = locations.map(loc => getCountyFromAddress(loc.address));
    return ['All', ...new Set(counties)].sort();
  };

  useEffect(() => {
    setLocations(locationsData);
    setFilteredLocations(locationsData);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCounty, selectedRating, locations]);

  const applyFilters = () => {
    let filtered = [...locations];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // County filter
    if (selectedCounty !== 'All') {
      filtered = filtered.filter(loc => getCountyFromAddress(loc.address) === selectedCounty);
    }

    // Rating filter
    if (selectedRating !== 'All') {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(loc => loc.rating >= minRating);
    }

    setFilteredLocations(filtered);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'list' ? 'map' : 'list');
  };

  const handleLocationPress = (location) => {
    navigation.navigate('Details', { location });
  };

  const clearFilters = () => {
    setSelectedCounty('All');
    setSelectedRating('All');
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCounty !== 'All') count++;
    if (selectedRating !== 'All') count++;
    return count;
  };

  const renderListItem = ({ item }) => (
    <LocationCard location={item} onPress={() => handleLocationPress(item)} />
  );

  const counties = getUniqueCounties();
  const ratings = ['All', '4.0', '4.5', '4.7'];

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
            {viewMode === 'list' ? 'Map' : 'List'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={20} color="#667eea" />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
        </Text>
        {getActiveFiltersCount() > 0 && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={filteredLocations}
          renderItem={renderListItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No locations found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          <MapComponent 
            locations={filteredLocations} 
            onMarkerPress={handleLocationPress}
          />
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* County Filter */}
              <Text style={styles.filterLabel}>County</Text>
              <View style={styles.filterOptions}>
                {counties.map(county => (
                  <TouchableOpacity
                    key={county}
                    style={[
                      styles.filterChip,
                      selectedCounty === county && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedCounty(county)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedCounty === county && styles.filterChipTextActive
                    ]}>
                      {county}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Rating Filter */}
              <Text style={styles.filterLabel}>Minimum Rating</Text>
              <View style={styles.filterOptions}>
                {ratings.map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.filterChip,
                      selectedRating === rating && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedRating(rating)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedRating === rating && styles.filterChipTextActive
                    ]}>
                      {rating === 'All' ? 'All' : `${rating}+ ⭐`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 12,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#667eea',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  mapContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});