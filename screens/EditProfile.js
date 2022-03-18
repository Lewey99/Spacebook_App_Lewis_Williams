import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from 'expo-camera';

const EditProfile = ({ navigation }) => {
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gettingData();
  }, []);

  const gettingData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      console.log(jsonValue);
      if (jsonValue != null) {
        let data = await JSON.parse(jsonValue);
        setUser(data);

        axios
          .get("http://localhost:3333/api/1.0.0/user/" + data.id, {
            headers: { "X-Authorization": data.token },
          })
          .then(function (response) {
            console.log(response.data);
            if (response?.data) {
              console.log(response.data);
              setFirstname(response.data.first_name);
              setSurname(response.data.last_name);
              setEmail(response.data.email);
              setLoading(false);
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

  const updateDetails = () => {
    if (firstname !== "" && surname !== "" && password !== "") {
      axios({
        method: "patch",
        url: "http://localhost:3333/api/1.0.0/user/" + user.id,
        data: {
          first_name: firstname,
          last_name: surname,
          email: email,
          password: password,
        },
        headers: {
          "X-Authorization": user.token,
          "Content-Type": "application/json",
          accept: "*/*",
        },
      })
        .then(function (response) {
          console.log(response.data);
          alert("Profile Updated");
          navigation.goBack();
        })
        .catch(function (error) {
          console.log(error);
          alert("Please Try again later");
        });
    } else {
      alert("Please fill the complete form");
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
      <Image
        source={require("../assets/images/SpacebookLogo.png")}
        style={{ width: 150, height: 150, marginBottom: 20 }}
      />
      <View style={{ width: "70%" }}>
        <Text style={styles.title}>First Name</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Your first name"
        value={firstname}
        onChangeText={(e) => setFirstname(e)}
      />
      <View style={{ width: "70%" }}>
        <Text style={styles.title}>Surname Name</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Your surname"
        value={surname}
        onChangeText={(e) => setSurname(e)}
      />
      <View style={{ width: "70%" }}>
        <Text style={styles.title}>Email</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={email}
        onChangeText={(e) => setEmail(e)}
        disabled={true}
      />
      <View style={{ width: "70%" }}>
        <Text style={styles.title}>Password</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Your password"
        value={password}
        onChangeText={(e) => setPassword(e)}
        secureTextEntry
      />
      <Pressable style={styles.btn} onPress={updateDetails}>
        <Text style={{ color: "white", textAlign: "center" }}>Update</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e6e0bb",
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  signuptext: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  input: {
    margin: 10,
    padding: 10,
    paddingLeft: 20,
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 5,
    height: 50,
    width: "70%",
    backgroundColor: "#ffffff99",
  },
  btn: {
    marginTop: 20,
    width: 200,
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#0d0f45",
    color: "white",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default EditProfile;
