import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Button,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { auth, db } from "../../services/firebase";

export default function ProfileScreen() {
  const [totalTrips, setTotalTrips] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  const fetchStats = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, "trips"));
      setTotalTrips(snapshot.size);
    } catch (error) {
      console.log("Profile stats error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged out", "You have been logged out.");
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Logout Error", error.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Account</Text>

        {user ? (
          <>
            <Text style={styles.value}>{user.email}</Text>

            <View style={styles.buttonSpace}>
              <Button title="Logout" color="red" onPress={logout} />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.value}>Not logged in</Text>

            <View style={styles.buttonSpace}>
              <Button title="Login" onPress={() => router.push("/login")} />
            </View>

            <View style={styles.buttonSpace}>
              <Button
                title="Create Account"
                onPress={() => router.push("/register")}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>App Name</Text>
        <Text style={styles.value}>Travel Journal</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Trips</Text>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.bigNumber}>{totalTrips}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Features</Text>
        <Text style={styles.feature}>✅ Firebase Firestore</Text>
        <Text style={styles.feature}>✅ Photo Picker</Text>
        <Text style={styles.feature}>✅ GPS Location</Text>
        <Text style={styles.feature}>✅ Delete Trip</Text>
        <Text style={styles.feature}>✅ Login / Register</Text>
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

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 25,
    color: "black",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: "gray",
    marginBottom: 8,
  },

  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },

  bigNumber: {
    fontSize: 42,
    fontWeight: "bold",
    color: "black",
  },

  feature: {
    fontSize: 16,
    marginTop: 5,
    color: "black",
  },

  buttonSpace: {
    marginTop: 15,
  },
});