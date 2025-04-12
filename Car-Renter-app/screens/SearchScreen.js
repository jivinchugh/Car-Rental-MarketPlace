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

export default function SearchScreen() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [visibleMapRegion, setVisibleMapRegion] = useState({
    //default location set as - 255 Main Street, Toronto, ON, Canada
    latitude: 43.68731,
    longitude: -79.30065,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const listings = [
    {
      id: "1",
      model: "Ferrari Purosangue",
      pricePerDay: 105,
      licensePlate: "JIV-18",
      imageUrl:
        "https://i.gaw.to/content/photos/62/96/629669-ferrari-purosangue-2024.jpeg",
      latitude: 43.6532,
      longitude: -79.3832,
      address: "75 Crow Trail Dr",
      city: "Toronto",
      ownerName: "Jivin Chugh",
    },
    {
      id: "2",
      model: "Lamborghini Urus",
      pricePerDay: 95,
      licensePlate: "SEAN-22",
      imageUrl:
        "https://hips.hearstapps.com/hmg-prod/images/2025-lamborghini-urus-se-phev-106-67005496322ba.jpg",
      latitude: 43.661,
      longitude: -79.3802,
      address: "1750 Finch Ave E",
      city: "Toronto",
      ownerName: "Sean Muniz",
    },
  ];

  useEffect(() => {
    requestPermissions();
    getCurrLocation();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentPosition(coords);
      setVisibleMapRegion({
        ...coords,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    } catch (error) {
      console.log("Error fetching location", error);
    }
  };

  const handleBookPress = (listing) => {
    console.log("Car booked:", {
      model: listing.model,
      price: listing.pricePerDay,
      licensePlate: listing.licensePlate,
      owner: listing.ownerName,
      location: `${listing.address}, ${listing.city}`,
    });
    alert("Booking done!");
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
              <Callout onPress={() => handleBookPress(listing)}>
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
                      Owner: {listing.ownerName}
                    </Text>
                    <Text style={styles.carInfo}>
                      License: {listing.licensePlate}
                    </Text>
                    <Text style={styles.carInfo}>
                      Location: {listing.address}, {listing.city}
                    </Text>
                    <Pressable
                      style={styles.bookbutton}
                      onPress={() => handleBookPress(listing)}
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
