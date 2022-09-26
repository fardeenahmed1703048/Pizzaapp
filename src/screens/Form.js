import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { userContext } from '../../App';
import {
  Modal,
  Portal,
  Text,
  Provider,
  ActivityIndicator,
  Colors,
  TextInput,
  Button
} from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';

const signInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/,
      'Please enter valid email',
    )
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .min(7, ({ min }) => `Password must be at least ${min} characters`)
    .max(8)
    .required('Password is required'),
});

const Form = () => {
  const navigation = useNavigation()
  const [loggedUser, setLoggedUser] = useContext(userContext);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [netStatus, setNetStatus] = useState(true);
  const containerStyle = { marginHorizontal: 30, borderRadius: 10, backgroundColor: 'white', padding: 20, zIndex: 99 };

  useEffect(() => {
    NetInfo.addEventListener(networkState => {
      setNetStatus(networkState.isConnected)
    });

  }, [])


  const handleEmailPassSignIn = async userInfo => {
    NetInfo.addEventListener(networkState => {
      setNetStatus(networkState.isConnected)
    });
    setVisible(true);
    await fetch('http://localhost:8085/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo),
    })
      .then(res => res.json())
      .then(data => {
        data.login && setLoggedUser({ ...loggedUser, ...data.info, isLogged: true });
        data.admin && setLoggedUser({ ...loggedUser, ...data.info, isLogged: true, admin: true });
        setError(data.message);
        setVisible(false);

      })
      .catch(err => {
      })
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.containerText}>Sign in</Text>
      <Formik
        validationSchema={signInValidationSchema}
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={values => handleEmailPassSignIn(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
        }) => (
          <>
            <TextInput
              mode="outlined"
              name="email"
              label="Email Address"
              style={styles.textInput}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
            />
            {errors.email && (
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
            )}
            <TextInput
              mode="outlined"
              name="password"
              label="Password"
              style={styles.textInput}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {errors.password && (
              <Text style={{ fontSize: 10, color: 'red' }}>
                {errors.password}
              </Text>
            )}
            <View style={{ marginTop: 10 }}>
              <Button disabled={!isValid} mode="contained" onPress={handleSubmit}> Sign in </Button>
            </View>
            {
              error.length > 0 && <Text style={{ textAlign: 'center', color: 'red', fontWeight: "bold" }}>{error}</Text>
            }
          </>
        )}
      </Formik>
      <View>
        <Provider>
          <Portal>
            <Modal visible={visible} contentContainerStyle={styles.containerStyle}>
              {
                !netStatus ?
                  <Text style={{ marginTop: 250, color: "red" }}>
                    Network failed. Please connect your device to network
                  </Text>
                  :
                  <ActivityIndicator style={{ paddingTop: 10 }} animating={true} color={Colors.red800} />

              }
            </Modal>
          </Portal>
        </Provider>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  containerText: {
    paddingBottom: 10,
    fontSize: 20,
    zIndex: -99
  },
  inputContainer: {
    // width: '95%',
    padding: 20,
    borderRadius: 10,
    elevation: 1,
    zIndex: -99
  },
  containerStyle: {
    marginHorizontal: 30,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 99
  }
});

export default Form;
