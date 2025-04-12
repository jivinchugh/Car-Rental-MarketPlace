import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TextView,
  Switch,
  Pressable,
} from "react-native";
import { useState } from "react";

// 1. TODO: import the required service  (db, auth, etc) from FirebaseConfig.js
import { auth } from "../firebaseConfig";

// 2. TODO: import the specific functions from the service (import ___ from "firebase/firebase auth)
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  // form fields
  const [emailFromUI, setEmailFromUI] = useState("jchugh@myseneca.ca");
  const [passwordFromUI, setPasswordFromUI] = useState("123456");
  const [errorMessageLabel, setErrorMessageLabel] = useState(null);

  const loginPressed = async () => {
    console.log("Logging in...");
    setErrorMessageLabel(null);

    if (!emailFromUI || !passwordFromUI) {
      setErrorMessageLabel("Email and password cannot be empty");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailFromUI, passwordFromUI);
      alert("LOGIN SUCCESS!");
      console.log(auth.currentUser);
      //navigation.navigate("MyListings");
    } catch (err) {
      console.log("Error when doing login");
      console.log(`Error code: ${err.code}`);
      console.log(`Error message: ${err.message}`);

      if (err.code === "auth/invalid-credential") {
        setErrorMessageLabel("Wrong ID/Password. Please try again.");
      } else {
        setErrorMessageLabel(err.message);
      }
    }
  };

  const logoutUser = () => {
    // code to logout user
    auth.signOut();
    alert("User is logged out!");
  };

  const createAccountPressed = async () => {
    console.log("Creating account...");
    setErrorMessageLabel(null);

    if (!emailFromUI || !passwordFromUI) {
      setErrorMessageLabel("Email and password cannot be empty");
      return;
    }
    if (passwordFromUI.length < 6) {
      setErrorMessageLabel("Password must be at least 6 characters long");
      return;
    }

    try {
      // 1. attempt to create the account with the given email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailFromUI,
        passwordFromUI
      );

      // 2. if successful, then a copy of the account information will be stored in the
      // userCredential variable
      console.log(userCredential);

      alert("Account created successfully!");

      // 3. what is the email address of the created account
      console.log(`Email of account: ${userCredential.user.email}`);
      console.log(`Firebase uid for this account: ${userCredential.user.uid}`);

      // 4. navigate you to the next screen of the app
      // navigation.navigate("Home")
    } catch (err) {
      console.log("Error when creating user");
      console.log(`Error code: ${err.code}`);
      console.log(`Error message: ${err.message}`);

      if (err.code === "auth/email-already-in-use") {
        setErrorMessageLabel(
          "This email is already registered. Try logging in instead."
        );
      } else if (err.code === "auth/invalid-email") {
        setErrorMessageLabel("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setErrorMessageLabel(
          "Password is too weak. It must be at least 6 characters long."
        );
      } else {
        setErrorMessageLabel(err.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turo - Car Marketplace app!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* email tb */}
      <TextInput
        placeholder="Enter Email"
        onChangeText={setEmailFromUI}
        value={emailFromUI}
        style={styles.input}
      />

      {/* password tb */}
      <TextInput
        placeholder="Password"
        onChangeText={setPasswordFromUI}
        value={passwordFromUI}
        style={styles.input}
      />

      {errorMessageLabel && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessageLabel}</Text>
        </View>
      )}

      <Pressable onPress={loginPressed} style={styles.primaryBtn}>
        <Text style={styles.primaryBtnLabel}>Login</Text>
      </Pressable>

      <Pressable onPress={createAccountPressed} style={styles.secondaryBtn}>
        <Text style={styles.secondaryBtnLabel}>Create Account</Text>
      </Pressable>
      {/* <Pressable onPress={checkLoginStatus} style={styles.btn}>
          <Text style={[styles.btnLabel, { color: "#000" }]}>
            Check for logged in user?
          </Text>
        </Pressable> 
        <Pressable onPress={logoutUser} style={styles.btn}>
          <Text style={[styles.btnLabel, { color: "#000" }]}>Logout?</Text>
        </Pressable>*/}
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  primaryBtn: {
    backgroundColor: "purple",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 12,
  },
  primaryBtnLabel: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  secondaryBtn: {
    borderColor: "purple",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "100%",
  },
  secondaryBtnLabel: {
    color: "purple",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
});
