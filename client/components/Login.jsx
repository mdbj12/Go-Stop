import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ImageBackground, Alert, Pressable } from 'react-native';

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
            style={styles.createAccountInput}
        />
        <TextInput
            onChangeText={text => setCreateEmail(text.toLowerCase())}
            value={createEmail}
            placeholder='Enter Email'
            style={styles.createAccountInput}
        />
        <TextInput
            onChangeText={text => setCreatePassword(text.toLowerCase())}
            value={createPassword}
            placeholder='Enter Password'
            style={styles.createAccountInput}
        />
        {errorMessage !== "" && <Text style={styles.loginErrorMessage}>{errorMessage}</Text>}
        <View>
            <View>
                <Pressable onPress={handleSignup}>
                    <Text style={styles.signupText}>Sign Up!</Text>
                </Pressable>
            </View>
        </View>
    </View>

    // handles signup form visibility
    function showForm(){
        setIsForm(!isForm)
    }

    // there is an issue where if you logout and try to log back in, it throws an error
    // error: 'Cannot read property 'onLogin' of undefined
    // i think when you logout and the AsyncStorage item ('loggedIn') gets removed, it removes the user from the current stage
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
            body: JSON.stringify(userObj)
        })
        .then(
            // logging in issues
            async(res) => {
                if (res.status === 200){
                    let user = await res.json()
                    route.params.onLogin(user)
                } else if (res.status === 404) {
                    setErrorMessage('User does not exist!')
                } else if (res.status === 405) {
                    setErrorMessage('Error Logging In')
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
                if (res.status === 201){
                    let user = await res.json()
                    route.params.onLogin(user)
                    Alert.alert('Signup Successfull!', 'Your account has been created')
                } else if (res.status === 406){
                    setErrorMessage('Username already exists')
                } else if (res.status === 409){
                    setErrorMessage('Email already used')
                } else if (res.status === 422){
                    setErrorMessage('Please Enter a Password')
                } else {
                    console.log(error)
                }
            }
        )
    }

    return (
        <View style={styles.loginScreen}>
            <ImageBackground>
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Go Stop!</Text>
                    </View>
                    <View style={styles.loginContainer}>
                        <TextInput
                            onChangeText={text => setUsername(text.toLowerCase())}
                            value={username}
                            placeholder='Enter Username'
                            style={styles.loginDetails}
                        />
                        <TextInput
                            onChangeText={text => setPassword(text.toLowerCase())}
                            value={password}
                            placeholder='Enter Password'
                            secureTextEntry
                            style={styles.loginDetails}
                        />
                    </View>
                    <View>
                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>Login</Text>
                            </Pressable>
                            <Pressable style={styles.loginButton} onPress={showForm}>
                                <Text style={styles.loginButtonText}>Create Account</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                {isForm ? signupForm : null}
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    loginScreen: {
        backgroundColor: '#D8210B',
        flex: 1,
    },
    titleContainer: {
        marginTop: 100,
        padding: 15,
        alignSelf: 'center',
        backgroundColor: '#263049',
        borderRadius: 25,
        width: 300,
    },
    title: {
        fontSize: 40,
        textAlign: 'center',
        color: 'white'
    },
    loginContainer: {
        marginTop: 50
    },
    loginDetails: {
        padding: 10,
        color: 'white',
        borderRadius: 25,
        backgroundColor: '#263049',
        width: 200,
        alignSelf: 'center',
        marginTop: 25,
    },
    buttonContainer: {
        marginTop: 25
    },
    loginButton: {
        alignSelf: 'center',
        padding: 10,
    },
    loginButtonText: {
        fontSize: 25,
        textAlign: 'center',
        color: 'white',
    },
    createAccountInput: {
        padding: 10,
        color: 'white',
        borderRadius: 25,
        backgroundColor: '#263049',
        width: 200,
        alignSelf: 'center',
        marginTop: 15,
    },
    loginErrorMessage: {
        alignSelf: 'center'
    },
    signupText: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 20,
        marginTop: 20
    }
})