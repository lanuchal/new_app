import React, { useState, useEffect } from "react";

// import all the components we are going to use
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import { api } from "../../api";
import axios from "axios";
import { RandomNumber } from "../../components/context";
const Type = ({ route, navigation }) => {
  // const { itemId } = route.params;
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [datauser, setDatauser] = useState([]);

  const {randomNum, setrandomNum} = React.useContext(RandomNumber);
  const [rannn, setrannn] = useState(randomNum)
  useEffect(async () => {
    setIsLoading(true);
    fetch(api + "/producttype")
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  // console.log(filteredDataSource);
  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.cate_name
          ? item.cate_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.boxItems}>
        <Text style={styles.itemStyle} onPress={() => getItem(item)}>
          {item.cate_name.toUpperCase()}
        </Text>
      </View>
    );
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
    // alert("Id : " + item.cate_id + " Title : " + item.title);
    navigation.navigate("Product", {
      typeID: item.cate_id,
    });
  };
  console.log(randomNum)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.boxSearch}>
        <View style={{ flexGrow: 1, marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Kanit_300Light",
              color: "#fff",
            }}
          >
            ประเภทสินค้า
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontFamily: "Kanit_300Light",
              marginBottom: 13,
            }}
          ></Text>
        </View>
        <Image
          source={{ uri: "https://www.ผักสดเชียงใหม่.com/image/logo1.png" }}
          style={{ width: 60, height: 60 }}
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
        <Text
          style={{
            color: "#000",
            fontSize: 16,
            fontFamily: "Kanit_300Light",
            marginBottom: 10,
            marginTop: 5,
            marginLeft: 15,
          }}
        >
          รายการสินค้า {filteredDataSource.length} รายการ
        </Text>
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
            numColumns={4}
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
    // backgroundColor: "white",
    height:"100%"
  },
  boxSearch: {
    backgroundColor: "#339933",
    minHeight: 90,
    maxHeight: 90,
    marginLeft: 2,
    marginRight: 2,
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
    color: "#000",
  },
  itemStyle: {
    fontFamily: "Kanit_300Light",
    padding: 10,
    textAlign: "center",
    fontSize: 16,
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
    width: 90,
    backgroundColor: "#fff",
    marginBottom: 8,
    marginStart: "2.3%",
    height: 80,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
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

export default Type;
