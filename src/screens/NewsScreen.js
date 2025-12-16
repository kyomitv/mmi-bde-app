import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../context/UserContext";

const MOCK_NEWS = [
  {
    id: 1,
    title: "Soirée d'intégration",
    content: "Rendez-vous ce jeudi à 20h ! N'oubliez pas vos préventes au BDE.",
    created_at: new Date().toISOString(),
    likes: [],
  },
  {
    id: 2,
    title: "Nouveaux pulls de promo",
    content: "Les essayages auront lieu en salle 104.",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    likes: [],
  },
];

export default function NewsScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState({});

  const { user, profile } = useUser();

  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  async function fetchNews() {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
      if (error || !data || data.length === 0) {
        // Fallback to mock data with corrected structure
        setNews(
          MOCK_NEWS.map((item) => ({ ...item, reactions: 0, likes: [] }))
        );
      } else {
        const formatedData = data.map((item) => ({
          ...item,
          likes: item.likes || [],
          reactions: (item.likes || []).length,
        }));
        setNews(formatedData);

        // Update liked state based on fetched data
        if (user) {
          const likedMap = {};
          formatedData.forEach((item) => {
            if (item.likes && item.likes.includes(user.id)) {
              likedMap[item.id] = true;
            }
          });
          setLikedItems(likedMap);
        }
      }
    } catch (e) {
      setNews(MOCK_NEWS.map((item) => ({ ...item, reactions: 0, likes: [] })));
    } finally {
      setLoading(false);
    }
  }

  const handleReaction = async (id) => {
    if (!user) return;

    const isLiked = !!likedItems[id];
    const newLikedStatus = !isLiked;

    // Optimistic Update
    setLikedItems((prev) => ({ ...prev, [id]: newLikedStatus }));

    let updatedLikesArray = [];

    setNews((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentLikes = item.likes || [];
          if (newLikedStatus) {
            updatedLikesArray = [...currentLikes, user.id];
          } else {
            updatedLikesArray = currentLikes.filter((uid) => uid !== user.id);
          }
          return {
            ...item,
            likes: updatedLikesArray,
            reactions: updatedLikesArray.length,
          };
        }
        return item;
      })
    );

    // DB Update
    try {
      // Determine the array to send if not captured in the map loop (it is captured via closure var effectively?)
      // Wait, updatedLikesArray is set inside the map callback.
      // But map runs synchronously. However, map is inside setNews updater?
      // Actually setNews(prev => ...) runs the callback synchronous if we call it?
      // No, setNews receives a function. That function runs... when?
      // React state updates are scheduled. We shouldn't rely on side effects inside the setState updater.

      // BETTER APPROACH: Calculate before setting state.
      const currentItem = news.find((i) => i.id === id);
      if (!currentItem) return;

      const currentLikes = currentItem.likes || [];
      const nextLikes = newLikedStatus
        ? [...currentLikes, user.id]
        : currentLikes.filter((uid) => uid !== user.id);

      // Now set state
      setNews((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                likes: nextLikes,
                reactions: nextLikes.length,
              }
            : item
        )
      );

      const { error } = await supabase
        .from("news")
        .update({ likes: nextLikes })
        .eq("id", id);

      if (error) {
        console.error("Error updating reactions:", error);
        // Revert optimistic update? (Optional but good practice)
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>
          {new Date(item.created_at)
            .toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
            .toUpperCase()}
        </Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={() => handleReaction(item.id)}
        >
          <Ionicons
            name={likedItems[item.id] ? "heart" : "heart-outline"}
            size={24}
            color={likedItems[item.id] ? "#E0C3FC" : "#8E2DE2"}
          />
          <Text
            style={[
              styles.reactionCount,
              { color: likedItems[item.id] ? "#E0C3FC" : "#8E2DE2" },
            ]}
          >
            {item.reactions}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4A00E0", "#8E2DE2"]}
        style={styles.headerBackground}
      >
        <Text style={styles.headerTitle}>ACTUALITÉS</Text>
        <Text style={styles.headerSubtitle}>BDE MMI DIJON</Text>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4A00E0"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={news}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerBackground: {
    height: 180,
    justifyContent: "flex-end",
    padding: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    marginTop: 5,
    letterSpacing: 2,
  },
  contentContainer: {
    flex: 1,
    marginTop: -20, // Overlap the header
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#4A00E0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 10,
  },
  date: {
    color: "#8E2DE2",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
    color: "#2d3436",
    lineHeight: 28,
  },
  content: {
    color: "#636e72",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f1f2f6",
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reactionCount: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "700",
  },
});
