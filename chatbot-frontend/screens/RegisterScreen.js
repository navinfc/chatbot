import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://192.168.1.7:5000/api/auth/register', { name, email, password });
            navigation.replace('Login');
        } catch (error) {
            console.log('Register Error:', error.response.data.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f8f8' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    input: { width: '80%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 8, borderColor: '#ccc', backgroundColor: '#fff' },
    button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { marginTop: 10, color: '#007bff' },
});
