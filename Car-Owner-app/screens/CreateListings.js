import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { useState } from "react";

const CreateListings = ({ navigation }) => {
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    //making sure eery field is filled
    if ( !model || !licensePlate || !pricePerDay || !city || !address || !imageUrl) {
      alert("Please fill all required fields");
      return;
    }

    console.log({
      model,
      licensePlate,
      pricePerDay,
      imageUrl,
      city,
      address,
      ownerId: "placeholder-owner-id",
    });

    alert("Listing created successfully!");
    //changing the screen to MyListings after creating the listing
    navigation.navigate("MyListings");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Car Listing</Text>

      <Text style={styles.label}>Car Model</Text>
      <TextInput
        style={styles.input}
        placeholder="Urus, Purosangue, R8, etc."
        value={model}
        onChangeText={setModel}
      />

      <Text style={styles.label}>License Plate</Text>
      <TextInput
        style={styles.input}
        placeholder="CAN-2003"
        value={licensePlate}
        onChangeText={setLicensePlate}
      />

      <Text style={styles.label}>Daily Rental Price (CAD) </Text>
      <TextInput
        style={styles.input}
        placeholder="50"
        value={pricePerDay}
        onChangeText={setPricePerDay}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Car Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://www.carimage.jpg"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Toronto, Vancouver, etc."
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>Address </Text>
      <TextInput
        style={styles.input}
        placeholder="1750 Finch Ave E"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.note}>All fields required to be filled</Text>

      <Pressable style={styles.submitbutton} onPress={handleSubmit}>
        <Text style={styles.submitbuttonText}>Create Listing</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "purple",
    marginVertical: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "black",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  note: {
    fontSize: 14,
    color: "red",
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
  },
  submitbutton: {
    backgroundColor: "purple",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  submitbuttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateListings;
