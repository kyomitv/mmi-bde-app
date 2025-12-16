import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../context/UserContext";

export default function ProfileScreen() {
  const { user, profile, refreshProfile } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile || user) {
      setFirstName(
        profile?.first_name ||
          user?.email?.split("@")[0].split(".")[0].toUpperCase() ||
          ""
      );
      setLastName(
        profile?.last_name ||
          user?.email?.split("@")[0].split(".")[1].toUpperCase() ||
          ""
      );
    }
  }, [profile, user]);

  async function updateProfile() {
    try {
      setSaving(true);
      if (!user) throw new Error("No user logged in!");

      const updates = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      await refreshProfile(); // Update global context immediately
      Alert.alert("Succès", "Profil mis à jour !");
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert("Erreur", error.message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MON PROFIL</Text>

      <View style={styles.form}>
        <Text style={styles.label}>PRÉNOM</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Votre prénom"
        />

        <Text style={styles.label}>NOM</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Votre nom"
        />

        <TouchableOpacity onPress={updateProfile} disabled={saving}>
          <LinearGradient
            colors={["#4A00E0", "#8E2DE2"]}
            style={styles.saveButton}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>ENREGISTRER</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>SE DÉCONNECTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 40,
    color: "#333",
    letterSpacing: 2,
  },
  form: {
    marginBottom: 40,
  },
  label: {
    fontSize: 12,
    color: "#8E2DE2",
    marginBottom: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
    padding: 10,
    fontSize: 18,
    marginBottom: 30,
    color: "#333",
    fontWeight: "500",
  },
  saveButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#4A00E0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  logoutButton: {
    backgroundColor: "#ffffffff",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    borderColor: "#ff2020ff",
    borderWidth: 2,
  },
  logoutButtonText: {
    color: "#ff2020ff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
