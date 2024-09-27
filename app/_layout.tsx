import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { LogBox, View } from 'react-native';
import OnBoarding from './(routes)/onboard';
import { Stack } from 'expo-router';
import { ToastProvider } from 'react-native-toast-notifications';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  if (!loaded) {
    return null;
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name='(routes)/welcome-intro/index' />
        <Stack.Screen
          name='(routes)/course-details/index'
          options={{
            headerShown: true,
            title: "Chi tiết khóa học",
            headerBackTitle: "Trở về"
          }}
        />
        <Stack.Screen
          name='(routes)/course-access/index'
          options={{
            headerShown: true,
            title: "Bài giảng khóa học",
            headerBackTitle: "Trở về"
          }}
        />
        <Stack.Screen
          name="(routes)/enrolled-courses/index"
          options={{
            headerShown: true,
            title: "Khóa học đã tham gia",
            headerBackTitle: "Trở về"
          }}
        />
        <Stack.Screen
          name="(routes)/cart/index"
          options={{
            headerShown: true,
            title: "Khóa học đã chọn",
            headerBackTitle: "Trở về"
          }}
        />
        <Stack.Screen
          name='(routes)/profile-details/index'
          options={{
            headerShown: true,
            title: "Chi tiết hồ sơ cá nhân",
            headerBackTitle: "Trở về"
          }}
        />
      </Stack>
    </ToastProvider>
  );
}
