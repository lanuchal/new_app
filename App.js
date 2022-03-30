// In App.js in a new project

import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import Navbar from "./screens/nav/Navbar";
import { ScreenStackHeaderConfig } from "react-native-screens";
import { AuthContext } from "./components/context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppLoading from "expo-app-loading";

const Stack = createNativeStackNavigator();

function MyStack({ userToken }) {
  return (
    <Stack.Navigator
      initialRouteName="Login"
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
        name="Login"
        component={Login}
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ title: "Register" }}
      />
    </Stack.Navigator>
  );
}

function App() {
  // const [isLoading, setIsLoading] = useState(true);
  // const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState("");

  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (preState, action) => {
    switch (action.type) {
      case "RETRIVE_TOKEN":
        return {
          ...preState,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGIN":
        return {
          ...preState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case "LOGOUT":
        return {
          ...preState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case "REGISTER":
        return {
          ...preState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState
  );

  const authContext = useMemo(() => ({
    signIn: async (userName, inputUserName, passWord, inputPassWord, id) => {
      console.log("username = " + userName + "/" + inputUserName);
      console.log("password = " + passWord + "/" + inputPassWord);
      // setUserToken("fgkj");
      // setIsLoading(false);
      let userToken;
      userToken = null;
      if (userName == inputUserName && passWord == inputPassWord) {
        try {
          userToken = String(id);
          console.log("login");
          await AsyncStorage.setItem("userToken", userToken);
        } catch (e) {
          console.log(e);
        }
      }
      dispatch({ type: "LOGIN", id: userName, token: userToken });
    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: "LOGOUT" });
    },
    signUp: () => {
      // setUserToken("fgkj");
      // setIsLoading(false);
    },
    setUserID: (input) => {
      setUserId(input);
    },
  }));

  useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
        setUserId(userToken);
        // console.log("userToken" + userToken);
      } catch (e) {
        console.log(e);
      }
      // setIsLoading(false);
      dispatch({ type: "RETRIVE_TOKEN", token: userToken });
    }, 500);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  console.log("userToken = " + loginState.userToken);
  return (
    <AuthContext.Provider value={authContext}>
      {loginState.userToken != null ? (
        <Navbar userId={userId} />
      ) : (
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
      )}
    </AuthContext.Provider>
  );
}

export default App;
