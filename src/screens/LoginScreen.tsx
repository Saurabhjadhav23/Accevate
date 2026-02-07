import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { loginApi } from '../api/authApi';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await loginApi(username, password);
      navigation.navigate('OTP', { userid: res.data.userid });
    } catch (error) {
      alert('Invalid Login or Password');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Image
        source={require('../assets/AccevateLogo.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          onChangeText={setUsername}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    width: 180,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },

  title: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    marginBottom:150
  },

  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#111827',
    fontSize: 15,
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 10,
  },

  btnText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
