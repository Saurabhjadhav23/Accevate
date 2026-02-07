import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import axios from 'axios';

const App = () => {
  useEffect(() => {
    axios.get('https://your-api-base-url/login')
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
  }, []);
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;
