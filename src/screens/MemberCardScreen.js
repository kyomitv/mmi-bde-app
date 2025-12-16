import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  StatusBar,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { LinearGradient } from "expo-linear-gradient";
import * as Brightness from "expo-brightness";
import { useUser } from "../context/UserContext";

const { width } = Dimensions.get("window");

export default function MemberCardScreen() {
  const { user, profile } = useUser();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [originalBrightness, setOriginalBrightness] = useState(1);

  const getDisplayName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    return (
      user?.email?.split("@")[0].replace(".", " ").toUpperCase() || "ETUDIANT"
    );
  };

  const openFullScreen = async () => {
    try {
      // Demander les permissions et sauvegarder la luminosité actuelle
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === "granted") {
        const currentBrightness = await Brightness.getBrightnessAsync();
        setOriginalBrightness(currentBrightness);
        await Brightness.setBrightnessAsync(1); // Luminosité au maximum
      }
      setIsFullScreen(true);
    } catch (error) {
      console.log("Erreur lors de la modification de la luminosité:", error);
      setIsFullScreen(true); // Ouvrir quand même le modal
    }
  };

  const closeFullScreen = async () => {
    try {
      // Restaurer la luminosité d'origine
      await Brightness.setBrightnessAsync(originalBrightness);
    } catch (error) {
      console.log("Erreur lors de la restauration de la luminosité:", error);
    }
    setIsFullScreen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>MA CARTE</Text>

      <TouchableOpacity activeOpacity={0.9} onPress={openFullScreen}>
        <LinearGradient
          colors={["#4A00E0", "#8E2DE2", "#4A00E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardLogo}>BDE MMI</Text>
            <Text style={styles.year}>{new Date().getFullYear()}</Text>
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
      </TouchableOpacity>

      {/* Modal plein écran */}
      <Modal
        visible={isFullScreen}
        transparent={false}
        animationType="fade"
        onRequestClose={closeFullScreen}
      >
        <TouchableOpacity
          style={styles.fullScreenContainer}
          activeOpacity={1}
          onPress={closeFullScreen}
        >
          <StatusBar hidden />
          <LinearGradient
            colors={["#4A00E0", "#8E2DE2", "#4A00E0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fullScreenCard}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLogoLarge}>BDE MMI</Text>
              <Text style={styles.yearLarge}>{new Date().getFullYear()}</Text>
            </View>

            <View style={styles.cardContentLarge}>
              <Text style={styles.labelLarge}>TITULAIRE</Text>
              <Text
                style={styles.nameLarge}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {getDisplayName()}
              </Text>
              <Text style={styles.roleLarge}>MEMBRE ADHÉRENT</Text>
            </View>

            <View style={styles.qrContainerLarge}>
              <QRCode
                value={user?.id || "demo-member-id"}
                size={230}
                backgroundColor="transparent"
                color="#000"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Modal>
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
  // Styles pour le modal plein écran
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenCard: {
    width: "90%",
    height: "70%",
    borderRadius: 35,
    padding: 40,
    justifyContent: "space-between",
  },
  cardLogoLarge: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 2,
  },
  yearLarge: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    opacity: 0.8,
  },
  cardContentLarge: {
    marginTop: 20,
  },
  labelLarge: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 2,
  },
  nameLarge: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  roleLarge: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 3,
  },
  qrContainerLarge: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
});
