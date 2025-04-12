/* Problem faced - was able to go back from search to login
headerShown false was not preventing going back to login screen
https://reactnavigation.org/docs/native-stack-navigator#headerbackvisible
used this documentation to solve the problem by setting headerBackVisible to false
 */
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./screens/LoginScreen";
import MyListings from "./screens/MyListings";
import CreateListings from "./screens/CreateListings";
import { Button } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login Screen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyListings"
          component={MyListings}
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate("CreateListings")}
                title="Add New"
                color="purple"
              />
            ),
          })}
        />
        <Stack.Screen 
          name="CreateListings" 
          component={CreateListings}
        />
        </Stack.Navigator>
    </NavigationContainer>
  );
}
