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

// import Product from "./Product";
// import Type from "./Type";
import Notification from "./Notifications";
import PageOrder from "./PageOrder";

const Stack = createNativeStackNavigator();
var kk;
function MyStack({ itemId, select_nav, navigation, randomX }) {
  useEffect(() => {
    function randomIntFromInterval() {
      return Math.floor(Math.random() * (100000000 - 1 + 1) + 1);
    }
    kk = randomIntFromInterval();
    console.log("randomX = stck " + kk);
  }, [randomX]);

  return (
    <Stack.Navigator
      initialRouteName="Notification"
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
        name="Notification"
        initialParams={{ itemId: itemId }}
        component={Notification}
        options={{
          title: "Notification",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PageOrder"
        initialParams={{ itemId: itemId, randomX: kk }}
        component={PageOrder}
        options={{ title: "PageOrder", headerShown: false }}
      />
    </Stack.Navigator>
  );
}

var randomX;
const OrderPage = ({ route, navigation }) => {
  const [isload, setisload] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setisload(false);
    }, 500);
  }, []);

  useEffect(() => {
    function randomIntFromInterval() {
      return Math.floor(Math.random() * (100000000 - 1 + 1) + 1);
    }
    randomX = randomIntFromInterval();
  }, [route]);
  //   console.log(randomX);
  const { itemId } = route.params;
  return (
    <NavigationContainer independent={true}>
      <MyStack itemId={itemId} randomX={randomX} />
    </NavigationContainer>
  );
};

export default OrderPage;
