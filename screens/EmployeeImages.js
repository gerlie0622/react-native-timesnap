import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Button } from 'react-native';
import { dbFirestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const EmployeeImages = () => {
  const [imagesByDay, setImagesByDay] = useState({});
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 2; // Set the number of images per page

useEffect(() => {
  const fetchImages = async () => {
    try {
      // Fetch data from the 'imageDetails' collection
      const imageDetailsCollectionRef = collection(dbFirestore, 'imageDetails');
      const querySnapshot = await getDocs(imageDetailsCollectionRef);

      const imagesData = [];
      // Iterate through the documents in the 'imageDetails' collection
      querySnapshot.forEach((doc) => {
        const imageData = doc.data();

        // Push the image data to the array
        imagesData.push({
          imageURL: imageData.imageURL,
          timestamp: imageData.timestamp,
          userEmail: imageData.userEmail,
        });
      });

      // Group images by day (date without considering time)
      const groupedImagesByDay = imagesData.reduce((acc, image) => {
        const dateWithoutTime = new Date(image.timestamp).toLocaleDateString();

        if (!acc[dateWithoutTime]) {
          acc[dateWithoutTime] = [];
        }

        acc[dateWithoutTime].push(image);

        return acc;
      }, {});

      // Sort days in descending order
      const sortedDays = Object.keys(groupedImagesByDay).sort((a, b) => new Date(b) - new Date(a));

      // Set the current day index to today
      const todayIndex = sortedDays.findIndex(date => new Date(date).toLocaleDateString() === new Date().toLocaleDateString());
      setCurrentDayIndex(todayIndex !== -1 ? todayIndex : 0);

      // Create an array of images sorted by day and timestamp
      const sortedImages = sortedDays.flatMap((date) => {
        const imagesForDay = groupedImagesByDay[date].sort((a, b) => b.timestamp - a.timestamp);
        return imagesForDay;
      });

      // Set the images state
      setImagesByDay(sortedImages.reduce((acc, image) => {
        const dateWithoutTime = new Date(image.timestamp).toLocaleDateString();

        if (!acc[dateWithoutTime]) {
          acc[dateWithoutTime] = [];
        }

        acc[dateWithoutTime].push(image);

        return acc;
      }, {}));
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  fetchImages();
}, []);

  const handlePreviousPage = () => {
    if (currentDayIndex !== null) {
      const totalPages = Math.ceil(imagesByDay[Object.keys(imagesByDay)[currentDayIndex]].length / imagesPerPage);

      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      } else if (currentDayIndex < Object.keys(imagesByDay).length - 1) {
        setCurrentPage(0);
        setCurrentDayIndex(currentDayIndex + 1);
      }
    }
  };

  const handleNextPage = () => {
    if (currentDayIndex !== null) {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else if (currentDayIndex > 0) {
        const previousDayIndex = currentDayIndex - 1;
        const totalPages = Math.ceil(imagesByDay[Object.keys(imagesByDay)[previousDayIndex]].length / imagesPerPage);
        setCurrentPage(totalPages - 1);
        setCurrentDayIndex(previousDayIndex);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="<" onPress={handlePreviousPage} />
        <Button title=">" onPress={handleNextPage} />
      </View>
      {currentDayIndex !== null && Object.keys(imagesByDay).length > 0 ? (
        <View>
          {Object.keys(imagesByDay).map((date, index) => (
            <View key={date}>
              {index === currentDayIndex && (
                <FlatList
                  data={imagesByDay[date]}
                  keyExtractor={(item) => item.imageURL}
                  numColumns={2}
                  renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                      <Image style={styles.image} source={{ uri: item.imageURL }} />
                      <Text style={styles.userDetails}>{`${item.userEmail} - ${new Date(
                        item.timestamp
                      ).toLocaleString()}`}</Text>
                    </View>
                  )}
                />
              )}
            </View>
          ))}
        </View>
      ) : (
        <Text>No images found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, // Add some padding to the container
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
});

export default EmployeeImages;
