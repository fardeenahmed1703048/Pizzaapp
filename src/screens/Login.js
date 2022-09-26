import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import Registration from './Registration';
import Form from './Form';

const Login = () => {
    const [isDone, setIsDone] = useState(true);
    const [isSignIn, setIsSignIn] = useState(true);

    const handleLoginOrReg = () => {
        setIsSignIn(!isSignIn)
    }
    return (
        <KeyboardAvoidingView>
            <ScrollView style={{ marginTop: 10 }}>
                {
                    isSignIn ?
                        <Form />
                        :
                        <Registration />
                }
                <TouchableRipple
                    onPress={() => handleLoginOrReg('Pressed')}
                    rippleColor="rgba(181, 126, 220, .32)"
                    style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}
                >
                    <Text>
                        {
                            isSignIn ?
                                "You don't have any account? Click Here."
                                :
                                "Have an account? Click Here."
                        }
                    </Text>
                </TouchableRipple>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
});

export default Login;
