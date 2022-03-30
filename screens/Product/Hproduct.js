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

import Product from "./Product";
import Type from "./Type";

const Stack = createNativeStackNavigator();

function MyStack({ itemId, select_nav, navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Type"
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
        name="Type"
        initialParams={{ itemId: itemId }}
        component={Type}
        options={{
          headerTitle: () => <Type />,
          title: "Type",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Product"
        initialParams={{ itemId: itemId }}
        component={Product}
        options={{ title: "ประเภทสินค้า", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const Hproduct = ({ route, navigation }) => {
  const { itemId } = route.params;
  console.log("navType");
  return (
    <NavigationContainer independent={true}>
      <MyStack itemId={itemId} select_nav="type" />
    </NavigationContainer>
  );
};

export default Hproduct;
