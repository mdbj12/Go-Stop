import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput, Modal, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Account({ navigation, route }){
    // retrieving user obj from route.params
    const user = route.params.user

    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState(user.password)

    // Modal controls for editing user info
    const [editingModal, setEditingModal] = useState(false)
    
    function openEditModal(){
        setEditingModal(true)
    }
    
    function closeEditModal(){
        setEditingModal(false)
    }
    
    // Modal controls for viewing user info
    const [accountInfoModal, setAccountInfoModal] = useState(false)

    function openAccountInfoModal(){
        setAccountInfoModal(true)
    }

    function closeAccountInfoModal(){
        setAccountInfoModal(false)
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
        <View style={styles.accountContainer}>
            <Pressable style={styles.accountInfo} onPress={openAccountInfoModal}>
                <Text style={styles.accountInfoText}>View Account Details</Text>
            </Pressable>
            <Pressable style={styles.editAccount} onPress={openEditModal}>
                <Text style={styles.editAccountText}>Edit Account</Text>
            </Pressable>
            <Pressable style={styles.logoutAccount} onPress={handleLogout}>
                <Text style={styles.logoutAccountText}>Logout</Text>
            </Pressable>
            <Pressable style={styles.deleteAccount} onPress={handleDeleteAccount}>
                <Text style={styles.deleteAccountText}>Delete Account</Text>
            </Pressable>

            {/* opens the account info modal */}
            <Modal visible={accountInfoModal} animationType="fade">
                <View style={styles.modalInfoContainer}>
                    <Text style={styles.checkInfoModal}>Username</Text>
                    <Text style={styles.checkInfoModalText}>{user.username}</Text>
                    <Text style={styles.checkInfoModal}>Email</Text>
                    <Text style={styles.checkInfoModalText}>{user.email}</Text>

                    <Pressable onPress={closeAccountInfoModal} style={styles.editModalClose}>
                        <Text style={styles.editModalCloseText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>

            {/* opens the account info editing modal */}
            <Modal visible={editingModal} animationType="fade">
                <View style={styles.modalInfoContainer}>
                    <Text style={styles.modalTitle}>Edit Info</Text>
                    <Text style={styles.editInfoModal}>Username: </Text>
                    <TextInput
                        // value={username}
                        onChangeText={setUsernameLower}
                        style={styles.modalTextInput}
                    />

                    <Text style={styles.editInfoModal}>Email: </Text>
                    <TextInput
                        // value={email}
                        onChangeText={setEmailLower}
                        style={styles.modalTextInput}
                    />

                    <Text style={styles.editInfoModal}>Password: </Text>
                    <TextInput
                        // value={password}
                        onChangeText={setPasswordLower}
                        style={styles.modalTextInput}
                    />

                    <Pressable onPress={handleUserChanges} style={styles.saveChanges}>
                        <Text style={styles.saveChangesText}>Save Changes</Text>
                    </Pressable>
                    <Pressable onPress={closeEditModal} style={styles.editModalClose}>
                        <Text style={styles.editModalCloseText}>Close</Text>
                    </Pressable>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    accountContainer: {
        backgroundColor: '#F3D643',
        flex: 1
    },
    accountInfo: {
        marginTop: 250,
        padding: 10,
        alignSelf: 'center',
        backgroundColor: '#FFFCEF',
        borderRadius: 25,
        width: 175
    },
    accountInfoText: {
        textAlign: 'center'
    },
    editAccount: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        backgroundColor: '#FFFCEF',
        borderRadius: 25,
        width: 175
    },
    editAccountText: {
        textAlign: 'center'
    },
    logoutAccount: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        backgroundColor: '#E63946',
        borderRadius: 25,
        width: 175
    },
    logoutAccountText: {
        textAlign: 'center'
    },
    deleteAccount: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        backgroundColor: '#D8210B',
        borderRadius: 25,
        width: 175
    },
    deleteAccountText: {
        textAlign: 'center'
    },
    checkInfoModal: {
        fontSize: 35,
        color: '#FFFCEF',
        marginTop: 100,
        fontWeight: 'bold'
    },
    checkInfoModalText: {
        width: 200,
        padding: 10,
        margin: 10,
        backgroundColor: '#FAF3EE',
        textAlign: 'center',
    },
    modalInfoContainer: {
        backgroundColor: '#FFCC33',
        flex: 1,
        alignItems: 'center',
    },
    modalTitle: {
        marginTop: 75,
        fontSize: 50,
        padding: 15
    },
    editInfoModal: {
        fontSize: 35,
        color: '#FFFCEF',
        marginTop: 50
    },
    modalTextInput: {
        width: 200,
        padding: 10,
        backgroundColor: '#FAF3EE',
        borderRadius: 25,
    },
    saveChanges: {
        padding: 15,
        marginTop: 100,
        backgroundColor: '#073376',
        borderRadius: 25,
        width: 200,
        alignItems: 'center'
    },
    saveChangesText: {
        fontSize: 20,
        color: '#FAF3EE'
    },
    editModalClose: {
        padding: 15,
        marginTop: 20,
        backgroundColor: '#D8210B',
        borderRadius: 25,
        width: 200,
        alignItems: 'center'
    },
    editModalCloseText: {
        fontSize: 20,
        color: '#FAF3EE'
    }
})