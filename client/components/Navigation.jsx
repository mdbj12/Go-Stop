import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Game from "./Game";
import Account from "./Account";

const Tab = createBottomTabNavigator()

export default function Navigation({ route }){
    // route.params grabs data from page directly above
    // grabs the data from App.js (passed down via initial Params)
    const user = route.params.user // retrieve user obj from route param
    const setUser = route.params.setUser
    const handleLogout = route.params.handleLogout

    return (
        // bnottom tab navigation
        <Tab.Navigator>
            <Tab.Screen
                name="Game"
                options={{ title: 'Game', headerShown: false }}
                component={Game}
            />
            {/* <Tab.Screen
                name="Match History"
            /> */}
            {/* <Tab.Screen
                name="Friends"
            /> */}
            <Tab.Screen
                name="Account Details"
                options={{ title: 'Account', headerShown: false }}
                component={Account}
                initialParams={{ user, setUser, onLogout: handleLogout }}
            />
        </Tab.Navigator>
    )
}