import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditScreenInfo from "../components/EditScreenInfo";

const Post = (props) => {
  const [post, setPost] = useState({});
  const [editPostdata, setEditPostdata] = useState({});
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const post = props.route.params.post;
    console.log(post, "In Post Details");
    getPost(post.post_id);
  }, []);

  const getPost = async (postId) => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        setUser(data);
        axios({
          method: "get",
          url:
            "http://localhost:3333/api/1.0.0/user/" +
            data.id +
            "/post/" +
            postId,

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

              setPost(response.data);
              setEditPostdata(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };
  const deletePost = async (postId) => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        setUser(data);
        axios({
          method: "delete",
          url:
            "http://localhost:3333/api/1.0.0/user/" +
            data.id +
            "/post/" +
            postId,
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
          });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const editPost = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        setUser(data);
        axios({
          method: "patch",
          url:
            "http://localhost:3333/api/1.0.0/user/" +
            data.id +
            "/post/" +
            editPostdata.post_id,
          data: editPostdata,

          headers: {
            "X-Authorization": data.token,
            "Content-Type": "application/json",
            accept: "*/*",
          },
        })
          .then(function (response) {
            console.log(response.data);
            if (response?.data) {
              alert("Post Edited Sucessfully");
              getPost(editPostdata.post_id);
              setEdit(false);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };
  if (edit) {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: "90%",
            margin: 10,
            padding: 10,
            justifyContent: "flex-start",
            backgroundColor: "white",
            borderRadius: 8,
          }}
        >
          <TextInput
            multiline={true}
            numberOfLines={3}
            style={styles.input}
            placeholder="Write your post"
            value={editPostdata.text}
            onChangeText={(e) => setEditPostdata({ ...editPostdata, text: e })}
          />
        </View>
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Pressable style={styles.actBtn} onPress={() => editPost()}>
            <Text style={{ color: "white", textAlign: "center" }}>Save</Text>
          </Pressable>
          <Pressable
            style={[styles.actBtn, { backgroundColor: "#ff4d4d" }]}
            onPress={() => setEdit(false)}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "90%",
          margin: 10,
          padding: 10,
          justifyContent: "flex-start",
          backgroundColor: "white",
          borderRadius: 8,
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold" }}>
            {post?.author?.first_name} {post?.author?.last_name}
          </Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ marginBottom: 5, fontSize: 22 }}>{post?.text}</Text>
          <Text>{new Date(post?.timestamp).toDateString()}</Text>
        </View>
      </View>
      {user?.id === post?.author?.user_id ? (
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Pressable style={styles.actBtn} onPress={() => setEdit(true)}>
            <Text style={{ color: "white", textAlign: "center" }}>Edit</Text>
          </Pressable>
          <Pressable
            style={[styles.actBtn, { backgroundColor: "#ff4d4d" }]}
            onPress={() => deletePost(post?.post_id)}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Delete</Text>
          </Pressable>
        </View>
      ) : null}
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
    backgroundColor: "#18dcff",
    color: "white",
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
    width: "90%",
    backgroundColor: "#ffffff99",
  },
});

export default Post;
