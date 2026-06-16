import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth, db } from "../../services/firebase";

type Trip = {
  id: string;
  tripName: string;
  city: string;
  image: string;
  latitude: number;
  longitude: number;
};

export default function HomeScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);

  const getCacheKey = () => {
    const userId = auth.currentUser?.uid || "guest";
    return `cached_trips_${userId}`;
  };

  const loadCachedTrips = async () => {
    try {
      const cached = await AsyncStorage.getItem(getCacheKey());

      if (cached) {
        setTrips(JSON.parse(cached));
        setIsFromCache(true);
      }
    } catch (error) {
      console.log("Cache load error:", error);
    }
  };

  const fetchTrips = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setTrips([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "trips"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Trip[];

      setTrips(data);
      setIsFromCache(false);

      await AsyncStorage.setItem(getCacheKey(), JSON.stringify(data));
    } catch (error) {
      console.log("Fetch trips error:", error);
      await loadCachedTrips();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTrips();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTrips();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Travel Journal</Text>

      {isFromCache && (
        <View style={styles.cacheBox}>
          <Text style={styles.cacheText}>
            Offline mode: showing saved trips.
          </Text>
        </View>
      )}

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              {auth.currentUser ? "No trips yet" : "Login required"}
            </Text>
            <Text style={styles.emptyText}>
              {auth.currentUser
                ? "Add your first trip from Add Trip."
                : "Please login from Profile to see your trips."}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/trip/[id]",
                params: { id: item.id },
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.cardContent}>
              <Text style={styles.tripName}>{item.tripName}</Text>
              <Text style={styles.city}>📍 {item.city}</Text>
              <Text style={styles.coords}>
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </Text>
            </View>
          </Pressable>
        )}
      />
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
  },

  loadingText: {
    marginTop: 10,
    color: "black",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    color: "black",
  },

  cacheBox: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  cacheText: {
    color: "#856404",
  },

  emptyCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },

  emptyText: {
    color: "gray",
    marginTop: 8,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 180,
  },

  cardContent: {
    padding: 15,
  },

  tripName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
  },

  city: {
    fontSize: 16,
    marginTop: 5,
    color: "black",
  },

  coords: {
    fontSize: 13,
    marginTop: 5,
    color: "gray",
  },
});