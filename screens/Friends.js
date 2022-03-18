import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Friends = ({ navigation }) => {
  const [myFriends, setMyFriends] = useState([]);

  useEffect(() => {
    gettingFriendsData();
  }, []);

  const gettingFriendsData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        axios
          .get("http://localhost:3333/api/1.0.0/user/" + data.id + "/friends", {
            headers: { "X-Authorization": data.token },
          })
          .then(function (response) {
            console.log(response.data, "MyFriends");
            if (response?.data) {
              setMyFriends(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
            alert("User already exist");
          });
      }
    } catch (e) {
      console.log(e);
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.btnContainer}>
        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate("Search Friend")}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Search Friend
          </Text>
        </Pressable>
        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate("Friend Request")}
        >
          <Text style={{ color: "white", textAlign: "center" }}>
            Friend Request
          </Text>
        </Pressable>
      </View>
      <View style={{ marginTop: 20, width: "100%", paddingHorizontal: 10 }}>
        {myFriends && (
          <FlatList
            data={myFriends}
            renderItem={({ item, index }) => {
              return (
                <View
                  key={index}
                  style={{
                    margin: 10,
                    padding: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 8,
                  }}
                >
                  <View>
                    <Text>
                      {item.user_givenname} {item.user_familyname}
                    </Text>
                    <Text>{item.user_email}</Text>
                  </View>
                  <Pressable
                    style={styles.viewBtn}
                    onPress={() =>
                      navigation.navigate("Friend Profile", { item })
                    }
                  >
                    <Text style={{ color: "white", textAlign: "center" }}>
                      View
                    </Text>
                  </Pressable>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#e6e0bb",
  },
  btnContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  btn: {
    marginTop: 20,
    width: 150,
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#0d0f45",
    color: "white",
  },
  actBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    width: "45%",
    height: 30,
    borderRadius: 5,
    backgroundColor: "#18dcff",
    color: "white",
  },
  viewBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    height: 30,
    borderRadius: 5,
    backgroundColor: "#0d0f45",
    color: "white",
  },
});

export default Friends;
