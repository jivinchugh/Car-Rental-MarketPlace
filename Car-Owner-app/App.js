import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "./screens/LoginScreen";
import MyListings from "./screens/MyListings";
import CreateListings from "./screens/CreateListings";
import { Button } from "react-native";

const Stack = createNativeStackNavigator();

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
