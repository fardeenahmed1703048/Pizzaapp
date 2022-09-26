import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native'
import { TextInput, Button, RadioButton, Colors } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { userContext } from '../../App';

import { Formik } from 'formik';
import * as yup from 'yup';



const checkOutValidationSchema = yup.object().shape({
  name: yup.string().required('User name is Required'),
  mobile: yup.string().matches(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/, 'Must follow bd number pattern').required('Contact number is Required'),
  email: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/,
      'Please enter valid email',
    )
    .email('Please enter valid email')
    .required('Email Address is Required'),
  address: yup.string().required('User address is Required'),
  // bkashNumber: yup.string().matches(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/, 'Must follow bd number pattern').required('Bkash number is Required'),
  // trxID: yup.string().required('Transaction ID is Required'),
});

const Checkout = ({ route, navigation }) => {
  // const [bkashInfo, setBkashInfo] = useState({});
  const [checked, setChecked] = useState('first');
  // const [checkOutInfo, setCheckOutInfo] = useState({})
  const [cartItems, setCartItems] = useContext(userContext);
  const [visible, setVisible] = useState(false);
  // const [isLoading, setIsLoading] = useState(false)

  // const inputHandler = (data) => {
  //   setCheckOutInfo({ ...checkOutInfo, ...data })
  // }

  // const bkashInputHandler = (data) => {
  //   setBkashInfo({ ...bkashInfo, ...data })
  // }

  const placeOrder = (data) => {

    console.log({ ...data })

    const { name, email, mobile, address } = data;
    const orderInfo = { name: name, email: email, mobile: mobile, address: address }

    if (checked === 'second') {

      setVisible(true);
      const newValue1 = { ...data, paymentMethod: "bkash", status: "pending" }

      fetch('http://localhost:8085/placeOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newValue1, items: cartItems.items }),
      })
        .then(res => res.json())
        .then(data => {
          setVisible(false);
          data && alert('Order placed successfully')
          data && setCartItems({ ...cartItems, items: [] })

        })
        .catch(err => { })
    } else {
      setVisible(true);
      const newValue = { ...orderInfo, paymentMethod: "cash", status: "pending" }

      fetch('http://localhost:8085/placeOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newValue, items: cartItems.items }),
      })

        .then(res => res.json())
        .then(data => {
          setVisible(false);
          data && alert('Order placed successfully')
          data && setCartItems({ ...cartItems, items: [] })

        })
        .catch(err => { })
    }
  }

  return (
    <>
      <ScrollView style={{ flex: 3 }}>
        <Text>Checkout</Text>

        <Formik
          validationSchema={checkOutValidationSchema}
          initialValues={{
            name: '',
            mobile: '',
            email: '',
            address: '',
            bkashNumber: '',
            trxID: ''
          }}
          onSubmit={values => placeOrder(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
          }) => (
            <ScrollView>
              <TextInput
                mode="outlined"
                name="name"
                label="User name"
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
                  name="mobile"
                  label="User contact no."
                  style={styles.textInput}
                  onChangeText={handleChange('mobile')}
                  onBlur={handleBlur('mobile')}
                  value={values.mobile}
                  keyboardType='numeric'
                />
                {errors.mobile && (
                  <Text style={{ fontSize: 10, color: 'red' }}>
                    {errors.mobile}
                  </Text>
                )}
              </View>

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
                name="address"
                label="address"
                // placeholder="Address"
                style={styles.textInput}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
              />
              {errors.email && (
                <Text style={{ fontSize: 10, color: 'red' }}>{errors.address}</Text>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <>
                  <RadioButton
                    value="first"
                    status={checked === 'first' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('first')}
                  />
                  <Text>Cash on delivery</Text>
                </>
                <>
                  <RadioButton
                    value="second"
                    status={checked === 'second' ? 'checked' : 'unchecked'}
                    onPress={() => setChecked('second')}
                  />
                  <Text>Bkash</Text>
                </>


              </View>

              <View>
                {
                  checked === 'second' &&
                  <>
                    <TextInput
                      mode="outlined"
                      name="bkashNumber"
                      label="Bkash no."
                      style={styles.textInput}
                      onChangeText={handleChange('bkashNumber')}
                      onBlur={handleBlur('bkashNumber')}
                      value={values.bkashNumber}
                      keyboardType='numeric'
                    />
                    {errors.bkashNumber && (
                      <Text style={{ fontSize: 10, color: 'red' }}>
                        {errors.bkashNumber}
                      </Text>
                    )}
                    <TextInput
                      mode="outlined"
                      name="trxID"
                      label="Transaction ID"
                      style={styles.textInput}
                      onChangeText={handleChange('trxID')}
                      onBlur={handleBlur('trxID')}
                      value={values.trxID}
                    />
                    {errors.trxID && (
                      <Text style={{ fontSize: 10, color: 'red' }}>
                        {errors.trxID}
                      </Text>
                    )}
                  </>
                }
              </View>

              {visible && <ActivityIndicator style={{ paddingTop: 10 }} animating={true} color={Colors.red800} />}
              <View style={{ flex: 1, alignItems: 'center', marginTop: 8 }} >
                <Button
                  onPress={handleSubmit}

                  disabled={visible}
                  mode="contained"
                >
                  <MaterialCommunityIcons name="text-box-check-outline" color="white" size={14} />
                  Place order
                </Button>
              </View>
            </ScrollView>
          )}
        </Formik>

        {/* <TextInput
          label="Name"
          onChangeText={text => inputHandler({ name: text })}
        />
        <TextInput
          label="Email"
          onChangeText={text => inputHandler({ email: text })}
        />
        <TextInput
          label="Mobile"
          onChangeText={text => inputHandler({ mobile: text })}
        />
        <TextInput
          label="Address"
          onChangeText={text => inputHandler({ address: text })}
        /> */}
      </ScrollView>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <>
          <RadioButton
            value="first"
            status={checked === 'first' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('first')}
          />
          <Text>Cash on service</Text>
        </>
        <>
          <RadioButton
            value="second"
            status={checked === 'second' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('second')}
          />
          <Text>Bkash</Text>
        </>


      </View>
      <View>
        {
          checked === 'second' &&
          <>
            <TextInput
              label="Mobile"
              onChangeText={text => bkashInputHandler({ bkashNumber: text })}
            />
            <TextInput
              label="Transaction ID"
              onChangeText={text => bkashInputHandler({ trxID: text })}
            />
          </>
        }
      </View> */}
      {/* <View style={{ flex: 1, alignItems: 'center', marginTop: 8 }} >
        {
          !visible &&
          <Button mode="contained" onPress={() => { }}>
            <MaterialCommunityIcons name="text-box-check-outline" color="white" size={14} />
            Place order
          </Button>
        }
        {
          visible && <ActivityIndicator />
        }
      </View> */}
    </>
  )
}

export default Checkout

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
})