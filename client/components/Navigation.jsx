import React from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Game from "./Game";
import Account from "./Account";
import MatchHistory from "./MatchHistory";
import Friends from "./Friends";

const Tab = createMaterialBottomTabNavigator()

export default function Navigation({ route }){
    // route.params grabs data from page directly above
    // grabs the data from App.js (passed down via initial Params)
    const user = route.params.user // retrieve user obj from route param
    const setUser = route.params.setUser
    const handleLogout = route.params.handleLogout

    return (
        // bnottom tab navigation
        <Tab.Navigator
            activeColor='#FAF3EE'
            inactiveColor='#29B2a0'
            barStyle={{ backgroundColor: '#073376' }}
        >
            <Tab.Screen
                name="Game"
                component={Game}
                options={{
                    title: 'Game',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name='gamepad-variant-outline' color={color} size={26} />
                    ),
                }}
            />
            <Tab.Screen
                name="Match History"
                component={MatchHistory}
                options={{
                    title: 'History',
                    headerShown: false,
                    tabBarIcon: ({ color }) => {
                        <MaterialCommunityIcons name='timeline-clock-outline' color={color} size={26} />
                    }
                }}
            />
            <Tab.Screen
                name="Friends"
                component={Friends}
                options={{
                    title: 'Friends',
                    headerShown: false,
                    tabBarIcon: ({ color }) => {
                        <MaterialCommunityIcons name='handshake' color={color} size={26} />
                    }
                }}
            />
            <Tab.Screen
                name="Account Details"
                component={Account}
                initialParams={{ user, setUser, onLogout: handleLogout }}
                options={{
                    title: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name='account' color={color} size={26} />
                    )
                }}
            />
        </Tab.Navigator>
    )
}