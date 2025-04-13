/* Problem faced - was able to go back from search to login
headerShown false was not preventing going back to login screen
https://reactnavigation.org/docs/native-stack-navigator#headerbackvisible
used this documentation to solve the problem by setting headerBackVisible to false
 */
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import MyListings from "./screens/MyListings";
import CreateListings from "./screens/CreateListings";
import { Button } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
import { auth } from "./firebaseConfig";


const TabContainerComponent = () => {
  return (
    <Tab.Navigator
      initialRouteName="MyListings"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "MyListings") {
            return (
              <FontAwesome6 name="car" size={24} color="purple" />
            );
          } else if (route.name === "CreateListings") {
            return (
              <MaterialIcons name="car-rental" size={30} color="purple" />
            );
          }
        },
      })}
    >
      <Tab.Screen 
        name="MyListings" 
        component={MyListings} 
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => {
                auth.signOut();
                alert("You signed out");
                navigation.navigate("LoginScreen")
              }}
              title="Sign Out"
              color="purple"
              style={{ marginRight: 10 }}
            />
          ),
        })}
      />
      <Tab.Screen 
        name="CreateListings" 
        component={CreateListings}
        options={{ title: "Add New Car" }} 
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
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
