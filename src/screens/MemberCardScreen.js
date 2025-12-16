import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../context/UserContext";

const { width } = Dimensions.get("window");

export default function MemberCardScreen() {
  const { user, profile } = useUser();

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    return (
      user?.email?.split("@")[0].replace(".", " ").toUpperCase() || "ETUDIANT"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>MA CARTE</Text>

      <LinearGradient
        colors={["#4A00E0", "#8E2DE2", "#4A00E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardLogo}>BDE MMI</Text>
          <Text style={styles.year}>2025</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.label}>TITULAIRE</Text>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {getDisplayName()}
          </Text>
          <Text style={styles.role}>MEMBRE ADHÉRENT</Text>
        </View>

        <View style={styles.qrContainer}>
          <QRCode
            value={user?.id || "demo-member-id"}
            size={80}
            backgroundColor="transparent"
            color="#000"
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 80,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 40,
    color: "#2d3436",
    letterSpacing: 2,
  },
  card: {
    width: width - 40,
    height: 220,
    borderRadius: 25,
    padding: 25,
    justifyContent: "space-between",
    shadowColor: "#4A00E0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLogo: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  year: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    opacity: 0.8,
  },
  cardContent: {
    marginTop: 10,
  },
  label: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 1,
  },
  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    maxWidth: "65%",
  },
  role: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
  },
  qrContainer: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
});
