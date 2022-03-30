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
import GetLocation from "react-native-get-location";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const EditPr = ({ route, navigation }) => {
  const [distanceUp, setDistanceUp] = useState();
  const [lat, setLat] = useState(18.803589167415918);
  const [long, setLong] = useState(98.998085111886);

  const [storeName, setStoreName] = useState("");
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [regisDate, setRegisDate] = useState("");
  const [addr_lat, setAddr_lat] = useState(" ");
  const [addr_long, setAddr_long] = useState(" ");
  const [count, setCount] = useState(0);
  const { itemId } = route.params;
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(async () => {
    await axios.get(api + "/user/" + itemId).then((result) => {
      const getData = result.data[0];
      const all = String(getData.data[0].date_register.split("T", 1));
      const sall = all.split("-");
      const y = String(sall[0]);
      const m = String(sall[1]);
      const d = String(sall[2]);
      const date = d + "/" + m + "/" + y;

      console.log();
      setStoreName(getData.data[0].name);
      setUserName(getData.data[0].user_username);
      setRegisDate(date);
      setTel(getData.data[0].user_tel == "-" ? "" : getData.data[0].user_tel);
      setAddress(getData.data[0].addr);
      setAddr_lat(getData.data[0].addr_lat);
      setAddr_long(getData.data[0].addr_long);

      getmad();
    });
  }, []);
  const saveEdit = async () => {
    console.log("itemId = " + itemId);
    console.log("storeName = " + storeName);
    console.log("address = " + address);
    console.log("tel = " + tel);
    console.log("addr_lat = " + addr_lat);
    console.log("addr_long =" + addr_long);
    if (tel.length != 10) {
      Alert.alert("แก้ไขข้อมูลพื้นฐาน", "กรุณากรอกเบอร์โทรสัพท์ให้ถูกต้อง", [
        { text: "OK", onPress: () => navigation.navigate("EditPr") },
      ]);
    }
    //  else if (addr_lat.length < 1 || addr_long.length < 1) {
    //   Alert.alert("แก้ไขข้อมูลพื้นฐาน", "กรุณากดคำนวณที่อยู่", [
    //     { text: "OK", onPress: () => navigation.navigate("EditPr") },
    //   ]);
    // }
    else {
      await axios
        .put(api + "/updateuser", {
          id: itemId,
          name: storeName,
          addr: address,
          user_tel: tel,
          addr_lat: addr_lat,
          addr_long: addr_long,
        })
        // .then((response) => {
        //   uuu(distanceUp);
        //   return response.data;
        // })
        // .then((data) => {
        //   const changedRow = data.data.changedRows;
        //   if (changedRow != 0) {
        //     Alert.alert("แก้ไขข้อมูลพื้นฐาน", "แก้ไขข้อมูลพื้นฐานสำเร็จ", [
        //       {
        //         text: "OK",
        //         onPress: () => {
        //           const rndInt = randomIntFromInterval(1, 100000);
        //           navigation.navigate("DataPr", { up: rndInt });
        //         },
        //       },
        //     ]);
        //   }
        // })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  // const uuu = async (distanceUp) => {
  //   await axios.put(api + "/updateuserdistance", {
  //     id: itemId,
  //     distance: distanceUp,
  //   });
  // };

  function distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  const getmad = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
    })
      .then(async (location) => {
        console.log(location);

        console.log(location.latitude);
        console.log(location.longitude);

        setAddr_lat(location.latitude);
        setAddr_long(location.longitude);
        const cal = (
          Math.round(distance(addr_lat, addr_long, lat, long, "K") * 100) / 100
        ).toFixed(2);
        setDistanceUp(cal);
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
  };
  return (
    <ThemeProvider theme={theme}>
      <ScrollView style={stylesPr.container}>
        <View style={stylesPr.boxProfile}>
          <Image
            source={{ uri: "https://www.ผักสดเชียงใหม่.com/image/logo1.png" }}
            style={{ width: 100, height: 100 }}
            containerStyle={{ marginLeft: 20 }}
          />
          <View style={stylesPr.titleProfile}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 5,
                color: "#339933",
              }}
            >
              {" "}
              แก้ไขข้อมูลพื้นฐาน{" "}
            </Text>
            <Text
              style={{
                fontSize: 16,
              }}
            >
              {" "}
              usename : {userName}{" "}
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 5,
              }}
            >
              {" "}
              วันที่สมัครสมาชิก : {regisDate}{" "}
            </Text>
          </View>
        </View>

        <View style={stylesPr.boxTitle}>
          <Text style={stylesPr.text}>
            {"  "}
            <Icon name="home" size={23} color="#339933" />
            {"   "}ชื่อร้าน :
          </Text>
          <Input
            // leftIcon={<Icon name="home" size={20} color="#339933" />}
            placeholder={"ชื่อร้าน"}
            value={storeName}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setStoreName(input)}
          />
          <Text style={stylesPr.text}>
            {"  "}
            <Icon name="phone" size={23} color="#339933" />
            {"   "}เบอร์โทรสัพท์ :
          </Text>
          <Input
            keyboardType="numeric"
            // leftIcon={<Icon name="phone" size={20} color="#339933" />}
            placeholder={"เบอร์โทรสัพท์"}
            value={tel}
            inputStyle={{ paddingLeft: 10 }}
            onChangeText={(input) => setTel(input)}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              position: "relative",
            }}
          >
            <Text style={stylesPr.text}>
              {"  "}
              <Icon name="map-marker" size={23} color="#339933" />
              {"   "}latitude/longitude :
            </Text>
            <Button
              icon={<Icon name="question-circle" size={18} color="#fff" />}
              title="  คำนวณที่อยู่"
              containerStyle={{
                width: 130,
                position: "absolute",
                right: 3,
                borderRadius: 10,
                padding: 0,
              }}
              buttonStyle={{
                backgroundColor: "#01b87b",
                padding: 3,
                alignItems: "center",
              }}
              onPress={() => {
                getmad();
              }}
            />
          </View>
          <Input
            // leftIcon={<Icon name="phone" size={20} color="#339933" />}
            style={{ fontSize: 15 }}
            value={addr_lat + "/" + addr_long}
            disabled
          />
          <Text style={stylesPr.text}>
            {"  "}
            <Icon name="address-card-o" size={23} color="#339933" />
            {"   "}ที่อยู่ร้าน :
          </Text>

          <View style={stylesPr.textAreaContainer}>
            <TextInput
              leftIcon={<Icon name="key" size={20} color="#339933" />}
              style={stylesPr.textArea}
              value={address}
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
            title="  บันทึก"
            buttonStyle={{ backgroundColor: "#009966" }}
            onPress={() => {
              saveEdit();
            }}
          />
          <Button
            icon={<Icon name="close" size={18} color="#fff" />}
            title="  ยกเลิก"
            containerStyle={{ marginTop: 10, marginBottom: 10 }}
            buttonStyle={{ backgroundColor: "#CC3333" }}
            onPress={() => {
              const rndInt = randomIntFromInterval(1, 100000);
              navigation.navigate("DataPr", { up: rndInt });
            }}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </ThemeProvider>
  );
};

const theme = {
  Button: {
    raised: true,
  },
};

const stylesPr = StyleSheet.create({
  container: {
    flex: 10,
    padding: 10,
  },
  boxProfile: {
    display: "flex",
    padding: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  boxTitle: {
    display: "flex",
    padding: 15,
    backgroundColor: "#fff",
  },
  dataTitle: {
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    paddingTop: 10,
    display: "flex",
    flexDirection: "row",
    borderBottomColor: "#1ab16a",
    borderBottomWidth: 1,
  },
  titleProfile: {
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
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
  text: {
    // color: "#919191",
    padding: 5,
    fontSize: 19,
  },
});
export default EditPr;
