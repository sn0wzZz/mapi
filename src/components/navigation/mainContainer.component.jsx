import React from 'react'
import { StatusBar } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'

// Screens
import HomeScreen from '../screens/homeScreen.component'
import ListScreen from '../screens/listScreen.component'

import { ACCENT_COLOR } from '../../variables'

const homeName = 'Home'
const listName = 'List'

const Tab = createBottomTabNavigator()

export default function MainContainer() {
  const options = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: ACCENT_COLOR,
    tabBarInactiveTintColor: ACCENT_COLOR,
    tabBarShowLabel: false,
    tabBarStyle: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      elevation: 0,
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      backDropFilter: 'blur(20px)',
      height: 60,
      borderTopWidth: 0,
      borderRadius: 40,
    },
    tabBarIcon: ({ focused, color, size }) => {
      let iconName
      let rn = route.name

      if (rn === homeName) {
        iconName = focused ? 'location' : 'location-outline'
      } else if (rn === listName) {
        iconName = focused ? 'reader' : 'reader-outline'
      }
      return <Icon name={iconName} size={size} color={color} />
    },
  })

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator initialRouteName={homeName} screenOptions={options}>
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={listName} component={ListScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
