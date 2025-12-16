import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { supabase } from "../lib/supabase";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (!email) {
      Alert.alert("Erreur", "Veuillez entrer votre email");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      Alert.alert("Erreur", error.message);
      setLoading(false);
    } else {
      setLoading(false);
      navigation.navigate("VerifyOtp", { email });
    }
  }

  return (
    <LinearGradient
      colors={["#4A00E0", "#8E2DE2"]} // Deep Purple to Violet
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>BDE MMI</Text>
        <Text style={styles.subtitle}>
          Connectez-vous pour accéder à votre espace
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="prenom.nom@iut-dijon.u-bourgogne.fr"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={signInWithEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#4A00E0" />
          ) : (
            <Text style={styles.buttonText}>Recevoir mon code</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#4A00E0",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4A00E0",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#4A00E0",
    fontSize: 16,
    fontWeight: "700",
  },
});
