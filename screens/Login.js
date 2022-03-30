import React, { useState, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  // Text,
  Alert,
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
import { api } from "../api";
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from "../components/context";
const Login = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  const { signIn, setUserID } = useContext(AuthContext);

  const createTwoButtonAlert = () =>
    Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูล", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  const checkLogin = async () => {
    console.log("userName = " + userName);
    console.log("passWord = " + passWord);
    if (!userName || !passWord) {
      createTwoButtonAlert();
      console.log("errorrrrrr");
    } else {
      console.log(api + "/login");
      await axios
        .post(api + "/login", {
          user_username: userName,
          user_password: passWord,
        })
        .then((response) => {
          
          return response.data;
        })
        .then((data) => {
          console.log(data[0].data[0].user_id);
          if (data[0].login == "nok") {
            Alert.alert("เกิดข้อผิดพลาด", "รหัสผ่านไม่ถูกต้อง", [
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ]);
          } else {
            console.log("userid = login " + userid)
            const userid = data[0].data[0].user_id;
            const user = data[0].data[0].user_username;
            const pass = data[0].data[0].user_password;

            setUserID(userid);
            signIn(user, userName, pass, passWord, userid);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <View style={styles.head}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
          <Icon name="lock" size={16} color="#fff" />
         เข้าสู่ระบบ
        </Text>
      </View>
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: "https://www.ผักสดเชียงใหม่.com/image/logo1.png" }}
          style={{ width: 180, height: 180 }}
          containerStyle={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 10,
          }}
        />
        <View style={styles.headVG}>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#339933" }}>
            ผักสดเชียงใหม่{" "}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 3 }}>
            CHIANGMAI FRESH VEGETABLES{" "}
          </Text>
          <Text style={{ fontSize: 16, marginTop: 3 }}>
            แหล่งรวมผักสดราคาส่งออนไลน์ของคนเชียงใหม่{" "}
          </Text>
        </View>

        <Input
          leftIcon={<Icon name="user" size={20} color="#339933" />}
          placeholder={"Username"}
          inputStyle={{ paddingLeft: 10 }}
          onChangeText={(userName) => setUserName(userName)}
        />

        <Input
          leftIcon={<Icon name="key" size={20} color="#339933" />}
          secureTextEntry={true}
          placeholder={"Password"}
          inputStyle={{ paddingLeft: 10 }}
          onChangeText={(passWord) => setPassWord(passWord)}
        />
        <Button
          icon={<Icon name="sign-in" size={20} color="#fff" />}
          title="   Sign-In"
          containerStyle={{ marginTop: 10 }}
          buttonStyle={{ backgroundColor: "#339933" }}
          onPress={() => checkLogin()}
        />
        <Button
          icon={<Icon name="user-plus" size={18} color="#fff" />}
          title="  Sign-Up"
          containerStyle={{ marginTop: 10 }}
          buttonStyle={{ backgroundColor: "#FF9933" }}
          onPress={() => {
            navigation.navigate("Register");
          }}
        />
       
      </ScrollView>
    </ThemeProvider>
  );
};

const theme = {
  Button: {
    raised: true,
  },
};

const styles = StyleSheet.create({
  container: {
    fontFamily: "'lucida grande', tahoma, verdana, arial, sans-serif",
    flex: 1,
    padding: 35,
  },
  head: {
    backgroundColor: "#339933",
    padding: 5,
    alignItems: "center",
  },
  headVG: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  preloader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Login;
