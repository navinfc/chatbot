import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.7:5000/api/auth/login", {
        email,
        password,
      });

      console.log("Login Successful:", response.data);

      // Store token & userId
      await AsyncStorage.setItem("token", response.data.token);
      await AsyncStorage.setItem("userId", response?.data?.user?.id);

      // Navigate to Chat List where user can select previous chat screens
      navigation.replace("ChatListScreen");
    } catch (error) {
      console.log("Login Error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f8f8" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "80%", padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 8, borderColor: "#ccc", backgroundColor: "#fff" },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 10, color: "#007bff" },
});
