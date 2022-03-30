import React, { useState, useEffect } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-elements";

import Icon from "react-native-vector-icons/FontAwesome";
import { api } from "../../api";
import axios from "axios";
var count = 0;
var ln;
var dataArray = [];
var dataArray1 = [];
const Notification = ({ route }) => {
  const { itemId } = route.params;
  const { randomX } = route.params;
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [datauser, setDatauser] = useState([]);
  const [distance, setDistance] = useState([]);
  const [price, setPrice] = useState([]);
  const [countx, setCountx] = useState([]);

  const [rowSet, setRowSet] = useState([
    {
      lengthData: " ",
      tatal: " ",
    },
  ]);

  useEffect(async () => {
    dataArray = [];

    // setIsLoading(true);

    await fetch(api + "/historyorder/" + itemId)
      .then((response) => response.json())
      .then(async (responseJson) => {
        setFilteredDataSource(responseJson);
        for (let index = 0; index < responseJson.length; index++) {
          dataArray.push({
            lengthData: 0,
            tatal: 0,
          });
        }
      })
      .then(async () => {
        setRowSet(dataArray);
        await axios.get(api + "/user/" + itemId).then((result) => {
          setDatauser(result.data[0].data[0].user_grade);
          setDistance(result.data[0].data[0].distance);
        });
      })
      .then(() => {
        // //console.log(rowSet);
        setIsLoading(false);
      })
      .catch((error) => {});
  }, [route]);

  const [secDate, setSecDate] = useState(false);
  const [secCount, setSecCount] = useState(0);
  useEffect(async () => {
    dataArray1 = [];
    count = 0;
    for (let index = 0; index < filteredDataSource.length; index++) {
      await axios
        .get(api + "/billreq/" + filteredDataSource[index].bill_id)
        .then((result) => {
          const ln = result.data.length;
          //console.log(ln + " / " + index);
          // setSecDate(result.data);
          count = 0;
          for (let index = 0; index < ln; index++) {
            var price_grade = 0;
            if (datauser == "D") {
              price_grade = result.data[index].price_sell_D;
            } else if (datauser == "C") {
              price_grade = result.data[index].price_sell_C;
            } else if (datauser == "B") {
              price_grade = result.data[index].price_sell_B;
            } else if (datauser == "A") {
              price_grade = result.data[index].price_sell_A;
            }
            count = count + result.data[index].pro_req_amount * price_grade;

            setSecCount(index == ln - 1 ? count : 0);
          }
          // ////console.log("secCount = " + secCount);
          dataArray1.push({
            lengthData: ln,
            tatal: secCount + distance,
          });
        });

      if (index == filteredDataSource.length - 1) {
        setRowSet(dataArray1);
        ////console.log(rowSet);
      }
    }

    // setCountx(count + distance);
  }, [filteredDataSource]);

  // const bill_req = async (id) => {};

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  //   const [dataReq, setDataReq] = useState([]);

  const ItemView = ({ item, index }) => {
    const dateNew = String(item.bill_ref_code);
    const year = Number(dateNew.slice(0, 4)) + 543;
    const mont = dateNew.slice(4, 6);
    const date = dateNew.slice(6, 8);
    const time =
      dateNew.slice(8, 10) +
      ":" +
      dateNew.slice(10, 12) +
      ":" +
      dateNew.slice(12, 14);
    // const dateSplit = dateNew.split("-");

    // const year = Number(dateSplit[0]) + 543;
    // const mont = dateSplit[1];

    // const date_old = dateSplit[2];
    // const date_split = date_old.split("T");
    // const date = date_split[0];

    // const time_old = date_split[1];
    // const time_split = time_old.split(".");
    // const time = time_split[0];
    const time_bill = date + "/" + mont + "/" + year + " " + time;
    // ////console.log(time);
    var textStatejop;
    var colorStatejop;
    var iconStatejop;
    //     สถานะ
    // 1=กำลังเลือกสินค้า
    // 2=จัดส่งแล้ว
    // 3=กำลังรวบรวมสินค้าตามออเดอร์
    // 4=กำลังจัดส่ง
    // 5=ยืนยันออเดอร์

    if (item.bill_status == 5) {
      textStatejop = "รอดำเดินการ";
      colorStatejop = "#e96c24";
      iconStatejop = "circle";
    } else if (item.bill_status == 3) {
      textStatejop = "กำลังรวบรวมสินค้า";
      colorStatejop = "#d94fe6";
      iconStatejop = "circle";
    } else if (item.bill_status == 4) {
      textStatejop = "กำลังจัดส่ง";
      colorStatejop = "#1eb4be";
      iconStatejop = "circle";
    } else if (item.bill_status == 2) {
      textStatejop = "จัดส่งแล้ว";
      colorStatejop = "#05a75b";
      iconStatejop = "check";
    }
    return (
      <View style={styles.boxItems}>
        <Image
          source={{
            uri: `https://www.ผักสดเชียงใหม่.com/image/logo1.png`,
          }}
          style={{ width: 60, height: 60, marginLeft: 5 }}
        />
        <View
          style={{
            width: "80%",
            justifyContent: "space-around",
            position: "relative",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: 10,
              paddingRight: 5,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                maxWidth: 230,
                fontSize: 14,
                fontFamily: "Kanit_300Light",
              }}
            >
              {/* {item.product_name} */}
              วันที่ {time_bill}
            </Text>
            {/* <Text style={{ color: colorStatejop }}>
              <Icon name={iconStatejop} size={12} color={colorStatejop} />{" "}
              {textStatejop}
            </Text> */}
          </View>
          <Text
            style={{
              maxWidth: 230,
              fontSize: 14,
              margin: 10,
              fontWeight: "900",
              fontFamily: "Kanit_400Light",
            }}
          >
            {/* จำนวนสินค้า : {rowSet[index].lengthData} รายการ */}
          </Text>
          <View
            style={{ display: "flex", flexDirection: "row", marginLeft: 10 }}
          >
            <Text
              style={{
                maxWidth: 230,
                fontSize: 14,
                color: "#000000",
                fontFamily: "Kanit_300Light",
                marginRight: 15,
                flexGrow: 1,
              }}
            >
              {/* {numberWithCommas(rowSet[index].tatal)} บาท */}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <Button
                icon={<Icon name="book" size={15} color="#fff" />}
                title="  ดูรายการสินค้า"
                titleStyle={{ fontSize: 12 }}
                buttonStyle={{
                  backgroundColor: "#376d1f",
                  paddingRight: 10,
                  padding: 2,
                  paddingLeft: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  ////console.log("view");
                }}
              /> */}
              <Text style={{ color: colorStatejop }}>
                <Icon name={iconStatejop} size={12} color={colorStatejop} />{" "}
                {textStatejop}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getItem = (item) => {
    // Function for click on an item
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.boxSearch}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon
            name="inbox"
            size={17}
            color="#fff"
            onPress={() => {
              ////console.log(item.product_id);
            }}
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Kanit_300Light",
              color: "#fff",
              marginLeft: 10,
            }}
          >
            ออเดอร์ล่าสุด 10
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Kanit_300Light",
              marginLeft: 5,
              color: "#fff",
            }}
          >
            รายการ
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        ) : (
          <FlatList
            data={filteredDataSource}
            horizontal={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
            contentContainerStyle={{
              padding: 2,
              paddingBottom: 170,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    minHeight: "100%",
  },
  boxSearch: {
    backgroundColor: "#32661a",
    minHeight: 50,
    maxHeight: 50,
    display: "flex",
    marginStart: 5,
    marginEnd: 5,
    borderBottomEndRadius: 7,
    borderBottomStartRadius: 7,
    flexDirection: "column",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },

  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF",
  },
  boxItems: {
    alignItems: "center",
    padding: 5,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 10,
    minHeight: 100,
    maxHeight: 100,
    marginLeft: "auto",
    marginRight: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  tatal: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    height: 60,
    width: "98%",
    bottom: 78,
    backgroundColor: "#d4e7cb",
    marginLeft: 5,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    marginRight: 5,
    shadowColor: "#000",
    justifyContent: "space-between",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    padding: 5,
    paddingRight: 10,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default Notification;
