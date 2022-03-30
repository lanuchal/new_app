import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  ThemeProvider,
  Button,
  Input,
  Image,
  Text,
} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { api } from "../../api";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditPr from "./EditPr";
import DataPr from "./DataPr";
 import EditPass from "./EditPass";
import EditImgf from "./EditImgf";
import EditImgs from "./EditImgs";

const Stack = createNativeStackNavigator();

function MyStack({ itemId }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#339933",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="DataPr"
        initialParams={{ itemId: itemId }}
        component={DataPr}
        options={{ title: "DataPr", headerShown: false }}
      />
      <Stack.Screen
        name="EditPr"
        initialParams={{ itemId: itemId }}
        component={EditPr}
        options={{ title: "แก้ไขข้อมูลพื้นฐาน", headerShown: false }}
      />
       <Stack.Screen
        name="EditPass"
        initialParams={{ itemId: itemId }}
        component={EditPass}
        options={{ title: "EditPass", headerShown: false }}
      />
      <Stack.Screen
       name="EditImgf"
       initialParams={{ itemId: itemId }}
       component={EditImgf}
       options={{ title: "EditImgf"}}
     />
     <Stack.Screen
      name="EditImgs"
      initialParams={{ itemId: itemId }}
      component={EditImgs}
      options={{ title: "EditImgs"}}
    />
    </Stack.Navigator>
  );
}

const Profile = ({ route }) => {
  const { itemId } = route.params;
  return (
    <NavigationContainer independent={true}>
      <MyStack itemId={itemId} />
    </NavigationContainer>
  );
};


export default Profile;
