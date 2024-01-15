import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { Button } from 'react-native';
import { storage } from '../firebase';
import { getDownloadURL, uploadBytes, ref, deleteObject } from 'firebase/storage';
import { Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { addDoc, collection } from 'firebase/firestore';
import { dbFirestore } from '../firebase';
import { query, where, getDocs, deleteDoc } from 'firebase/firestore';



const CameraTake = () => {
    const [image, setImage] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [hasPermission, setHasPermission] = useState(null);
    const auth = getAuth();
    const [user, setUser] = useState(null); // Make sure to initialize with an appropriate value
    const navigation = useNavigation(); // Initialize useNavigation

    useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false, // Hide the header
        });
      }, [navigation]);


    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

        const fetchUser = async () => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user);
                }
            });
        };

        fetchUser();
    }, [auth]);

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const toggleCameraType = () => {
        setType((current) => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
    };

    const takePicture = async () => {
        try {
            if (cameraRef) {
                setisLoading(true);
                const photo = await cameraRef.takePictureAsync();
                const uploadURL = await uploadImageAsync(photo.uri);
                setImage(uploadURL);
                setisLoading(false);
            }
        } catch (error) {
            console.error('Error taking picture:', error);
            setisLoading(false);
            // Handle error appropriately, e.g., show an error message to the user
        }
    };
    
    let cameraRef;

    const uploadImageAsync = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        try {
            const storageRef = ref(storage, `Images/image-${Date.now()}`);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });

            // Upload the image to Firebase Storage
        const snapshot = await uploadBytes(storageRef, blob);

        // Get the download URL for the uploaded image
        const imageURL = await getDownloadURL(snapshot.ref);

        // Add image details to 'imageDetails' collection in Firestore
        await addDoc(collection(dbFirestore, 'imageDetails'), {
            userEmail: user.email,
            timestamp: Date.now(),
            imageURL,
        });
    
            return imageURL;
        } catch (error) {
            alert(`Error : ${error}`);
        }

        const imageDetails = {
            userEmail: user.email,
            timestamp: Date.now(),
        };

        // Upload image and user details
        await Promise.all([
            uploadBytes(storageRef, blob),
            addDoc(collection(dbFirestore, 'imageDetails'), imageDetails),
        ]);
    }

    const deleteImage = async () => {
        setisLoading(true);
        const deleteRef = ref(storage, image);
      
        try {
          // Delete the image from storage
          await deleteObject(deleteRef);
      
          // Delete the corresponding document in the 'imageDetails' collection
          const imageDetailsCollectionRef = collection(dbFirestore, 'imageDetails');
          const imageQuery = query(imageDetailsCollectionRef, where('imageURL', '==', image));
      
          const imageDetailsSnapshot = await getDocs(imageQuery);
          imageDetailsSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
      
          // Reset the image state
          setImage(null);
          setisLoading(false);
        } catch (error) {
          alert(`Error: ${error}`);
          setisLoading(false);
        }
      };

    const handleConfirm = () => {
        // Navigate back to the original screen
        navigation.navigate('Attendance'); // Replace 'Attendance' with the actual screen name
    };
    return (
        <SafeAreaView style={{ ...styles.container, paddingTop: 0 }}>
            <View style={styles.cameraContainer}>
                <Camera style={styles.camera} type={type} ref={(ref) => (cameraRef = ref)}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.takePictureContainer}>
                        <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
                            <Text style={styles.takePictureButtonText}>Take Picture</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                {image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F5F5F5',
        paddingTop:0,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Align items at the top
        paddingHorizontal: 20,
        paddingTop: 20, // Add top padding
    },
    takePictureContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    flipButton: {
        backgroundColor: '#3498DB',
        width: '40%',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#EAE0C8',
    },
    takePictureButton: {
        borderRadius: 50, // Make it a circle
        padding: 20,
        backgroundColor: '#3498DB',
        width: '50%',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#EAE0C8',
    },
    takePictureButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1000,
        justifyContent: 'flex-end',
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    confirmButton: {
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CameraTake;