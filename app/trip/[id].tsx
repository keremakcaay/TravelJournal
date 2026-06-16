import { router, useLocalSearchParams } from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../../services/firebase";

type Trip = {
  tripName: string;
  city: string;
  image: string;
  latitude: number;
  longitude: number;
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`
      );

      const data = await response.json();

      if (data.current) {
        setTemperature(data.current.temperature_2m);
      }
    } catch (error) {
      console.log("Weather error:", error);
    }
  };

  const fetchTrip = async () => {
    try {
      if (!id || typeof id !== "string") {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "trips", id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const tripData = snapshot.data() as Trip;
        setTrip(tripData);
        await fetchWeather(tripData.latitude, tripData.longitude);
      }
    } catch (error) {
      console.log("Trip detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async () => {
    try {
      if (!id || typeof id !== "string") return;

      await deleteDoc(doc(db, "trips", id));

      Alert.alert("Deleted", "Trip deleted successfully.");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Could not delete trip.");
    }
  };

  const confirmDelete = () => {
    Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: deleteTrip },
    ]);
  };

  const goToEdit = () => {
    if (!id || typeof id !== "string") return;

    router.push({
      pathname: "/edit/[id]",
      params: { id },
    });
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Loading trip...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Trip not found.</Text>

        <View style={styles.buttonBox}>
          <Button title="Back to Home" onPress={() => router.replace("/(tabs)")} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: trip.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{trip.tripName}</Text>
        <Text style={styles.city}>📍 {trip.city}</Text>

        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>🌤 Current Temperature</Text>

          {temperature !== null ? (
            <Text style={styles.weatherTemp}>{temperature}°C</Text>
          ) : (
            <Text style={styles.value}>Weather data unavailable.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location</Text>

          <Text style={styles.label}>Latitude</Text>
          <Text style={styles.value}>{trip.latitude}</Text>

          <Text style={styles.label}>Longitude</Text>
          <Text style={styles.value}>{trip.longitude}</Text>
        </View>

        <View style={styles.buttonBox}>
          <Button title="Edit Trip" onPress={goToEdit} />
        </View>

        <View style={styles.buttonBox}>
          <Button title="Delete Trip" color="red" onPress={confirmDelete} />
        </View>

        <View style={styles.buttonBox}>
          <Button title="Back to Home" onPress={() => router.replace("/(tabs)")} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },

  text: {
    color: "black",
  },

  image: {
    width: "100%",
    height: 300,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },

  city: {
    fontSize: 18,
    marginTop: 8,
    color: "black",
  },

  weatherCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },

  weatherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },

  weatherTemp: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 10,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: "gray",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    color: "black",
  },

  buttonBox: {
    marginTop: 20,
  },
});