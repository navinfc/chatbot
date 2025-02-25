import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatListScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch all chat screens
  const fetchChats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://192.168.1.7:5000/api/chatbot/all-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChats(response.data.chats);
    } catch (error) {
      console.log("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat screen
  const createChat = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post("http://192.168.1.7:5000/api/chatbot/create", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const newChat = response.data.chat;
      console.log(newChat);
  
      // Update the chat list
      setChats([...chats, newChat]);
  
      // Navigate to ChatScreen with the new chat ID
      navigation.navigate("Chat", { chatId: newChat._id });
  
    } catch (error) {
      console.log("Error creating chat:", error);
    }
  };

  // Delete a specific chat screen
  const deleteChat = async (chatId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://192.168.1.7:5000/api/chatbot/${chatId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChats(chats.filter(chat => chat._id !== chatId));
    } catch (error) {
      console.log("Error deleting chat:", error);
    }
  };

  // Delete all chat screens
  const deleteAllChats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete("http://192.168.1.7:5000/api/chatbot/delete-all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChats([]);
    } catch (error) {
      console.log("Error deleting all chats:", error);
    }
  };

  // Logout function (fixed)
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Remove token
      await AsyncStorage.removeItem("userId"); // Remove userId
      navigation.replace("Login"); // Navigate to Login screen
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Create New Chat" onPress={createChat} color="green" />
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>
            <TouchableOpacity onPress={() => navigation.navigate("Chat", { chatId: item._id })}>
              <Text style={styles.chatText}>Chat {item._id.slice(-4)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteChat(item._id)}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {chats.length > 0 && <Button title="Delete All Chats" color="red" onPress={deleteAllChats} />}
      <View style={{margin: 5}}></View>
      <Button
                title="Logout"
                color="blue"
                onPress={() =>
                  Alert.alert("Logout?", "Are you sure?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Logout", onPress: logout },
                  ])
                }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  chatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  chatText: { fontSize: 18 },
  deleteText: { fontSize: 18, color: "red" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
