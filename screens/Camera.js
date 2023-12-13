import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { Button } from 'react-native';
import { storage } from '../firebase';
import { getDownloadURL, uploadBytes, ref, deleteObject } from 'firebase/storage';
import { Alert } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CameraTake = () => {
    const [image, setImage] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [hasPermission, setHasPermission] = useState(null);
    const auth = getAuth();
    const [user, setUser] = useState(null); // Make sure to initialize with an appropriate value


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
                showImageTakenMessage();
            }
        } catch (error) {
            console.error('Error taking picture:', error);
            setisLoading(false);
            // Handle error appropriately, e.g., show an error message to the user
        }
    };
    
    const showImageTakenMessage = () => {
        if (window.alert) {
            window.alert('Time In Recorded and your image was taken and sent.');
        } else {
            console.log('Time In Recorded and your image was taken and sent.');
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
            // Use fetch to create a blob object
            const response = await fetch(uri);
            const blob = await response.blob();

            const storageRef = ref(storage, `Images/image-${Date.now()}`);
            await uploadBytes(storageRef, blob);

            // Return the download URL directly
            return await getDownloadURL(storageRef);
        } catch (error) {
            alert(`Error : ${error}`);
        }

        const imageDetails = {
            userEmail: user.email,
            userName: user.displayName,
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
            deleteObject(deleteRef).then(() => {
                setImage(null);
            })
        } catch (error) {
            alert(`Error : ${error}`);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cameraContainer}>
                <Camera style={styles.camera} type={type} ref={(ref) => (cameraRef = ref)}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            <Text style={styles.text}>Take Picture</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                {image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <TouchableOpacity style={styles.deleteButton} onPress={deleteImage}>
                            <Text style={styles.deleteButtonText}>Delete This Image</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'column', // Adjust layout to have camera and image in the same container
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',  // Center the buttons horizontally
        marginBottom: 20,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
        marginHorizontal: 10,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Move the image and delete button to the bottom
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        margin: 10, // Add some margin to the delete button
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CameraTake;