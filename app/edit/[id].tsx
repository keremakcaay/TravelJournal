import { router, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { db } from "../../services/firebase";

export default function EditTripScreen() {
  const { id } = useLocalSearchParams();

  const [tripName, setTripName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTrip = async () => {
    try {
      if (!id || typeof id !== "string") return;

      const snapshot = await getDoc(doc(db, "trips", id));

      if (snapshot.exists()) {
        const data = snapshot.data();
        setTripName(data.tripName);
        setCity(data.city);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load trip.");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    if (!tripName || !city) {
      Alert.alert("Missing information", "Please fill all fields.");
      return;
    }

    try {
      if (!id || typeof id !== "string") return;

      setSaving(true);

      await updateDoc(doc(db, "trips", id), {
        tripName,
        city,
      });

      Alert.alert("Success", "Trip updated successfully.");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Could not update trip.");
    } finally {
      setSaving(false);
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Edit Trip</Text>

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
        <Button
          title={saving ? "Saving..." : "Save Changes"}
          onPress={saveChanges}
          disabled={saving}
        />
      </View>

      <View style={styles.buttonBox}>
        <Button title="Cancel" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 25,
    color: "black",
  },

  input: {
    backgroundColor: "white",
    color: "black",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  buttonBox: {
    marginTop: 15,
  },
});