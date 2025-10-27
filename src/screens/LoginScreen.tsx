import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { signInWithGoogle } from '../services/auth';

const LoginScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View className="flex-1 justify-center items-center px-8">
        <View className="w-24 h-24 bg-blue-500 rounded-3xl justify-center items-center mb-6 shadow-lg">
          <Text className="text-5xl">📝</Text>
        </View>

        <Text className="text-4xl font-bold text-gray-800 mb-3">Notes App</Text>
        <Text className="text-base text-gray-600 text-center mb-12 leading-6">
          Organize your thoughts, ideas, and tasks in one place
        </Text>

        <TouchableOpacity
          className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 px-6 flex-row items-center justify-center shadow-sm"
          onPress={handleGoogleSignIn}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#1F2937" />
          ) : (
            <>
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                }}
                className="w-6 h-6 mr-3"
              />
              <Text className="text-base font-semibold text-gray-700">
                Sign in with Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text className="text-xs text-gray-500 mt-6">
          Secure authentication powered by Firebase
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
