import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Text,
  ActivityIndicator,
  Colors,
  TextInput, Button
} from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import { Image } from 'react-native-elements';
import { Formik } from 'formik';
import * as yup from 'yup';
import { userContext } from '../../App';


const signUpValidationSchema = yup.object().shape({
  name: yup.string().required('User name is Required'),
  contact: yup.string().matches(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/, 'Must follow bd number pattern').required('Contact number is Required'),
  email: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/,
      'Please enter valid email',
    )
    .email('Please enter valid email')
    .required('Email Address is Required'),
  address: yup.string().required('User address is Required'),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const RegForm = ({ navigation }) => {
  const [userInfo, setUserInfo] = useContext(userContext);
  const [imageData, setImageData] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const [takenImg, setTakenImg] = useState(false)

  const handleRegisterBtn = values => {

    setIsLoading(true)
    fetch('http://localhost:8085/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, ...imageData, admin: false, user: true }),
    })
      .then(res => res.json())
      .then(data => {
        setUserInfo({ ...values, ...imageData })
        data && alert('Account has been created successfully');
        setIsLoading(false)
        data && navigation.navigate('Login');
        !data && alert('This email has already used.Please try with a new one!');

      })
      .catch(err => { console.log(err) })
  };

  const handleImgInput = () => {
    const options = {
      includeBase64: true,
    };
    try {
      launchImageLibrary(options, response => {
        if (!response.didCancel) {
          setImageData({ ...response.assets[0] });
          setTakenImg(true)
        }
      })
    } catch (err) {
      alert("something went wrong, please try again")
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, }} showsVerticalScrollIndicator={true}>
      <View style={styles.inputContainer}>
        <Text style={styles.containerText}>Registration </Text>
        <Formik
          validationSchema={signUpValidationSchema}
          initialValues={{
            name: '',
            contact: '',
            email: '',
            address: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={values => handleRegisterBtn(values)}>
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
                name="name"
                placeholder="User name"
                style={styles.textInput}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {errors.name && (
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.name}</Text>
              )}

              <View>
                <TextInput
                  mode="outlined"
                  name="contact"
                  placeholder="User contact no."
                  style={styles.textInput}
                  onChangeText={handleChange('contact')}
                  onBlur={handleBlur('contact')}
                  value={values.contact}
                  keyboardType='numeric'
                />
                {errors.contact && (
                  <Text style={{ fontSize: 10, color: 'red' }}>
                    {errors.contact}
                  </Text>
                )}
              </View>

              <TextInput
                mode="outlined"
                name="email"
                placeholder="Email Address"
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
                name="address"
                placeholder="Address"
                style={styles.textInput}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
              />
              {errors.email && (
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.address}</Text>
              )}

              <TextInput
                mode="outlined"
                name="password"
                placeholder="Password"
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

              <TextInput
                mode="outlined"
                name="confirmPassword"
                placeholder="confirmPassword"
                style={styles.textInput}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text style={{ fontSize: 10, color: 'red' }}>
                  {errors.confirmPassword}
                </Text>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                <Button icon="image" mode="outlined" onPress={handleImgInput}>
                  Upload image
                </Button>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
                {imageData?.uri && (
                  <Image
                    source={{ uri: imageData.uri }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                    PlaceholderContent={<ActivityIndicator />}
                  />
                )}
              </View>
              {isLoading && <ActivityIndicator style={{ paddingTop: 10 }} animating={true} color={Colors.red800} />}
              {takenImg && <View style={{ marginTop: 20 }}>
                <Button
                  onPress={handleSubmit}

                  disabled={isLoading}
                  mode="contained"
                >
                  Register
                </Button>
              </View>}
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  containerText: {
    paddingBottom: 10,
    fontSize: 18,
  },
  inputContainer: {
  },
  textInput: {
    height: 35,
  },
  picker: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default RegForm;
