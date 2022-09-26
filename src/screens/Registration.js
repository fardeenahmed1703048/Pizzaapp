import { StyleSheet, View } from 'react-native'
import React from 'react'
import RegForm from './RegForm'


const Registration = ({ navigation }) => {
    return (
        <View>
            <RegForm navigation={navigation} />
        </View>
    )
}

export default Registration

const styles = StyleSheet.create({})