/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NotFoundScreen from "../screens/NotFoundScreen";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Home from "../screens/Home";
import SearchFriend from "../screens/SearchFriend";
import Friends from "../screens/Friends";
import FriendRequest from "../screens/FriendRequest";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import EditProfile from "../screens/EditProfile";
import FriendProfile from "../screens/FriendProfile";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Post from "../screens/Post";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DefaultTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const FriendsStack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
function UserNavigator() {
  return (
    <UserStack.Navigator>
      <UserStack.Screen
        name="Home"
        component={Home}
        options={({ navigation }: any) => ({
          // headerShown: false,
          headerRight: () => (
            <Pressable
              onPress={async () => navigation.navigate("EditProfile")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <AntDesign
                name="edit"
                size={25}
                color={Colors["light"].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <UserStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={({ navigation }: any) => ({
          // headerShown: false,
          headerRight: () => (
            <Pressable
              onPress={async () => {
                const jsonValue = await AsyncStorage.getItem("userdata");
                if (jsonValue != null) {
                  let data = await JSON.parse(jsonValue);
                  axios({
                    method: "post",
                    url: "http://localhost:3333/api/1.0.0/logout",
                    headers: {
                      "X-Authorization": data.token,
                      "Content-Type": "application/json",
                      accept: "*/*",
                    },
                  }).then(async (e) => {
                    console.log(e);
                    await AsyncStorage.removeItem("userdata").then((e) => {
                      navigation.navigate("Login");
                    });
                  });
                }
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <AntDesign
                name="logout"
                size={25}
                color={Colors["light"].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <UserStack.Screen
        name="Post"
        component={Post}
        options={({ navigation }: any) => ({
          // headerShown: false,
        })}
      />
    </UserStack.Navigator>
  );
}
function FriendsNavigator() {
  return (
    <FriendsStack.Navigator>
      <FriendsStack.Screen
        name="Friends"
        component={Friends}
        options={({ navigation }: any) => ({
          // headerShown: false,
        })}
      />
      <FriendsStack.Screen
        name="Search Friend"
        component={SearchFriend}
        options={{ headerShown: true }}
      />
      <FriendsStack.Screen
        name="Friend Request"
        component={FriendRequest}
        options={{ headerShown: true }}
      />
      <FriendsStack.Screen
        name="Friend Profile"
        component={FriendProfile}
        options={{ headerShown: true }}
      />
    </FriendsStack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<any>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors["light"].tint,
      }}
    >
      
      <BottomTab.Screen
        name="Profile"
        component={UserNavigator}
        options={({ navigation }: any) => ({
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="FriendsTab"
        component={FriendsNavigator}
        options={{
          title: "Friends",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>["name"];
  color: string;
}) {
  return <AntDesign size={24} style={{ marginBottom: -3 }} {...props} />;
}
