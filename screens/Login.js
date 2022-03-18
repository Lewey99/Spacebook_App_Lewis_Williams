import { useEffect, useState } from "react";
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import EditScreenInfo from "../components/EditScreenInfo";
import { RootTabScreenProps } from "../types";

export default function Login({ navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gettingData();
  }, []);

  const gettingData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userdata");
      console.log(jsonValue);
      if (jsonValue === null) {
        setLoading(false);
      } else {
        navigation.navigate("Home");
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };

  const login = () => {
    if (name !== "" && password !== "") {
      axios
        .post("http://localhost:3333/api/1.0.0/login", {
          email: name,
          password: password,
        })
        .then(async (response) => {
          console.log(response.data);
          if (response?.data?.token) {
            try {
              await AsyncStorage.setItem(
                "userdata",
                JSON.stringify(response.data)
              );
            } catch (e) {
              console.log(e);
            }
            setName("");
            setPassword("");
            navigation.navigate("Home");
          }
        })
        .catch(function (error) {
          console.log(error);
          alert("Invalid username or password");
        });
    } else {
      alert("Please fill the complete form");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assets/images/SpacebookLogo.png")}
          style={{ width: 100, height: 100, marginBottom: 20 }}
        />
        <Text style={styles.title}>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/SpacebookLogo.png")}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        value={name}
        onChangeText={(e) => setName(e)}
      />
      <TextInput
        style={styles.input}
        placeholder="Your password"
        secureTextEntry={true}
        value={password}
        onChangeText={(e) => setPassword(e)}
      />

      <Pressable style={styles.btn} onPress={login}>
        <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
      </Pressable>

      <Text
        style={styles.signuptext}
        onPress={() => navigation.navigate("Signup")}
      >
        New User ? SignUp
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e6e0bb",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
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
