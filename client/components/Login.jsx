import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground, Alert } from 'react-native';

export default function Login({ route }){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isForm, setIsForm] = useState(false)
    const [createUsername, setCreateUsername] = useState("")
    const [createEmail, setCreateEmail] = useState("")
    const [createPassword, setCreatePassword] = useState("")

    const signupForm = 
    <View>
        {/* need to enter styles for each text input field */}
        <TextInput
            onChangeText={text => setCreateUsername(text.toLowerCase())}
            value={createUsername}
            placeholder='Enter Username'
        />
        <TextInput
            onChangeText={text => setCreateEmail(text.toLowerCase())}
            value={createEmail}
            placeholder='Enter Email'
        />
        <TextInput
            onChangeText={text => setCreatePassword(text.toLowerCase())}
            value={createPassword}
            placeholder='Enter Password'
        />
        {errorMessage !== "" && <Text>{errorMessage}</Text>}
        <View>
            <View>
                <Button
                    title='Sign Up!'
                    onPress={handleSignup}
                    color='white'
                />
            </View>
        </View>
    </View>

    // handles signup form visibility
    function showForm(){
        setIsForm(!isForm)
    }

    function handleLogin(){
        // creating userObj to change user information into a object
        const userObj = {
            username: username.toLowerCase(),
            password: password
        }

        fetch(`http://192.168.1.155:3335/login`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(userObj),
        })
        .then(
            // logging in issues
            async(res) => {
                if (res.status === 200){
                    let user = await res.json()
                    route.params.onLogin(user)
                } else if (res.status === 404) {
                    setErrorMessage('User does not exist!')
                } else {
                    console.log("Error Occured")
                }
            }
        )
        // data fetching issues
        .catch(function(error) {
            console.log('Error: ' + error.message)
        })
    }

    function handleSignup() {
        // turns newly created user into an object
        const newUserObj = {
            username: createUsername.toLowerCase(),
            email: createEmail.toLowerCase(),
            password: createPassword.toLowerCase()
        }

        // fetch data from the db, and then post the new data into db
        fetch(`http://192.168.1.155:3335/signup`, {
            method: 'POST',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify(newUserObj),
        })
        .then(
            async(res) => {
                if (res.status === 200){
                    let user = await res.json()
                    route.params.onLogin(user)
                    Alert.alert('Signup Successfull!', 'Your account has been created')
                } else if (res.status === 406){
                    setErrorMessage('Username already exists')
                } else if (res.status === 409){
                    setErrorMessage('Email already used')
                } else if (res.status === 422){
                    setErrorMessage('Please Enter a Password')
                }
            }
        )
    }

    return (
        <View>
            <ImageBackground>
                <View>
                    <Text style={styles.title}>Go Stop!</Text>

                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        textAlign: 'center',
        marginTop: 90
    }
})