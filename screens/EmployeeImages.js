import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { dbFirestore } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const EmployeeImages = () => {
  const [images, setImages] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  const fetchImages = async () => {
    try {
      let imageDetailsCollectionRef = collection(dbFirestore, 'imageDetails');
      let querySnapshot;

      if (searchDate) {
        // If searchDate is provided, add a filter to query documents with the specified date
        const dateFilter = where('timestamp', '>=', new Date(searchDate).setHours(0, 0, 0, 0));
        querySnapshot = await getDocs(query(imageDetailsCollectionRef, dateFilter));
      } else {
        // Fetch all images if no searchDate is provided
        querySnapshot = await getDocs(imageDetailsCollectionRef);
      }

      const imagesArray = [];

      querySnapshot.forEach((doc) => {
        const imageData = doc.data();
        imagesArray.push({
          imageURL: imageData.imageURL,
          timestamp: imageData.timestamp,
          userEmail: imageData.userEmail,
        });
      });

      setImages(imagesArray);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSearch = () => {
    // Call fetchImages only when the search button is clicked
    fetchImages();
  };

  const handleReset = () => {
    // Clear the searchDate and refetch all images only if searchDate is not empty
    if (searchDate) {
      setSearchDate('');
      fetchImages();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter date (YYYY-MM-DD)"
          value={searchDate}
          onChangeText={(text) => setSearchDate(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {searchDate && images.length > 0 ? (
        <FlatList
          data={images}
          keyExtractor={(item) => item.imageURL}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item.imageURL }} />
              <Text style={styles.userDetails}>{`${item.userEmail} - ${new Date(item.timestamp).toLocaleString()}`}</Text>
            </View>
          )}
        />
      ) : searchDate && images.length === 0 ? (
        <Text>No images found for the selected date</Text>
      ) : (
        <Text>Please enter a date to search</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  imageContainer: {
    marginBottom: 20,
    marginRight: 10,
  },
  image: {
    width: 500,
    height: 400,
    borderRadius: 10,
  },
  userDetails: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  resetButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default EmployeeImages;
