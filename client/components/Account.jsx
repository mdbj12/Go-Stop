import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput, Modal } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Account({ navigation, route }){
    // retrieving user obj from route.params
    const user = route.params.user

    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState(user.password)

    // Modal controls
    const [editingModal, setEditingModal] = useState(false)

    function openEditModal(){
        setEditingModal(true)
    }

    function closeEditModal(){
        setEditingModal(false)
    }

    // set data input to lowercase (username, email, password)
    function setUsernameLower(text){
        setUsername(text.toLowerCase())
    }

    function setEmailLower(text){
        setEmail(text.toLowerCase())
    }

    function setPasswordLower(text){
        setPassword(text.toLowerCase())
    }

    // control logout
    function handleLogout(){
        fetch('http://192.168.1.155:3335/logout', {
            method: 'DELETE'
        })
        .then(() => {
            route.params.setUser(null)
            AsyncStorage.removeItem('loggedIn')
            navigation.navigate('Login')
            // after clicking logout, will return user back to 'Login' screen
        })
        .catch(error => {
            console.log('Error logging out', error)
        })
    }

    // handles user edits to username, email and password
    function handleUserChanges(){
        const updatedUserInfo = { username, email, password }
        
        fetch(`http://192.168.1.155:3335/users/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(updatedUserInfo)
        })
        .then((res) => {
            if (res.ok) {
                return res.json()
            } else {
                throw new Error('Error updating User Information')
            }
        })
        .then(updatedUser => {
            route.params.setUser(updatedUser)
            alert('Successfully Updated!')
        })
        .catch(error => {
            console.log('Error updating user Information', error)
        })
    }

    // handles deleting an account
    function handleDeleteAccount(){
        fetch(`http://192.168.1.155:3335/users/${user.id}`, {
            method: 'DELETE'
        })
        .then(() => {
            route.params.setUser(null)
            AsyncStorage.removeItem('loggedIn')
            navigation.navigate('Login')
            // after deleting account, will return user back to 'Login' screen
        })
        .catch(error => {
            console.log('Error deleting account', error)
        })
    }

    return (
        <View>
            <Text>User Details</Text>
            <Text>Username</Text>
            <Text>{user.username}</Text>
            <Text>Email</Text>
            <Text>{user.email}</Text>

            <Button title="Edit Account Info" onPress={openEditModal} />
            <Button title="Delete Account" onPress={handleDeleteAccount} />
            <Button title="Logout" onPress={handleLogout} />

            <Modal visible={editingModal} animationType="slide">
                <View>
                    <Text>Edit Info</Text>
                    <Text>Username: </Text>
                    <TextInput
                        value={username}
                        onChangeText={setUsernameLower}
                    />

                    <Text>Email: </Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmailLower}
                    />

                    <Text>Password: </Text>
                    <TextInput
                        value={password}
                        onChangeText={setPasswordLower}
                    />

                    <Button title="Save Changes" onPress={handleUserChanges} />
                    <Button title="Close" onPress={closeEditModal} />
                </View>
            </Modal>
        </View>
    )
}