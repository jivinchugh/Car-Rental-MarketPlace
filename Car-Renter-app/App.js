/* Problem faced - was able to go back from search to login
headerShown false was not preventing going back to login screen
https://reactnavigation.org/docs/native-stack-navigator#headerbackvisible
used this documentation to solve the problem by setting headerBackVisible to false
 */

import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyBookings from "./screens/MyBookings";
import SearchScreen from "./screens/SearchScreen";
import LoginScreen from "./screens/LoginScreen";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabContainerComponent = () => {
  return (
    <Tab.Navigator
      initialRouteName="SearchScreen"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "MyBookings") {
            return (
            <FontAwesome6 name="receipt" size={24} color="purple" />
          )
          } else if (route.name === "SearchScreen") {
            return (
              <FontAwesome6 name="magnifying-glass" size={24} color="purple" />
            );
          }
        },
      })}
    >
      <Tab.Screen name="MyBookings" component={MyBookings} />
      <Tab.Screen name="SearchScreen" component={SearchScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TabContainerComponent"
          component={TabContainerComponent}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
