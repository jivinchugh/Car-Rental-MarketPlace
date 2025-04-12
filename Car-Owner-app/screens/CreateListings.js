import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { useState } from "react";
import {db, auth} from '../firebaseConfig'
import {collection, addDoc} from "firebase/firestore";

const CreateListings = ({ navigation }) => { 
  const [modelUi, setModelUi] = useState("");
  const [licensePlateUi, setLicensePlateUi] = useState("");
  const [pricePerDayUi, setPricePerDayUi] = useState("");
  const [imageUrlUi, setImageUrlUi] = useState("");
  const [cityUi, setCityUi] = useState("");
  const [addressUi, setAddressUi] = useState("");

  // function for creating a new listing
  const handleSubmit = async () => {
    //making sure eery field is filled
    if ( !modelUi || !licensePlateUi || !pricePerDayUi || !cityUi || !addressUi || !imageUrlUi) {
      alert("Please fill all required fields");
      return;
    }

    const pricePerDayInt = Number(pricePerDayUi);

    // object that will be added into the db
    const newListing = {
      model: modelUi,
      licensePlate: licensePlateUi,
      pricePerDay: pricePerDayInt,
      city: cityUi,
      address: addressUi, 
      imageUrl: imageUrlUi,
      userId: auth.currentUser.uid      
    }

    try {
      const docRef = await addDoc(collection(db, "car-listing"), newListing);
      alert("Listing created successfully")
      console.log(`ID of inserted document is: ${docRef.id}`);
    } catch (err){
      console.log(err);
    }
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
        value={modelUi}
        onChangeText={setModelUi}
      />

      <Text style={styles.label}>License Plate</Text>
      <TextInput
        style={styles.input}
        placeholder="CAN-2003"
        value={licensePlateUi}
        onChangeText={setLicensePlateUi}
      />

      <Text style={styles.label}>Daily Rental Price (CAD) </Text>
      <TextInput
        style={styles.input}
        placeholder="50"
        value={pricePerDayUi}
        onChangeText={setPricePerDayUi}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Car Image URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://www.carimage.jpg"
        value={imageUrlUi}
        onChangeText={setImageUrlUi}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Toronto, Vancouver, etc."
        value={cityUi}
        onChangeText={setCityUi}
      />

      <Text style={styles.label}>Address </Text>
      <TextInput
        style={styles.input}
        placeholder="1750 Finch Ave E"
        value={addressUi}
        onChangeText={setAddressUi}
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
