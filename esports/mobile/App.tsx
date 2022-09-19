import { StatusBar } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black
} from '@expo-google-fonts/inter';
import { Background } from './src/components/Background';
import {Home} from './src/screens/Home';
import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';
import * as Notifications from 'expo-notifications';

import './src/services/notificationConfigs'
import {getPushNotificationsToken} from './src/services/getPushNotificationToken'
import { useEffect, useRef } from 'react';
import { Subscription } from 'expo-modules-core';



export default function App() {
  const getNotificationListener = useRef<Subscription>()
  const responseNotificationListener = useRef<Subscription>()
  
  useEffect(()=>{
    getPushNotificationsToken()
  },[])

  useEffect(()=>{
    getNotificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('notification received:', notification)
    })

    responseNotificationListener.current = Notifications.addNotificationReceivedListener(response => {
      console.log('response:', response)
    })

    return () => {
      if(getNotificationListener.current && responseNotificationListener.current) {
        Notifications.removeNotificationSubscription(getNotificationListener.current)
        Notifications.removeNotificationSubscription(responseNotificationListener.current)
      }
    }
  },[])

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black});
  return (
    <Background >
      <StatusBar 
        barStyle={"light-content"}
        backgroundColor="transparent"
        translucent
        />
    {fontsLoaded ? <Routes /> : <Loading />}
    </Background>
  );
}