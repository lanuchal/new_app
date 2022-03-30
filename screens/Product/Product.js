import React, { useState, useEffect, useContext } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import { api } from "../../api";
import axios from "axios";
import { RandomNumber } from "../../components/context";
const Product = ({ route, navigation }) => {
  const {randomNum} = React.useContext(RandomNumber);
  console.log("randomNum = " + randomNum);
  const { itemId } = route.params;
  const { typeID } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [datauser, setDatauser] = useState([]);
  const [dataTT, setDataTT] = useState("");

  useEffect(async () => {
    await axios.get(api + "/user/" + itemId).then((result) => {
      setDatauser(result.data[0].data[0].user_grade);
    });
    fetch(api + "/productcate/" + typeID)
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
        setDataTT(responseJson[0].cate_name);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [ran]);
  // console.log(datauser);
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.product_name
          ? item.product_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    const box = (price) => {
      return (
        <View
          style={styles.boxItems}
          onPress={() => {
            seletedata(item.product_name, item.product_id, item.product_price);
          }}
        >
          {/* https://www.ผักสดเชียงใหม่.com/image/product_image/676.jpg */}
          <ImageBackground
            source={{
              uri: `https://hotel78maldives.com/thecatch/wp-content/uploads/2021/03/NoImageAvailable.png`,
            }}
            resizeMode="cover"
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Image
              source={{
                uri: `https://www.ผักสดเชียงใหม่.com/image/product_image/${item.product_id}.jpg`,
              }}
              style={{ width: 180, height: 180 }}
            />
          </ImageBackground>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 1,
              position: "relative",
            }}
          >
            <Text style={styles.itemStyle} onPress={() => getItem(item)}>
              {item.product_name.toUpperCase()}{" "}
            </Text>
            <View
              style={{
                marginRight: 20,
                position: "absolute",
                right: 0,
                top: 18,
              }}
            >
              <Icon
                name="shopping-cart"
                size={25}
                color="#029c0f"
                onPress={() => {
                  seletedata(
                    item.product_name,
                    item.product_id,
                    item.price_id,
                    item.product_amount
                  );
                }}
              />
            </View>
          </View>
          <Text
            style={{
              marginLeft: 5,
              alignSelf: "flex-start",
              fontSize: 13,
              margin: 2,
            }}
          >
            คงเหลือ{" "}
            {item.product_amount == null || item.product_amount == 0 ? (
              <Text style={{ color: "#750e0b" }}> สินค้าหมด</Text>
            ) : (
              item.product_amount
            )}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Text style={{ flexGrow: 1, marginLeft: 5, fontSize: 13 }}>
              หน่วย ( 1 {item.unit_name} )
            </Text>
            <Text style={{ marginRight: 5, color: "#054d05" }}>
              {price}
              {" บาท "}
            </Text>
          </View>
        </View>
      );
    };
    if (datauser == "D") {
      return box(item.price_sell_D);
    } else if (datauser == "C") {
      console.log("C");
      return box(item.price_sell_C);
    } else if (datauser == "B") {
      console.log("B");
      return box(item.price_sell_B);
    } else if (datauser == "A") {
      console.log("A");
      return box(item.price_sell_A);
    }
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: "30%",
          // backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  const getItem = (item) => {
    // Function for click on an item
    alert("Id : " + item.id + " Title : " + item.title);
  };

  const seletedata = async (proname, product_id, price_id, amount) => {
    var grade = "D";
    if (datauser == "D") {
      grade = "D";
    } else if (datauser == "C") {
      grade = "C";
    } else if (datauser == "B") {
      grade = "B";
    } else if (datauser == "A") {
      grade = "A";
    }
    console.log("amount = " + amount);
    if (amount == null || amount == 0) {
      Alert.alert(
        `ไม่สามารถเพิ่ม${proname}ได้ !!`,
        "สิ้นค้าหมดชั่วคราว กรุณาเลือกสินค้าอื่น",
        [
          {
            text: "ยืนยัน",
          },
        ]
      );
    } else {
      await axios
        .post(api + "/select-product", {
          id: itemId,
          product_id: product_id,
          price_id: price_id,
          pro_req_amount: 1,
          grade: grade,
        })
        .then(function (response) {
          console.log(response.data.result);
          if (response.data.result == "ok") {
            Alert.alert(
              `เพิ่มสินค้า ${proname} สำเร็จ !!`,
              "คุณสามารถเพิ่มจำนวนสินค้าที่ในเมนู Order",
              [
                {
                  text: "ยืนยัน",
                  onPress: () => {
                    console.log(itemId);
                    console.log(product_id);
                    console.log(price_id);
                  },
                },
              ]
            );
          } else {
            Alert.alert(
              `สินค้า ${proname} ถูกเพิ่มไปในตะกล้าแล้ว `,
              "คุณสามารถเพิ่มจำนวนสินค้าที่ในเมนู Order",
              [
                {
                  text: "ยืนยัน",
                  onPress: () => {
                    console.log(itemId);
                    console.log(product_id);
                    console.log(price_id);
                  },
                },
              ]
            );
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.boxSearch}>
        <View style={{ alignItems: "center", position: "relative" }}>
          <View style={{ position: "absolute", left: -45, top: 10 }}>
            <Icon
              name="arrow-circle-left"
              size={30}
              color="#fff"
              onPress={() => {
                navigation.navigate("Type");
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Kanit_300Light",
              color: "#fff",
            }}
          >
            รายการสินค้าผักสดเชียงใหม่
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontFamily: "Kanit_300Light",
              marginBottom: 13,
            }}
          >
            https://www.ผักสดเชียงใหม่.com
          </Text>
        </View>
        <Image
          source={{ uri: "https://www.ผักสดเชียงใหม่.com/image/logo1.png" }}
          style={{ width: 60, height: 60, marginLeft: 20 }}
          containerStyle={{ marginLeft: "auto", marginBottom: 14 }}
        />

        <View style={styles.searchSection}>
          <Icon
            name="search"
            size={20}
            color="#a3a3a3"
            onPress={() => {
              console.log("asda");
            }}
          />
          <TextInput
            style={styles.input}
            // value={searchTpye}
            placeholder="ค้นหาสินค้า"
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
      <View style={styles.container}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              fontFamily: "Kanit_300Light",
              marginBottom: 10,
              marginTop: 5,
              marginLeft: 15,
              flexGrow: 1,
            }}
          >
            ประเภทสินค้า : {dataTT}
          </Text>
          <Text
            style={{
              color: "#000",
              fontSize: 16,
              fontFamily: "Kanit_300Light",
              marginBottom: 10,
              marginTop: 5,
              marginRight: 20,
            }}
          >
            {filteredDataSource.length} รายการ
          </Text>
        </View>
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
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ItemView}
            contentContainerStyle={{ padding: 2, paddingBottom: 40 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 100,
    height: "100%",
  },
  boxSearch: {
    backgroundColor: "#339933",
    minHeight: 90,
    maxHeight: 90,
    display: "flex",
    borderBottomEndRadius: 7,
    borderBottomStartRadius: 7,
    flexDirection: "row",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  searchSection: {
    bottom: 0,
    borderRadius: 10,
    alignSelf: "center",
    top: 65,
    position: "absolute",
    width: "100%",
    maxWidth: "100%",
    height: 50,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    marginLeft: 5,
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
    color: "#424242",
  },
  itemStyle: {
    // padding: 10,
    color: "#006faf",
    fontWeight: "700",
    marginTop: 0,
    flexGrow: 1,
    fontWeight: "900",
    fontSize: 14,
    marginLeft: 5,
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
    width: "48%",
    justifyContent: "center",
    paddingTop: 0,
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 8,
    paddingBottom: 10,
    height: 260,
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
});

export default Product;
