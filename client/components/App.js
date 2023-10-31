import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Main from "./Main";
import Login from "./Login";

const Stack = createNativeStackNavigator()

export default function App(){
  const [ user, setUser] = useState(null)

  useEffect(() => {
    // checking to see if user is logged in
    checkLoggedInStatus()
  }, [])

  const checkLoggedInStatus = async() => {
    const userLoggedIn = await AsyncStorage.getItem('loggedIn')
    if (userLoggedIn) {
      // user is logged in, fetch user data
      fetch(`http://192.168.1.155:3335/users/${userLoggedIn}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data)
      })
      .catch((error) => {
        console.log('Error Fetching User Data', error)
      })
    } else {
      // user not logged in, data = null
      setUser(null)
    }
  }

  const handleLogin = (user) => {
    setUser(user)
    AsyncStorage.setItem('loggedIn', String(user.id))
  }

  const handleLogout = () => {
    setUser(null)
    AsyncStorage.removeItem('loggedIn')
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user != null ? (
            <Stack.Screen
              name={'Main'}
              component={Main}
              initialParams={{ user, setUser, handleLogout }}
            />
          ) : (
            <Stack.Screen
              name={'Login'}
              component={Login}
              initialParams={{ onLogin: handleLogin }}
            />
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}