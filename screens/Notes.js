import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
} from "react-native";

const NameHere = () => {
  //State allows us to save a value
  const [firstname, setFirstname] = useState("");

  //Use effect is a function called once the screen has been rendered
  useEffect(() => {}, []);

  //a function being declared
  const functionName = () => {};

  // this is conditional rendering and allows us to render a loading in this way. While true it will return the UI inside the IF and IF flase the default return is displayed 
  // if (condition===ture) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Loading</Text>
  //     </View>
  //   );
  // }

  // Anything after the return is rendered to the UI
  return (
    <View style={styles.container}>
      <Text>NameHere</Text>
    </View>
  );
};

//Below are predefined reuseable styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NameHere;
