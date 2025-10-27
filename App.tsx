import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import '@react-native-firebase/app';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
// import './global.css';
import { onAuthStateChanged } from './src/services/auth';
import AppNavigator from './src/navigation/AppNavigation';

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authUser => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return user ? <AppNavigator /> : <LoginScreen />;
};

export default App;
