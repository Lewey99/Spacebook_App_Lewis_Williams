import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const SearchFriend = () => {
  const [friend, setFriend] = useState("");
  const [friends, setFriends] = useState(null);
  useEffect(() => {}, []);

  const getFriends = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);

        axios
          .get("http://localhost:3333/api/1.0.0/search", {
            params: {
              q: friend,
              search_in: "all",
              limit: 20,
              offset: 0,
            },
            headers: {
              "X-Authorization": data.token,
              accept: "application/json",
            },
          })
          .then(function (response) {
            console.log(response.data);
            if (response?.data) {
              console.log(response.data);
              setFriends(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
            alert("Error");
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const sendFriendReq = async (user) => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        console.log(data, "token***");
        axios({
          method: "post",
          url:
            "http://localhost:3333/api/1.0.0/user/" + user.user_id + "/friends",
          data: {},
          headers: {
            "X-Authorization": data.token,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        })
          .then((response) => {
            console.log(response.status, response.data);
            if (response.status === 201) {
              return console.log(response.data);
            } else if (response.status === 400) {
              throw "Invalid email or password";
            }
          })
          .catch((error) => {
            console.log(error, "error");
            alert("Friend Request is already sent");
          });
      }
    } catch (e) {
      console.log(e);
      
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TextInput
          style={styles.input}
          value={friend}
          onChangeText={(e) => {
            setFriend(e);
          }}
          placeholder="Search Friend"
        />
        <Pressable style={styles.btn} onPress={getFriends}>
          <Text style={{ color: "white", textAlign: "center" }}>Search</Text>
        </Pressable>
      </View>
      <View style={{ marginTop: 20, width: "100%", paddingHorizontal: 10 }}>
        {friends && (
          <FlatList
            data={friends}
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
                    style={styles.addBtn}
                    onPress={() => sendFriendReq(item)}
                  >
                    <Text style={{ color: "white", textAlign: "center" }}>
                      Add
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
    paddingTop: 20,
    backgroundColor: "#e6e0bb",
  },
  input: {
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    height: 50,
    width: "60%",
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: "30%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#0d0f45",
    color: "white",
  },
  addBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    height: 30,
    borderRadius: 5,
    backgroundColor: "#18dcff",
    color: "white",
  },
});

export default SearchFriend;
