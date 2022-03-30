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
const PageOrder = ({ route }) => {
  const { itemId } = route.params;
      console.log("ssssssssssssssssssssss")
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [datauser, setDatauser] = useState([]);
  const [distance, setDistance] = useState([]);
  const [price, setPrice] = useState([]);
  const [countx, setCountx] = useState(0);
  useEffect(async () => {
    setIsLoading(true);
    await axios.get(api + "/user/" + itemId).then((result) => {
      setDatauser(result.data[0].data[0].user_grade);
      setDistance(result.data[0].data[0].distance);
    });

    fetch(api + "/order/" + itemId)
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [route]);

  // console.log("itemId = " + datauser);

  useEffect(() => {
    count = 0;
    for (let index = 0; index < filteredDataSource.length; index++) {
      var price_grade = 0;
      if (datauser == "D") {
        price_grade = filteredDataSource[index].price_sell_D;
      } else if (datauser == "C") {
        price_grade = filteredDataSource[index].price_sell_C;
      } else if (datauser == "B") {
        price_grade = filteredDataSource[index].price_sell_B;
      } else if (datauser == "A") {
        price_grade = filteredDataSource[index].price_sell_A;
      }

      count = count + filteredDataSource[index].pro_req_amount * price_grade;

      // console.log("asdas");
    }
    setCountx(count + distance);
  }, [filteredDataSource]);

  const oncheng = (a, b, c, d) => {
    setTimeout(() => {
      console.log(a + "/" + b + "/" + c);
      console.log("c = " + c.length);
      if (c.length != 0 && Number(c) != 0) {
        console.log("up = " + Number(c));

        var price_grade = 0;
        if (datauser == "D") {
          price_grade = filteredDataSource[d].price_sell_D;
        } else if (datauser == "C") {
          price_grade = filteredDataSource[d].price_sell_C;
        } else if (datauser == "B") {
          price_grade = filteredDataSource[d].price_sell_B;
        } else if (datauser == "A") {
          price_grade = filteredDataSource[d].price_sell_A;
        }

        inAmount(a, b, Number(c), price_grade);
      }
    }, 1000);
  };
  // console.log("countx = " + countx);

  const saveOrder = (id, name) => {
    console.log(id + "/" + name);
    Alert.alert(`ยืนยัน`, `ยืนยัน order ราคาทั้งหมด ${name} บาท`, [
      {
        text: "ยกเลิก",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "ยืนยัน",
        onPress: async () => {
          console.log("submit Pressed");
          await axios.put(api + "/submitorder", {
            bill_id: id,
          });

          const newFilteredDataSource = filteredDataSource.filter(
            (filteredDataSources) => {
              return filteredDataSources.bill_id !== id;
            }
          );
          setFilteredDataSource(newFilteredDataSource);
        },
      },
    ]);
  };
  const inAmount = async (id, rid, act, o) => {
    await axios.put(api + "/inputamountproduct", {
      product_id: id,
      pro_req_id: rid,
      amount_custom: act,
      amount_old: act,
    });
  };
  const upAmount = async (id, rid) => {
    await axios.put(api + "/upamountproduct", {
      product_id: id,
      pro_req_id: rid,
    });
  };
  const downAmount = async (id, rid) => {
    await axios.put(api + "/downamountproduct", {
      product_id: id,
      pro_req_id: rid,
    });
  };
  const deleteItem = async (Input, amount, proId) => {
    console.log(Input + "/" + amount);
    Alert.alert(`ลบสินค้า`, "ยืนยันที่จะลบรายการสินค้านี้", [
      {
        text: "ยกเลิก",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "ยืนยัน",
        onPress: async () => {
          await axios.post(api + "/deleteoder", {
            id: Input,
            amount: amount,
            product_id: proId,
          });
          const newFilteredDataSource = filteredDataSource.filter(
            (filteredDataSources) => {
              return filteredDataSources.pro_req_id !== Input;
            }
          );
          setFilteredDataSource(newFilteredDataSource);
          console.log(filteredDataSource.length + " -> length");
          if (filteredDataSource.length == 1) {
            await axios.delete(
              api + "/deletebill/" + filteredDataSource[0].bill_id
            );
          }
        },
      },
    ]);
  };
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // const [inputstate, setInputstate] = useState(false);
  // const updateInput = (product_id, pro_req_id, pro_req_amount) => {
  //   console.log(product_id + "+" + pro_req_id + "+" + pro_req_amount);
  //   if (inputstate) {
  //     inAmount(product_id, pro_req_id, pro_req_amount);
  //     setTimeout(() => {
  //       setInputstate(false);
  //     }, 500);
  //   }
  // };
  const ItemView = ({ item, index }) => {
    const orderItem = (price) => {
      return (
        <View style={styles.boxItems}>
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
              style={{ width: 100, height: 90 }}
            />
          </ImageBackground>
          <View
            style={{
              width: "70%",
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
                  fontSize: 16,
                  fontFamily: "Kanit_300Light",
                }}
              >
                {item.product_name}
              </Text>
              <Icon
                name="trash"
                size={20}
                color="#b83a08"
                onPress={() => {
                  deleteItem(
                    item.pro_req_id,
                    filteredDataSource[index].pro_req_amount,
                    item.product_id
                  );
                  console.log(item.product_id);
                }}
              />
            </View>
            <Text
              style={{
                maxWidth: 230,
                fontSize: 15,
                marginLeft: 10,
                marginTop: 10,
                // marginBottom: ,
                color: "#339933",
                fontWeight: "900",
                fontFamily: "Kanit_400Light",
              }}
            >
              ราคา : {numberWithCommas(price)} บาท
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
                จำนวน ( {item.unit_name} )
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="minus-circle"
                  size={17}
                  color="#308d05"
                  onPress={(text) => {
                    if (filteredDataSource[index].pro_req_amount > 0.99) {
                      upAmount(item.product_id, item.pro_req_id);
                      setFilteredDataSource(
                        Object.values({
                          ...filteredDataSource,
                          [index]: {
                            ...filteredDataSource[index],
                            pro_req_amount:
                              parseFloat(
                                filteredDataSource[index].pro_req_amount
                              ) - 1,
                          },
                        })
                      );
                    }
                  }}
                />

                <TextInput
                  onChangeText={(text) => {
                    setFilteredDataSource(
                      Object.values({
                        ...filteredDataSource,
                        [index]: {
                          ...filteredDataSource[index],
                          pro_req_amount: text,
                        },
                      })
                    );
                    oncheng(item.product_id, item.pro_req_id, text, index);
                  }}
                  maxLength={6}
                  keyboardType="number-pad"
                  value={String(filteredDataSource[index].pro_req_amount)}
                  style={{
                    // width: 25,
                    maxWidth: 60,
                    fontSize: 15,
                    color: "#000000",
                    textAlign: "center",
                    fontFamily: "Kanit_300Light",
                    marginLeft: 5,
                    marginRight: 5,
                  }}
                />
                <Icon
                  name="plus-circle"
                  size={17}
                  color="#308d05"
                  onPress={(text) => {
                    downAmount(item.product_id, item.pro_req_id);
                    setFilteredDataSource(
                      Object.values({
                        ...filteredDataSource,
                        [index]: {
                          ...filteredDataSource[index],
                          pro_req_amount:
                            parseFloat(
                              filteredDataSource[index].pro_req_amount
                            ) + 1,
                        },
                      })
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      );
    };

    if (datauser == "D") {
      return orderItem(item.price_sell_D);
    } else if (datauser == "C") {
      console.log("C");
      return orderItem(item.price_sell_C);
    } else if (datauser == "B") {
      console.log("B");
      return orderItem(item.price_sell_B);
    } else if (datauser == "A") {
      console.log("A");
      return orderItem(item.price_sell_A);
    }
  };

  const getItem = (item) => {
    // Function for click on an item
    alert("Id : " + item.id + " Title : " + item.title);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.boxSearch}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Kanit_300Light",
              color: "#fff",
              marginRight: 10,
            }}
          >
            รายการสินค้าทั้งหมดในตะกล้า
          </Text>
          <Icon
            name="shopping-cart"
            size={17}
            color="#fff"
            onPress={() => {
              console.log(item.product_id);
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Kanit_300Light",
              color: "#fff",
              marginRight: 10,
            }}
          >
            {filteredDataSource.length}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Kanit_300Light",
              color: "#fff",
            }}
          >
            รายการ
          </Text>
        </View>
      </View>
      <View></View>
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
        <View style={styles.tatal}>
          <Text
            style={{
              marginLeft: 5,
              fontSize: 14,
              fontFamily: "Kanit_300Light",
              color: "#000",
            }}
          >
            ค่าจัดส่ง {distance}
          </Text>
          <Text
            style={{
              marginLeft: 5,
              fontSize: 14,
              fontFamily: "Kanit_300Light",
              color: "#000",
            }}
          >
            รวม {numberWithCommas(countx)} บาท
          </Text>
          <Button
            icon={<Icon name="check" size={15} color="#fff" />}
            title="  ยืนยัน"
            titleStyle={{ fontSize: 14 }}
            buttonStyle={{ backgroundColor: "#32661a", paddingRight: 10 }}
            onPress={() => {
              saveOrder(
                filteredDataSource[0].bill_id,
                numberWithCommas(countx)
              );
            }}
          />
        </View>
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
    minHeight: 70,
    maxHeight: 70,
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
    padding: 5,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 10,
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

export default PageOrder;
