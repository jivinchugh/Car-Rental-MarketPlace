import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  Pressable,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { db, auth } from "../firebaseConfig";
import {
  doc,
  getDoc,
  addDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";

export default function SearchScreen() {
  const [currLocationLabel, setCurrLocationLabel] = useState();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [visibleMapRegion, setVisibleMapRegion] = useState({
    //default location set as - 255 Main Street, Toronto, ON, Canada
    latitude: 43.68731,
    longitude: -79.30065,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [listings, setListings] = useState([]);

  useEffect(() => {
    requestPermissions();
    getCurrLocation();
    getCarListings();
  }, []);

  //function to ask for permissions
  const requestPermissions = async () => {
    try {
      const permissionsObject =
        await Location.requestForegroundPermissionsAsync();
      if (permissionsObject.status === "granted") {
        alert("Location permission granted!");
      } else {
        alert("Permission denied!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrLocation = async () => {
    try {
      console.log("+++++++++++++++++ getCurrLocation");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log(location);
      const currentCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      //display on screen for location
      setCurrLocationLabel(
        `Lat: ${location.coords.latitude},\n Lng: ${location.coords.longitude}`
      );
      //update the currentPosition state variable
      setCurrentPosition(currentCoords);
      //update the visibleMapRegion to the current location
      setVisibleMapRegion({
        latitude: currentCoords.latitude,
        longitude: currentCoords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } catch (error) {
      console.error("ERROR: Failed to get current location", error);
      setCurrLocationLabel("ERROR: Failed to retrieve current location.");
    }
  };

  //function to get the car listings from the database
  const getCarListings = async () => {
    try {
      // 1. find all the listings (did not do a role check because the user is already logged in as a renter)
      const q = query(collection(db, "car-listing"));
      const querySnapshot = await getDocs(q);

      //2. iterate over the listings and create an array of objects
      const temp = []; //array to hold the listings
      for (const currDoc of querySnapshot.docs) {
        const data = currDoc.data();

        // 3. performing forward geocoding to convert address to coordinates
        //   using the address and city from the listing data, making it in one line to assist
        // forward geoocoding
        const addressFromUI = `${data.address}, ${data.city}`;
        try {
          const geocodedLocation = await Location.geocodeAsync(addressFromUI);
          console.log(geocodedLocation); // array of possible locations

          const result = geocodedLocation[0];
          if (result === undefined) {
            console.log(
              "No coordinates found for this address.",
              addressFromUI
            );
            continue; // it was break, but this would disturb the loop,
            // so changed it to continue in order to makesure that the loop
            //does not break, and continues to the next listing
          }

          // console.log(result);
          // console.log(`Latitude: ${result.latitude}`);
          // console.log(`Longitude: ${result.longitude}`);

          const outputString = `${addressFromUI} is located at ${result.latitude}, ${result.longitude}`;
          console.log(outputString);

          // 4. add to final listings array
          temp.push({
            ...data,
            id: currDoc.id,
            ownerId: data.userId,
            latitude: result.latitude,
            longitude: result.longitude,
          });
        } catch (geoErr) {
          console.log(`Geocoding failed for ${addressFromUI}`, geoErr);
        }
      }
      // 5. updating the state variabl
      setListings(temp);
    } catch (err) {
      console.log("Error fetching car listings:", err);
    }
  };

  const bookcarbtn = async (listing) => {
    try {
      const booking = {
        confirmationCode: "TURO-" + Math.floor(10000 + Math.random() * 90000),
        model: listing.model,
        price: listing.pricePerDay,
        imageUrl: listing.imageUrl,
        address: listing.address,
        city: listing.city,
        renterId: auth.currentUser.uid,
        ownerId: listing.ownerId,
        status: "confirmed",
      };
      await addDoc(collection(db, "bookings"), booking);
      alert("Booking successful for " + listing.model);
    } catch (err) {
      console.log("Error creating booking:", err); 
      alert("Failed to book the car. Please try again.");
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titlename}>Find Available Cars</Text>

      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={visibleMapRegion}>
          {currentPosition && (
            <Marker coordinate={currentPosition} pinColor="blue">
              <Callout>
                <Text>Current Location</Text>
              </Callout>
            </Marker>
          )}

          {listings.map((listing) => (
            <Marker
              key={listing.id}
              coordinate={{
                latitude: listing.latitude,
                longitude: listing.longitude,
              }}
            >
              <View style={styles.customMarker}>
                <Text style={styles.carPrice}>${listing.pricePerDay}</Text>
              </View>
              <Callout onPress={() => bookcarbtn(listing)}> {/* the whole card is pressable,
               because I was not able to make the BOOK-NOW button clicked, had to find a hack, 
               tried to make the whole callout container clickable and it miraculously worked  -- needs fix! */}
                <View style={styles.calloutContainer}>
                  <Image
                    source={{ uri: listing.imageUrl }}
                    style={styles.imagestyle}
                  />
                  <View style={styles.cardtext}>
                    <Text style={styles.carName}>{listing.model}</Text>
                    <Text style={styles.carPrice}>
                      ${listing.pricePerDay}/day
                    </Text>
                    <Text style={styles.carInfo}>
                      Owner: {listing.ownerId}
                    </Text>
                    <Text style={styles.carInfo}>
                      License: {listing.licensePlate}
                    </Text>
                    <Text style={styles.carInfo}>
                      Location: {listing.address}, {listing.city}
                    </Text>
                    <Pressable
                      style={styles.bookbutton}
                      onPress={() => bookcarbtn(listing)}
                    >
                      <Text style={styles.bookbuttonText}>BOOK NOW</Text>
                    </Pressable>
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  titlename: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    color: "purple",
    paddingHorizontal: 16,
  },
  map: {
    flex: 1,
    width: "100%",
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "purple",
    borderWidth: 4,
    backgroundColor: "white",
  },
  customMarker: {
    backgroundColor: "white",
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  calloutContainer: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  imagestyle: {
    width: "100%",
    height: 120,
  },
  cardtext: {
    padding: 16,
  },
  carName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  carPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginBottom: 8,
  },
  carInfo: {
    fontSize: 14,
    color: "black",
    marginBottom: 4,
  },
  bookbutton: {
    backgroundColor: "purple",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  bookbuttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
