import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { dbFirestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const EmployeeImages = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch data from the 'imageDetails' collection
        const imageDetailsCollectionRef = collection(dbFirestore, 'imageDetails');
        const querySnapshot = await getDocs(imageDetailsCollectionRef);

        const imagesArray = [];

        // Iterate through the documents in the 'imageDetails' collection
        querySnapshot.forEach((doc) => {
          const imageData = doc.data();

          // Push the image data to the array
          imagesArray.push({
            imageURL: imageData.imageURL,
            timestamp: imageData.timestamp,
            userEmail: imageData.userEmail,
          });
        });

        // Set the state with the array of images
        setImages(imagesArray);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <FlatList
          data={images}
          keyExtractor={(item) => item.imageURL}
          numColumns={2} // Set the number of columns to 2
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: item.imageURL }} />
              <Text style={styles.userDetails}>{`${item.userEmail} - ${new Date(item.timestamp).toLocaleString()}`}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No images found</Text>
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
  imageContainer: {
    marginBottom: 20,
    marginRight: 10, // Add margin to create space between columns
  },
  image: {
    width: 500, // Use 100% width to fill the container
    height: 400, // Set the height as needed
    borderRadius: 10,
  },
  userDetails: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
});

export default EmployeeImages;
