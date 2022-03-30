import React, { useState, useEffect, useContext } from "react";
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
import ImagePicker from "react-native-image-crop-picker";
import { androidCameraPermission } from "../../permissions";

import { AuthContext } from "../../components/context";
const noImg =
  "https://www.ผักสดเชียงใหม่.com/image/product_image/no-image.jpeg";
const DataPr = ({ route, navigation }) => {
  const [storeName, setStoreName] = useState("");
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [regisDate, setRegisDate] = useState("");
  const [distance, setDistance] = useState("");
  const [img1, setImg1] = useState();
  const [img2, setImg2] = useState();

  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  const { itemId, up } = route.params;

  const [setAction, setSetAction] = useState(up);

  const { signOut } = useContext(AuthContext);

  useEffect(async () => {
    await axios.get(api + "/user/" + itemId).then((result) => {
      const getData = result.data[0];
      const all = String(getData.data[0].date_register.split("T", 1));
      const sall = all.split("-");
      const y = String(sall[0]);
      const m = String(sall[1]);
      const d = String(sall[2]);
      const date = d + "/" + m + "/" + y;
      const checkTel = getData.data[0].user_tel;
      console.log(date.length);
      setStoreName(getData.data[0].name);
      setUserName(getData.data[0].user_username);
      setRegisDate(date);
      setTel(
        checkTel == "-" || checkTel == " "
          ? "ยังไม่ได้กรอกเบอร์โทรศัพท์"
          : getData.data[0].user_tel
      );
      setAddress(getData.data[0].addr);

      setLat(getData.data[0].addr_lat);
      setLong(getData.data[0].addr_long);

      setDistance(getData.data[0].distance);

      setImg1(
        getData.data[0].user_img1 == " " || getData.data[0].user_img1 == null
          ? String(noImg)
          : String(getData.data[0].user_img1)
      );
      setImg2(
        getData.data[0].user_img2 == " " || getData.data[0].user_img2 == null
          ? String(noImg)
          : String(getData.data[0].user_img2)
      );
    });
  }, [setAction]);

  const onSelectImage = async (prat, file) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus || Platform.OS == "ios") {
      Alert.alert("เลือกรูปร้าน", "เลือกรูปถ่ายหน้าร้าน", [
        { text: "กล้อง", onPress: () => onCamera(prat, file) },
        { text: "คลังรูปภาพ", onPress: () => onGallery(prat, file) },
        { text: "ยกเลิก", onPress: () => {} },
      ]);
    }
  };

  const onCamera = (prat, file) => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        imageUpload(image.path, prat, file);
      })
      .catch((err) => {
        if (err) {
          setSetAction(function randomIntFromInterval() {
            return Math.floor(Math.random() * (100000000 - 1 + 1) + 1);
          });
        }
      });
  };

  const onGallery = (prat, file) => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then((image) => {
        console.log("selected Image", image);
        imageUpload(image.path, prat, file);
      })
      .catch((err) => {
        if (err) {
          setSetAction(function randomIntFromInterval() {
            return Math.floor(Math.random() * (100000000 - 1 + 1) + 1);
          });
        }
      });
  };

  const imageUpload = async (imagePath, prat, file) => {
    const imageData = new FormData();
    imageData.append("id", itemId);
    imageData.append(file, {
      uri: imagePath,
      name: "image.png",
      fileName: "image",
      type: "image/png",
    });
    console.log("form data", imageData);

    await axios({
      method: "post",
      url: api + "/" + prat,
      data: imageData,
    })
      .then(async (response) => {
        console.log("image upload successfully", response.data);
        setSetAction(function randomIntFromInterval() {
          return Math.floor(Math.random() * (100000000 - 1 + 1) + 1);
        });
      })
      .then((error) => {
        console.log("error riased", error);
      });
  };
  // function distance(lat1, lon1, lat2, lon2, unit) {
  //   if (lat1 == lat2 && lon1 == lon2) {
  //     return 0;
  //   } else {
  //     var radlat1 = (Math.PI * lat1) / 180;
  //     var radlat2 = (Math.PI * lat2) / 180;
  //     var theta = lon1 - lon2;
  //     var radtheta = (Math.PI * theta) / 180;
  //     var dist =
  //       Math.sin(radlat1) * Math.sin(radlat2) +
  //       Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //     if (dist > 1) {
  //       dist = 1;
  //     }
  //     dist = Math.acos(dist);
  //     dist = (dist * 180) / Math.PI;
  //     dist = dist * 60 * 1.1515;
  //     if (unit == "K") {
  //       dist = dist * 1.609344;
  //     }
  //     if (unit == "N") {
  //       dist = dist * 0.8684;
  //     }
  //     return dist;
  //   }
  // }
  // const cal = distance(
  //   18.587797727228796, 99.07226096018375,
  //   18.803589167415918, 98.998085111886,"K"
  // );

  // 18.587797727228796, 99.07226096018375,
  // 18.803589167415918, 98.998085111886,"K"

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
              Profile{" "}
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
          <Text
            style={{
              marginRight: "auto",
              fontSize: 15,
              marginBottom: 5,
              fontWeight: "400",
              alignItems: "flex-start",
            }}
          >
            {" "}
            ข้อมูลพื้นฐาน
          </Text>
          <View style={stylesPr.dataTitle}>
            <Icon name="building" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              ชื่อร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {storeName}
            </Text>
          </View>
          <View style={stylesPr.dataTitle}>
            <Icon name="phone" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              เบอร์โทรศัพท์
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {tel}
            </Text>
          </View>
          <View style={stylesPr.dataTitle}>
            <Icon name="map-marker" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              ที่อยู่ร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
                width: 220,
                textAlign: "right",
              }}
            >
              {address}
            </Text>
          </View>
          <View style={stylesPr.dataTitle}>
            <Icon name="road" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              ระยะทางห่างจากร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
                width: 220,
                textAlign: "right",
              }}
            >
              {distance}
            </Text>
          </View>
          <Button
            icon={<Icon name="pencil-square-o" size={18} color="#fff" />}
            title="  แก้ไขข้อมูลพื้นฐาน"
            containerStyle={{
              width: "100%",
              marginTop: 10,
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#1ab16a", fontSize: 10 }}
            onPress={() => {
              console.log("edit");
              navigation.navigate("EditPr");
            }}
          />
          <Button
            icon={<Icon name="pencil-square-o" size={18} color="#fff" />}
            title="  แก้ไขรหัสผ่าน"
            containerStyle={{
              width: "100%",
              marginTop: 10,
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#ca6009", fontSize: 10 }}
            onPress={() => {
              console.log("edit");
              navigation.navigate("EditPass");
            }}
          />
        </View>
        <View style={stylesPr.boxTitle}>
          <View style={stylesPr.dataTitle}>
            <Icon name="picture-o" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              รูปที่อยู่ร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
                width: 220,
                textAlign: "right",
              }}
            >
              รูปที่ 1
            </Text>
          </View>
          <View style={{ alignItems: "center", margin: 10 }}>
            <Image source={{ uri: img1 }} style={{ width: 300, height: 250 }} />
          </View>
          <Button
            icon={<Icon name="pencil-square-o" size={18} color="#fff" />}
            title="  แก้ไขรูปที่อยู่ร้าน 1"
            containerStyle={{
              width: "100%",
              //   marginTop: 10,
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#967f00", fontSize: 10 }}
            onPress={() => {
              console.log("edit");
              onSelectImage("upload1", "profile1");
              // navigation.navigate("EditImgf");
              //   navigation.navigate("EditPass");
            }}
          />
        </View>
        <View style={stylesPr.boxTitle}>
          <View style={stylesPr.dataTitle}>
            <Icon name="picture-o" size={18} color="#0890ff" />
            <Text
              style={{
                marginLeft: 5,
                fontSize: 13,
                marginBottom: 5,
              }}
            >
              รูปที่อยู่ร้าน
            </Text>
            <Text
              style={{
                marginLeft: "auto",
                fontSize: 13,
                marginBottom: 10,
                width: 220,
                textAlign: "right",
              }}
            >
              รูปที่ 2
            </Text>
          </View>
          <View style={{ alignItems: "center", margin: 10 }}>
            <Image source={{ uri: img2 }} style={{ width: 300, height: 250 }} />
          </View>
          <Button
            icon={<Icon name="pencil-square-o" size={18} color="#fff" />}
            title="  แก้ไขรูปที่อยู่ร้าน 2"
            containerStyle={{
              width: "100%",
              //   marginTop: 10,
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#967f00", fontSize: 10 }}
            onPress={() => {
              console.log("edit");
              // navigation.navigate("EditImgs");
              onSelectImage("upload2", "profile2");
              //   navigation.navigate("EditPass");
            }}
          />
        </View>

        <View style={stylesPr.boxTitle}>
          <Button
            icon={<Icon name="sign-out" size={18} color="#fff" />}
            title="  ออกจากระบบ"
            containerStyle={{
              width: "100%",
              //   marginTop: 10,
              height: 40,
              fontSize: 10,
            }}
            buttonStyle={{ backgroundColor: "#585858", fontSize: 10 }}
            onPress={() => {
              Alert.alert("ออกจากระบบ", "ยืนยันออกจากระบบ", [
                { text: "ยืนยัน", onPress: () => signOut() },
                { text: "ยกเลฺิก" },
              ]);
              console.log("logout");
            }}
          />
        </View>
        <View style={{ height: 20 }}></View>
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
    // borderRadius:10,
    // borderWidth:2,
    // borderColor:"#32661a",
    marginBottom: 5,
  },
  boxTitle: {
    display: "flex",
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 5,
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
export default DataPr;
