import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getToken } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'AuthLoading'>;

const AuthLoadingScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();

      if (token) {
        navigation.replace('Dashboard'); 
      } else {
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default AuthLoadingScreen;
