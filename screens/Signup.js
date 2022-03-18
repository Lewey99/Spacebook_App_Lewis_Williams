import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Alert,
  Image,
} from "react-native";
import axios from "axios";

export default function Signup({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(firstname, surname, email, password);
 
  const signup = () => {
    if (firstname !== "" && surname !== "" && email !== "" && password !== "") {
      axios
        .post("http://localhost:3333/api/1.0.0/user", {
          first_name: firstname,
          last_name: surname,
          email: email,
          password: password,
        })
        .then(function (response) {
          console.log(response.data);
          alert("Please login");
          navigation.goBack();
        })
        .catch(function (error) {
          console.log(error);
          alert("User already exist");
        });
    } else {
      alert("Please fill the complete form");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/SpacebookLogo.png")}
        style={{ width: 200, height: 200, marginBottom: 20 }}
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
      <Pressable style={styles.btn} onPress={signup}>
        <Text style={{ color: "white", textAlign: "center" }}>Sign Up</Text>
      </Pressable>
      <Text style={styles.signuptext} onPress={() => navigation.goBack()}>
        Already a user ? login
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
