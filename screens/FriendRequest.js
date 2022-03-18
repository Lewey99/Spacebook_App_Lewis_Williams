import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const FriendRequest = () => {
  const [loading, setLoading] = useState(true);
  const [friendReqs, setFriendReqs] = useState([]);
  const [user, setUser] = useState({});


  useEffect(() => {
    gettingFriendReqData();
  }, []);

  const gettingFriendReqData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        setUser(data);
        await axios
          .get("http://localhost:3333/api/1.0.0/friendrequests", {
            headers: { "X-Authorization": data.token },
          })
          .then(function (response) {
            console.log(response.data, "Friends*****");
            if (response?.data) {
              setFriendReqs(response.data);
              setLoading(false);
            }
          })
          .catch(function (error) {
            console.log(error);
            setLoading(false);
            alert("Something went wrong");
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const acceptFriendReq = (friend) => {
    console.log(friend);
    axios({
      method: "post",
      url: "http://localhost:3333/api/1.0.0/friendrequests/" + friend.user_id,
      data: {},
      headers: {
        "X-Authorization": user.token,
        "Content-Type": "application/json",
        accept: "*/*",
      },
    })
      .then(function (response) {
        console.log(response.data);
        gettingFriendReqData();
        alert("Request Accepted");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const rejectFriendReq = (friend) => {
    console.log(friend);
    axios({
      method: "delete",
      url: "http://localhost:3333/api/1.0.0/friendrequests/" + friend.user_id,
      data: {},
      headers: {
        "X-Authorization": user.token,
        "Content-Type": "application/json",
        accept: "*/*",
      },
    })
      .then(function (response) {
        console.log(response.data);
        gettingFriendReqData();
        alert("Request Rejected");
      })
      .catch(function (error) {
        console.log(error);
      });
  };


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={{ width: "90%", marginTop: 20 }}>
        {friendReqs.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                margin: 10,
                padding: 10,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingLeft: "5%",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Image
                  source={require("../assets/images/SpacebookLogo.png")}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 20,
                  }}
                />
                <View>
                  <Text style={{ fontWeight: "bold" }}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text>{item.email}</Text>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Pressable
                  style={styles.actBtn}
                  onPress={() => acceptFriendReq(item)}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Accept
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actBtn, { backgroundColor: "#ff4d4d" }]}
                  onPress={() => rejectFriendReq(item)}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Reject
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
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
  actBtn: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 5,
    width: "45%",
    height: 30,
    borderRadius: 5,
    backgroundColor: "#0d0f45",
    color: "white",
  },
});

export default FriendRequest;
