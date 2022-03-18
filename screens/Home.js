import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

const Home = (props) => {
  const [user, setUser] = useState({});
  const [post, setPost] = useState("");
  const [allPost, setAllPost] = useState([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [postLoading, setPostLoading] = useState(true);

  const limit = 20;

  useEffect(() => {
    gettingData();
    getUserInitialPost();
  }, []);

  //Loading My Profile Data
  const gettingData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        console.log(data);
        await axios
          .get("http://localhost:3333/api/1.0.0/user/" + data.id, {
            headers: { "X-Authorization": data.token },
          })
          .then(function (response) {
            console.log(response.data);
            if (response?.data) {
              console.log(response.data);
              setUser(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
            alert("User already exist");
          });
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };

  //Loading My Posts
  const getUserInitialPost = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);

        axios({
          method: "get",
          url: "http://localhost:3333/api/1.0.0/user/" + data.id + "/post",
          params: {
            limit: limit,
            offset: 0,
          },
          headers: {
            "X-Authorization": data.token,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        })
          .then(function (response) {
            console.log(response.data, "post");
            if (response?.data) {
              console.log(response.data);
              setAllPost(response.data);
              setCurrentOffset(limit);
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

  // create new post
  const createPost = async () => {
    console.log(user);
    if (post !== "") {
      try {
        const jsonValue = await AsyncStorage.getItem("userdata");
        if (jsonValue != null) {
          let data = await JSON.parse(jsonValue);
          axios({
            method: "post",
            url: "http://localhost:3333/api/1.0.0/user/" + data.id + "/post",
            data: {
              text: post,
            },
            headers: {
              "X-Authorization": data.token,
              "Content-Type": "application/json",
              accept: "*/*",
            },
          })
            .then(function (response) {
              console.log(response.data);
              setPost("");
              //Load my post again
              getUserInitialPost();
              if (response?.data) {
                console.log(response.data);
              }
            })
            .catch(function (error) {
              console.log(error);
              alert("Create Post erroe");
            });
        }
      } catch (e) {
        console.log(e);
        // error reading value
      }
    } else {
      alert("Post cannot be empty");
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Image
            source={require("../assets/images/SpacebookLogo.png")}
            style={{
              width: 100,
              height: 100,
              marginBottom: 20,
              marginRight: 20,
            }}
          />
          <View>
            <Text>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text>{user?.email}</Text>
            <Text>Friends: {user?.friend_count}</Text>
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
            placeholder="Write your post"
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
                  <TouchableOpacity
                    key={index}
                    style={{
                      margin: 10,
                      padding: 10,
                      justifyContent: "flex-start",
                      backgroundColor: "white",
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      console.log(item);
                      props.navigation.navigate("Post", { post: item });
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

                        <AntDesign
                          name="hearto"
                          size={24}
                          color={"red"}
                          style={{ marginHorizontal: 5 }}
                        />
                      </View>
                    </View>
                    <View style={{ padding: 10 }}>
                      <Text style={{ marginBottom: 5, fontSize: 22 }}>
                        {item?.text}
                      </Text>
                      <Text>{new Date(item?.timestamp).toDateString()}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
    </ScrollView>
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
    flexDirection: "column",
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

export default Home;
