import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './theme';
import { isConfigured } from './config';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import Navigator from './Navigator';
import AuthScreen from './screens/AuthScreen';
import SetupScreen from './screens/SetupScreen';
import SplashScreen from './screens/SplashScreen';

function Gate() {
  const { ready, onboarded, user, finishOnboarding } = useAuth();
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!onboarded) return <SplashScreen onStart={finishOnboarding} />;
  if (!user) return <AuthScreen />;
  return (
    <TasksProvider key={user.id}>
      <Navigator />
    </TasksProvider>
  );
}

export default function AppRoot() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      {isConfigured ? (
        <AuthProvider>
          <Gate />
        </AuthProvider>
      ) : (
        <SetupScreen />
      )}
    </SafeAreaProvider>
  );
}
