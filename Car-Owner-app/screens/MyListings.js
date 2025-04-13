// Error Faced : VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead. [Component Stack]
// Solution: https://stackoverflow.com/questions/67623952/error-virtualizedlists-should-never-be-nested-inside-plain-scrollviews-with-th

import {
  StyleSheet,
  Text,
  View,
  ScrollView, //https://reactnative.dev/docs/scrollview to make the screen scrollable
  Pressable,
  Image,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDoc, getDocs, doc, query, where, deleteDoc } from "firebase/firestore";

const MyListings = ({ navigation }) => {
  const [carListings, setCarListings] = useState([]);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getCarListings();
    getBookings();
  }, [bookings]);

  const getCarListings = async() => {
    doQuery("car-listing", setCarListings);
  }

  const getBookings = async () => {
    doQuery("bookings", setBookings)
  }

  const doQuery = async (collectionName, setterFunc) => {
    try{
      let q, querySnapshot;
      if (collectionName === "bookings"){
        q = query(collection(db, collectionName), where("ownerId", "==", auth.currentUser.uid));
        querySnapshot = await getDocs(q);
      } else{
        q = query(collection(db, collectionName), where("userId","==", auth.currentUser.uid ));
        querySnapshot = await getDocs(q);
      }
      const results = [];
      querySnapshot.forEach((currDoc) => {
        results.push({...currDoc.data(), id: currDoc.id});
      });
      setterFunc(results);
    } catch (err) {
      console.log(err);
    }
  }

  const cancelbooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      alert("cancelled booking!");
    } catch (err) {
      console.log(err);
    }
  };

  //used to render listings
  const renderlisting = ({ item }) => (
    <View style={styles.listingcard}>
      <Image source={{ uri: item.imageUrl }} style={styles.imagestyle} />
      <View style={styles.cardtext}>
        <Text style={styles.carName}>{item.model}</Text>
        <Text style={styles.carPrice}>${item.pricePerDay}/day</Text>
        <Text style={styles.carInfo}>License: {item.licensePlate}</Text>
        <Text style={styles.carInfo}>
          Location: {item.address}, {item.city}
        </Text>
      </View>
    </View>
  );

  //used to render bookings
  const renderbooking = ({ item }) => (
    <View style={styles.bookingcard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingcarName}>{item.model}</Text>
      </View>

      <View style={styles.bookingtext}>
        <Text style={styles.bookingInfo}>Price: ${item.price}/day</Text>
        <Text style={styles.bookingInfo}>Renter: {item.renterId}</Text>
        {
          (item.status) ? 
            <Text style={styles.bookingInfo}>Status: Confirmed</Text> : 
            <Text style={styles.bookingInfo}>Status: Not Confirmed</Text>
        }
        <Text style={styles.bookingInfo}>
          Confirmation: {item.confirmationCode}
        </Text>
      </View>

      <Pressable
        style={styles.cancelbutton}
        onPress={() => cancelbooking(item.id)}
      >
        <Text style={styles.cancelbuttonText}>CANCEL BOOKING</Text>
      </Pressable>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.titlename}>My Car Listings</Text>


        {/* used to check if there is any listing, if there, show the listing,
        if not - show that the user has no listings*/} 
        {carListings.length == 0 ? (
          <View style={styles.emptyarea}>
            <Text style={styles.emptytext}>
              You don't have any car listings yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={carListings}
            renderItem={renderlisting}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>


      {/* used to check if there is any booking, if there, show the booking,
        if not - show that the user has no booking*/} 
      <View style={styles.section}>
        <Text style={styles.titlename}>My Bookings</Text>

        {bookings.length === 0 ? (
          <View style={styles.emptyarea}>
            <Text style={styles.emptytext}>
              You don't have any bookings yet
            </Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderbooking}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>

      {/*create new listing changes the screen to add nerw listing logic page*/} 
      <View style={styles.footer}>
        <Pressable
          style={styles.addlistingbutton}
          onPress={() => navigation.navigate("CreateListings")}
        >
          <Text style={styles.addlistingbuttonText}>+ Add New Listing</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  titlename: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "purple",
  },
  listingcard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  imagestyle: {
    width: "100%",
    height: 200,
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
  bookingcard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bookingcarName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  bookingtext: {
    marginBottom: 16,
  },
  bookingInfo: {
    fontSize: 14,
    color: "black",
    marginBottom: 6,
  },
  cancelbutton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelbuttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyarea: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
  },
  emptytext: {
    fontSize: 16,
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  addbutton: {
    backgroundColor: "purple",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addbuttonText: {
    color: "white",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 10,
    marginBottom: 30,
  },
  addlistingbutton: {
    backgroundColor: "purple",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  addlistingbuttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MyListings;

