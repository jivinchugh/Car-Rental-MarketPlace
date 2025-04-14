import { StyleSheet, Button } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyBookings from "./screens/MyBookings";
import SearchScreen from "./screens/SearchScreen";
import LoginScreen from "./screens/LoginScreen";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { auth } from "./firebaseConfig";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabContainerComponent = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="SearchScreen"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "MyBookings") {
            return (
              <FontAwesome6 name="receipt" size={24} color="purple" />
            );
          } else if (route.name === "SearchScreen") {
            return (
              <FontAwesome6 name="magnifying-glass" size={24} color="purple" />
            );
          }
        },
      })}
    >
      <Tab.Screen
        name="MyBookings"
        component={MyBookings}
        options={{
          headerShown: true,
          title: "My Bookings",
          headerRight: () => (
            <Button
              onPress={() => {
                auth.signOut();
                alert("You signed out");
                navigation.navigate("LoginScreen");
              }}
              title="Sign Out"
              color="purple"
            />
          ),
        }}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: true,
          title: "Search Cars",
          headerRight: () => (
            <Button
              onPress={() => {
                auth.signOut();
                alert("You signed out");
                navigation.navigate("LoginScreen");
              }}
              title="Sign Out"
              color="purple"
            />
          ),
        }}
      />
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
            headerBackVisible: false,
            gestureEnabled: false, // Prevent swipe back to login
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
