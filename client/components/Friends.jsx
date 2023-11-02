import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Friends(){

    return (
        <View>
            <Text style={styles.text}>FRIENDS</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        marginTop: 350,
        fontSize: 35
    }
})