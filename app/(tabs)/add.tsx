import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth, db } from "../../services/firebase";

export default function AddTripScreen() {
  const [tripName, setTripName] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Gallery permission is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const getLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission needed", "Location permission is required.");
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const saveTrip = async () => {
    if (!auth.currentUser) {
      Alert.alert("Login Required", "You must login before adding a trip.");
      return;
    }

    if (!tripName || !city || !image || !location) {
      Alert.alert("Missing information", "Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "trips"), {
        tripName,
        city,
        image,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Trip saved successfully!");

      setTripName("");
      setCity("");
      setImage(null);
      setLocation(null);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Add New Trip</Text>

      <TextInput
        style={styles.input}
        placeholder="Trip Name"
        placeholderTextColor="gray"
        value={tripName}
        onChangeText={setTripName}
      />

      <TextInput
        style={styles.input}
        placeholder="City"
        placeholderTextColor="gray"
        value={city}
        onChangeText={setCity}
      />

      <View style={styles.buttonBox}>
        <Button title="Choose Photo" onPress={choosePhoto} />
      </View>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={styles.buttonBox}>
        <Button title="Get Location" onPress={getLocation} />
      </View>

      {location && (
        <View style={styles.locationBox}>
          <Text style={styles.locationText}>
            Latitude: {location.coords.latitude}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.coords.longitude}
          </Text>
        </View>
      )}

      <View style={styles.buttonBox}>
        <Button
          title={loading ? "Saving..." : "Save Trip"}
          onPress={saveTrip}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 40,
    color: "black",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "white",
    color: "black",
    fontSize: 16,
  },

  buttonBox: {
    marginTop: 15,
  },

  image: {
    width: "100%",
    height: 220,
    marginTop: 20,
    borderRadius: 15,
  },

  locationBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  locationText: {
    color: "black",
    fontSize: 15,
  },
});