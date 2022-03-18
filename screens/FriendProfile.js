import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

const FriendProfile = (props) => {
  const [loading, setLoading] = useState(true);
  const [friend, setFriend] = useState({});
  const [friendProfile, setFriendProfile] = useState({});
  const [user, setUser] = useState({});

  const [post, setPost] = useState("");
  const [allPost, setAllPost] = useState([]);
  const [postLoading, setPostLoading] = useState(true);

  useEffect(() => {
    const friendDetail = props.route.params.item;
    console.log(props);
    setFriend(friendDetail);
    gettingData(friendDetail);
    getUserInitialPost(friendDetail);
  }, []);

  const gettingData = async (friendDetail) => {
    console.log(friendDetail);
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        setUser(data);
        console.log(data);
        await axios
          .get("http://localhost:3333/api/1.0.0/user/" + friendDetail.user_id, {
            headers: { "X-Authorization": data.token },
          })
          .then(function (response) {
            console.log(response.data);
            if (response?.data) {
              console.log(response.data);
              setFriendProfile(response.data);
              setLoading(false);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserInitialPost = async (friendDetail) => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);

        axios({
          method: "get",
          url:
            "http://localhost:3333/api/1.0.0/user/" +
            friendDetail.user_id +
            "/post",
          params: {
            limit: 20,
            offset: 0,
          },
          headers: {
            "X-Authorization": data.token,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        })
          .then(function (response) {
            console.log(response.data);
            if (response?.data) {
              console.log(response.data);
              setAllPost(response.data);
              setPostLoading(false);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createPost = () => {
    if (post !== "") {
      try {
        axios({
          method: "post",
          url:
            "http://localhost:3333/api/1.0.0/user/" + friend.user_id + "/post",
          data: {
            text: post,
          },
          headers: {
            "X-Authorization": user.token,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        })
          .then(function (response) {
            console.log(response.data);
            setPost("");
            getUserInitialPost(props.route.params.item);
            if (response?.data) {
              console.log(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
            alert("Create Post erroe");
          });
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("Post cannot be empty");
    }
  };

  const likePost = async (post) => {
    console.log(user);

    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        axios({
          method: "post",
          url:
            "http://localhost:3333/api/1.0.0/user/" +
            friend.user_id +
            "/post/" +
            post.post_id +
            "/like",

          headers: {
            "X-Authorization": data.token,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        })
          .then(function (response) {
            console.log(response.data);

            if (response?.data) {
              console.log(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
            alert("Error Liking Post");
          });
      }
    } catch (e) {
      console.log(e);
    }
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
      <View style={styles.profile}>
        <Image
          source={require("../assets/images/SpacebookLogo.png")}
          style={{
            width: 100,
            height: 100,
            marginRight: 20,
          }}
        />
        <View styles={{ justifyContent: "center", alignItems: "center" }}>
          <Text>
            {friendProfile?.first_name} {friendProfile?.last_name}
          </Text>
          <Text>{friendProfile?.email}</Text>
          <Text>Friends: {friendProfile?.friend_count}</Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          multiline={true}
          numberOfLines={3}
          style={styles.input}
          placeholder="write your post"
          value={post}
          onChangeText={(e) => setPost(e)}
        />
        <Pressable style={styles.btn} onPress={createPost}>
          <Text style={{ color: "white", textAlign: "center" }}>Post</Text>
        </Pressable>
      </View>
      <View style={{ marginTop: 20, width: "100%", paddingHorizontal: 10 }}>
        {!postLoading && (
          <FlatList
            data={allPost}
            renderItem={({ item, index }) => {
              return (
                <View
                  key={index}
                  style={{
                    margin: 10,
                    padding: 10,

                    justifyContent: "flex-start",

                    backgroundColor: "white",
                    borderRadius: 8,
                  }}
                >
                  

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {item.author.first_name} {item.author.last_name}
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text>{item?.numLikes} </Text>
                      <TouchableOpacity
                        onPress={() => {
                          likePost(item);
                        }}
                      >
                        <AntDesign
                          name="hearto"
                          size={24}
                          color={"red"}
                          style={{ marginHorizontal: 5 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ padding: 10 }}>
                    <Text style={{ marginBottom: 5 }}>{item?.text}</Text>
                    <Text>{item?.timestamp.toString()}</Text>
                  </View>
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
  profile: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    margin: 10,
    marginTop: 20,
    padding: 10,
    paddingLeft: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    height: 80,
    width: "80%",
    backgroundColor: "#ffffff99",
  },
  btn: {
    marginTop: 10,
    width: 200,
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#0d0f45",
    color: "white",
  },
});

export default FriendProfile;
