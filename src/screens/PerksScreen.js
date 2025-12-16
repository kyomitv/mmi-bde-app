import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { supabase } from "../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Fallback data
const MOCK_PERKS = [
  {
    id: 1,
    title: "Verre à 5€",
    description: "Sur tous les bières et softs",
    company: "Le 3310",
    latitude: 47.317525421186474,
    longitude: 5.034653223942003,
  },
  {
    id: 2,
    title: "Réduction 50%",
    description: "Sur tous les jeux de sociétés",
    company: "Jocade",
    latitude: 47.32065992339084,
    longitude: 5.038216247569747,
  },
  {
    id: 3,
    title: "Pinte à 4€",
    description: "Sur la bière blonde",
    company: "Le Cellier",
    latitude: 47.325747011287596,
    longitude: 5.033844158877657,
  },
];

export default function PerksScreen() {
  const [perks, setPerks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    fetchPerks();
  }, []);

  async function fetchPerks() {
    try {
      const { data, error } = await supabase.from("perks").select("*");
      if (error || !data || data.length === 0) {
        setPerks(MOCK_PERKS);
      } else {
        setPerks(data);
      }
    } catch (e) {
      setPerks(MOCK_PERKS);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="pricetag" size={20} color="#fff" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.company}>{item.company || item.company_name}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>AVANTAGES</Text>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}
          style={styles.toggleButton}
        >
          <LinearGradient
            colors={["#4A00E0", "#8E2DE2"]}
            style={styles.gradientButton}
          >
            <Ionicons
              name={viewMode === "list" ? "map" : "list"}
              size={20}
              color="#fff"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A00E0" />
      ) : viewMode === "list" ? (
        <FlatList
          data={perks}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          contentContainerStyle={styles.list}
        />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 47.329,
            longitude: 5.048,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {perks.map((perk, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: perk.latitude || 49.25,
                longitude: perk.longitude || 4.03,
              }}
              title={perk.company || perk.company_name}
              description={perk.title}
              pinColor="#4A00E0"
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    marginTop: 60,
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#2d3436",
    letterSpacing: 2,
  },
  toggleButton: {
    borderRadius: 20,
    shadowColor: "#4A00E0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  gradientButton: {
    padding: 10,
    borderRadius: 20,
  },
  list: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8E2DE2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  company: {
    color: "#8E2DE2",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 2,
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d3436",
  },
  description: {
    color: "#636e72",
    fontSize: 13,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 150,
  },
});
