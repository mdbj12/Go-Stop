import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MatchHistory(){

    return (
        <View>
            <Text style={styles.text}>MATCH HISTORY</Text>
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