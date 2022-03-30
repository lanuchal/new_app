import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Home";
import Order from "../Order";
import Profile from "../profiles/Profile";
// import Type from "../Product/Type";
import Icon from "react-native-vector-icons/FontAwesome";
import Hproduct from "../Product/Hproduct";
import OrderPage from "../order/OrderPage";
import Notification from "../order/Notifications";
import { RandomNumber } from "../../components/context";
const Tab = createBottomTabNavigator();

function randomIntFromInterval() {
  return Math.floor(Math.random() * (100000000 - 1 + 1) + 1);
}
var nn;
function MyTabs({ userid, rnd }) {
  useEffect(() => {
    console.log("userid => " + userid);
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#339933",
      }}
    >
      <Tab.Screen
        name="Home"
        // component={() => {
        //   // nn = randomIntFromInterval();
        //   return <Home userId={userid} />;
        // }}
        component={Home}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Hproduct"
        component={Hproduct}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: "Type",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="tasks" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Order"
        component={Order}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: "shopping",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-cart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: "Order",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="inbox" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{ itemId: userid }}
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navbar({ route, navigation, userId }) {
  const rnd = randomIntFromInterval();
  // const { userId } = route.params;
  // const data = JSON.stringify(route.params);
  // const { navigation } = this.props;
  const x = 3;
  const [randomNum, setrandomNum] = useState(0)
  console.log(rnd);
  return (
    <NavigationContainer independent={true}>
      <RandomNumber.Provider value={{randomNum,setrandomNum}}>
        <MyTabs userid={userId} rnd={rnd} />
      </RandomNumber.Provider>
    </NavigationContainer>
  );
}
