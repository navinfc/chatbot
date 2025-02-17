import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatScreen({ route, navigation }) {
  const { chatId } = route.params; // Get chatId from navigation
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  // const [userId, setUserId] = useState("abcde");
  const userId = "abcde";
=======
  const [userId, setUserId] = useState("random");

  //Delete ALL CHATS
  const deleteAllChats = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete("http://{ip}:5000/api/chatbot/delete-all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Clear all messages from state
      setMessages([]);
    } catch (error) {
      console.log("Error deleting all chats:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Remove token
      await AsyncStorage.removeItem("userId"); // Remove userId

      navigation.replace("Login"); // Navigate to Login screen
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };
>>>>>>> 278bc8f700a1a1f84b1e9e746c3b4c822f046c2f

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      // console.log("storedUserId 22 = ", storedUserId);
      if (storedUserId.length > 0) {
        // setUserId(Math.random().toString());
        // console.log("userId 25 = ", userId);
      }
    };
    fetchUserData();
    fetchMessages();
  }, []);

  // Fetch messages for the selected chat screen
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
<<<<<<< HEAD
      const response = await axios.get(`http://192.168.1.6:5000/api/chatbot/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
=======
      const storedUserId = await AsyncStorage.getItem("userId");
      //   console.log("inside fetchMessages storedUserId", storedUserId);
      const response = await axios.get(
        "http://{ip}:5000/api/chatbot/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
>>>>>>> 278bc8f700a1a1f84b1e9e746c3b4c822f046c2f

      const formattedMessages = response.data.messages
        .flatMap((msg) => [
          {
            _id: msg._id,
            text: msg.prompt,
            createdAt: new Date(msg.timestamp),
            user: { _id: userId, name: "Me User" },
          },
          msg.response
            ? {
                _id: msg._id + "-bot",
                text: msg.response,
                createdAt: new Date(msg.timestamp),
                user: {
                  _id: 2, // Bot messages always have a different ID
                  name: "Gemini Bot",
                  avatar: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
                },
              }
            : null,
        ])
        .filter(Boolean)
        .reverse();

      setMessages(formattedMessages);
    } catch (error) {
      console.log("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send message to chatbot
  const onSend = useCallback(async (newMessages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

    const { text } = newMessages[0];
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.post(
<<<<<<< HEAD
        `http://192.168.1.6:5000/api/chatbot/${chatId}/send`,
=======
        "http://{ip}:5000/api/chatbot/save",
>>>>>>> 278bc8f700a1a1f84b1e9e746c3b4c822f046c2f
        { prompt: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botResponse = {
        _id: Math.random().toString(),
        text: response.data.chat.messages.slice(-1)[0].response || "I'm thinking...",
        createdAt: new Date(),
        user: { _id: 2, name: "Gemini Bot" },
      };

      setMessages((prevMessages) => GiftedChat.append(prevMessages, [botResponse]));
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }, []);

  // Delete all chat screens
  // const deleteAllChats = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     await axios.delete("http://192.168.1.6:5000/api/chatbot/delete-all", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     navigation.replace("ChatListScreen"); // Go back to chat list after deletion
  //   } catch (error) {
  //     console.log("Error deleting all chats:", error);
  //   }
  // };

  // Delete only the specific chat screen
  const deleteChatScreen = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://192.168.1.6:5000/api/chatbot/${chatId}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigation.replace("ChatListScreen"); // Navigate back to the chat list
    } catch (error) {
      console.log("Error deleting chat screen:", error);
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
    <>
      <View style={styles.buttonContainer}>
        <Button
          title="Delete Chat"
          color="red"
          onPress={() =>
            Alert.alert("Delete Chat?", "Are you sure?", [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", onPress: deleteChatScreen },
            ])
          }
        />
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
      <GiftedChat messages={messages} onSend={(messages) => onSend(messages)} user={{ _id: userId, name: "Me User" }} alignTop={true}/>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
  },
});
