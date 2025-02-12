import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
  Image,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      console.log("inside useffect storedUserId", storedUserId);
      if (storedUserId) {
        setUserId(storedUserId); // Ensure userId is set before rendering
      }
      console.log("userID = ", userId);
    };
    fetchUserData();
    fetchMessages();
  }, []);

  // Fetch previous messages from backend
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const storedUserId = await AsyncStorage.getItem("userId");
      //   console.log("inside fetchMessages storedUserId", storedUserId);
      const response = await axios.get(
        "http://{ip}:5000/api/chatbot/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const formattedMessages = response.data.messages
        .flatMap((msg) => [
          {
            _id: msg._id,
            text: msg.prompt,
            createdAt: new Date(msg.timestamp),
            user: {
              _id: storedUserId,
              name: "Me",
            },
          },
          msg.response
            ? {
                _id: msg._id + "-bot",
                text: msg.response,
                createdAt: new Date(msg.timestamp),
                user: {
                  _id: 2,
                  name: "Gemini Bot",
                  avatar:
                    "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
                },
              }
            : null,
        ])
        .filter((msg) => msg !== null)
        .reverse();

      setMessages(formattedMessages);
    } catch (error) {
      console.log("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send message and receive response
  const onSend = useCallback(async (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const { text } = newMessages[0];
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://{ip}:5000/api/chatbot/save",
        { prompt: text },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const botResponseText =
        response.data.conversation.messages[
          response.data.conversation.messages.length - 1
        ].response || "I'm thinking...";

      const botResponse = {
        _id: Math.random().toString(),
        text: botResponseText,
        createdAt: new Date(),
        user: { _id: 2, name: "Gemini Bot" },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botResponse])
      );
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }, []);

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
        {/* <Image source={userImage} width={100} height={100}/> */}
        <Button
          title="Delete All Chats"
          color="red"
          onPress={() => {
            Alert.alert(
              "Delete All Chats?",
              "Are you sure you want to delete all chats?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: deleteAllChats },
              ]
            );
          }}
        />
        <Button
          title="Logout"
          color="blue"
          onPress={() => {
            Alert.alert(
              "Delete All Chats?",
              "Are you sure you want to Logout!!",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: deleteAllChats },
              ]
            );
          }}
        />
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userId,
          name: "Me",
        }}
      />
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
