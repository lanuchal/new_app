import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { api } from "../../api";
import { androidCameraPermission } from "../../permissions";
import axios from "axios";

const EditImgf = () => {
  const onSelectImage = async () => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus || Platform.OS == "ios") {
      Alert.alert("Profile Picture", "Choose an option", [
        { text: "Camera", onPress: onCamera },
        { text: "Gallery", onPress: onGallery },
        { text: "Cancel", onPress: () => {} },
      ]);
    }
  };

  const onCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
    });
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log("selected Image", image);
      imageUpload(image.path);
    });
  };

  const imageUpload = async (imagePath) => {
    const imageData = new FormData();
    imageData.append("id", 169);
    imageData.append("profile1", {
      uri: imagePath,
      name: "image.png",
      fileName: "image",
      type: "image/png",
    });
    console.log("form data", imageData);

    await axios({
      method: "post",
      url: api + "/upload1",
      data: imageData,
    })
      .then(function (response) {
        console.log("image upload successfully", response.data);
      })
      .then((error) => {
        console.log("error riased", error);
      });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btnStyle}
        activeOpacity={0.8}
        onPress={onSelectImage}
      >
        <Text style={styles.textStyle}>select your image</Text>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnStyle: {
    backgroundColor: "blue",
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    paddingHorizontal: 16,
  },
});

export default EditImgf;
// import React from "react";
// import { Button, PermissionsAndroid, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

// const requestCameraPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//       {
//         title: "Cool Photo App Camera Permission",
//         message:
//           "Cool Photo App needs access to your camera " +
//           "so you can take awesome pictures.",
//         buttonNeutral: "Ask Me Later",
//         buttonNegative: "Cancel",
//         buttonPositive: "OK"
//       }
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log("You can use the camera");
//     } else {
//       console.log("Camera permission denied");
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };

// const EditImgf = () => (
//   <View style={styles.container}>
//     <Text style={styles.item}>Try permissions</Text>
//     <Button title="request permissions" onPress={requestCameraPermission} />
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     paddingTop: StatusBar.currentHeight,
//     backgroundColor: "#ecf0f1",
//     padding: 8
//   },
//   item: {
//     margin: 24,
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center"
//   }
// });

// export default EditImgf;
