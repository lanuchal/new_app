import React, { useState } from "react";
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
import { api } from "../api";

const Register = ({ navigation }) => {
  const [storeName, setStoreName] = useState("");
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [cPassWord, setCPassWord] = useState("");
  const [address, setAddress] = useState("");
  const [stateA, setStateA] = useState(true);

  const saveRegis = () => {
    if (!storeName || !userName || !passWord || !address) {
      Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      if (passWord != cPassWord) {
        Alert.alert("เกิดข้อผิดพลาด", "กรุณากรอกรหัสให้ตรงกัน", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      } else {
        axios
          .post(api + "/register", {
            name: storeName,
            user_username: userName,
            user_password: passWord,
            addr: address,
          })
          .then(function (response) {
            console.log(JSON.stringify(response.data[0].result));
            if (response.data[0].result == "nok") {
              Alert.alert("เกิดข้อผิดพลาด", "username นี้ ถูกใช้งานไปแล้ว", [
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ]);
            } else {
              Alert.alert(
                "สมัครสมาชิกสำเร็จ",
                "ไปยังหน้า Login",
                [{ text: "OK", onPress: () => navigation.navigate("Login") }],
                { cancelable: true }
              );
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    }

    console.log(storeName);
    console.log(userName);
    console.log(passWord);
    console.log(cPassWord);
    console.log(address);
  };

  return (
    <ThemeProvider theme={theme}>
      <ScrollView style={stylesRe.container}>
        <Image
          source={{ uri: "https://www.ผักสดเชียงใหม่.com/image/logo1.png" }}
          style={{ width: 100, height: 100 }}
          containerStyle={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 20,
          }}
        />
        <Input
          leftIcon={<Icon name="home" size={20} color="#339933" />}
          placeholder={"ชื่อร้าน"}
          inputStyle={{ paddingLeft: 10 }}
          onChangeText={(input) => setStoreName(input)}
        />

        <Input
          leftIcon={<Icon name="user" size={20} color="#339933" />}
          placeholder={"Username"}
          inputStyle={{ paddingLeft: 10 }}
          onChangeText={(input) => setUserName(input)}
        />
        <Input
          leftIcon={<Icon name="key" size={20} color="#339933" />}
          secureTextEntry={true}
          placeholder={"Password"}
          inputStyle={{ paddingLeft: 10 }}
          onChangeText={(input) => setPassWord(input)}
        />
        <Input
          leftIcon={<Icon name="key" size={20} color="#339933" />}
          secureTextEntry={true}
          placeholder={"Confirm Password"}
          inputStyle={{ paddingLeft: 10 }}
          onChangeText={(input) => setCPassWord(input)}
        />
        <Text style={stylesRe.text}>
          {"  "}
          <Icon name="map-marker" size={23} color="#339933" />
          {"   "}ที่อยู่ร้าน :
        </Text>
        <View style={stylesRe.textAreaContainer}>
          <TextInput
            leftIcon={<Icon name="key" size={20} color="#339933" />}
            style={stylesRe.textArea}
            underlineColorAndroid="transparent"
            placeholder="เลขที่ หมู่ ตำบล อำเภอ จังหวัด &#10;รหัสไปรณีย์"
            placeholderTextColor="grey"
            numberOfLines={3}
            multiline={true}
            onChangeText={(input) => setAddress(input)}
          />
        </View>
        <Button
          icon={<Icon name="check" size={20} color="#fff" />}
          containerStyle={{ marginTop: 15 }}
          title="  Confirm"
          buttonStyle={{ backgroundColor: "#009966" }}
          onPress={() => {
            saveRegis();
          }}
        />
        <Button
          icon={<Icon name="close" size={18} color="#fff" />}
          title="  Cancel"
          containerStyle={{ marginTop: 10, marginBottom: 10 }}
          buttonStyle={{ backgroundColor: "#CC3333" }}
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
        <View style={stylesRe.viewB} />
      </ScrollView>
    </ThemeProvider>
  );
};

const theme = {
  Button: {
    raised: true,
  },
};

const stylesRe = StyleSheet.create({
  container: {
    flex: 10,
    padding: 35,
  },
  viewB: {
    height: 50,
  },
  text: {
    // color: "#919191",
    padding: 5,
    fontSize: 19,
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
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textAreaContainer: {
    margin: 5,
    borderRadius: 5,
    borderColor: "#919191",
    borderWidth: 1,
    padding: 10,
  },
  textArea: {
    minHeight: 70,
    maxHeight: 70,
    fontSize: 18,
    justifyContent: "flex-start",
    textAlignVertical: "top",
  },
});
export default Register;
