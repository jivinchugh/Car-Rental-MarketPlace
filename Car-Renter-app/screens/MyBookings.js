import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig"; 

const MyBookings = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const user = getAuth().currentUser;
      if (!user) return;

      const bookingsQuery = query(
        collection(db, "bookings"),
        where("renterId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(bookingsQuery, (querySnapshot) => {
        const userBookings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(userBookings);
      });

      return () => unsubscribe(); // Clean up listener
    }, [])
  );

  const handleCancelBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      alert("Cancelled booking!");
    } catch (err) {
      console.log(err);
    }
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingcard}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.imagestyle}
        resizeMode="cover"
      />
      <View style={styles.cardtext}>
        <Text style={styles.carName}>{item.model}</Text>
        
        <Text style={styles.carPrice}>${item.price}/day</Text>
        <Text style={styles.carInfo}>Status: {item.status}</Text>
        <Text style={styles.carInfo}>
          Confirmation Code: {item.confirmationCode}
        </Text>
        <Text style={styles.carInfo}>
          Pickup Location: {item.address}, {item.city}
        </Text>
        <Pressable
          style={styles.cancelbutton}
          onPress={() => handleCancelBooking(item.id)}
        >
          <Text style={styles.cancelbuttonText}>CANCEL BOOKING</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titlename}>My Bookings</Text>

      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item.id}
          style={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyarea}>
          <Text style={styles.emptyTitle}>No Bookings Found</Text>
          <Text style={styles.emptytext}>
            You don't have any active car bookings at the moment.
          </Text>
          <Pressable
            style={styles.addbutton}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Text style={styles.addbuttonText}>SEARCH FOR CARS</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titlename: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "purple",
    marginTop: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookingcard: {
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
  cancelbutton: {
    backgroundColor: "red",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
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
    flex: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 12,
  },
  emptytext: {
    fontSize: 16,
    color: "red",
    marginBottom: 16,
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
});

export default MyBookings;
