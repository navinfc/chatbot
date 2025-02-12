import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setToken = async (token) => {
        console.log(token);
        try {
          await AsyncStorage.setItem('token', token);
        } catch (error) {
          console.error('Error setting token:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://{ip}:5000/api/auth/login', { email, password });
            console.log('Login Successful:', response.data);
            setToken(response.data.token);
            await AsyncStorage.setItem('userId', response?.data?.user?.id);
            console.log(setToken);
            console.log("userID = ", AsyncStorage.getItem("userId"));
            navigation.replace('Chat');
        } catch (error) {
            console.log('Login Error:', error.response.data.message);
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
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '80%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 8, borderColor: '#ccc', backgroundColor: '#fff' },
    button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { marginTop: 10, color: '#007bff' },
});
