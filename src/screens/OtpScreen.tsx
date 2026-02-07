import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { otpVerifyApi } from '../api/authApi';
import { saveToken } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

const OtpScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userid } = route.params;
  console.log(route.params,'userId from otp');
  
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      const res = await otpVerifyApi(userid, otp);
      console.log(res,userid, otp,"res from otp")
      await saveToken(res.data.token);
      navigation.replace('Dashboard');
    } catch {
      alert('Invalid OTP');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.card}>
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your number
        </Text>

        <TextInput
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          placeholder="••••••"
          placeholderTextColor="#9ca3af"
          onChangeText={setOtp}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.btnText}>Verify & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OtpScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },

  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingVertical: 18,
    fontSize: 22,
    letterSpacing: 12,
    textAlign: 'center',
    color: '#111827',
    marginBottom: 24,
  },

  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
  },

  btnText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
