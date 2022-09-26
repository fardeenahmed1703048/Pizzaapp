import React, { useContext, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, Provider, TextInput, ActivityIndicator, Colors } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker'
import { Image } from 'react-native-elements';
// import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Formik } from 'formik';
import * as yup from 'yup';
import { userContext } from '../../../App';

const signUpValidationSchema = yup.object().shape({
  title: yup.string().required('Title no. is Required'),
  description: yup.string().required('Description is Required'),
  price: yup.string().required('Price is Required'),

});


const AddFoods = () => {

  const [loggedUser, setLoggedUser] = useContext(userContext);
  const [imageData, setImageData] = useState({});
  const [takenImage, setTakenImage] = useState(false)
  const [visible, setVisible] = useState(false);


  const containerStyle = {
    marginHorizontal: 30,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 99
  };

  const handleImgInput = () => {
    const options = {
      includeBase64: true,
    };
    try {
      launchImageLibrary(options, response => {
        if (!response.didCancel) {
          setImageData({ ...response.assets[0] });
          setTakenImage(true)
        }
      })
    } catch (err) {
      alert("something went wrong, please try again")
    }
  };

  const handleAddRoom = async (value) => {
    setVisible(true);
    await fetch('http://localhost:8085/addFoods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...value, ...imageData }),
    })
      .then(res => res.json())
      .then(data => {
        setVisible(false);
        data && alert('Food item added successfully!');
        setLoggedUser({ ...loggedUser, addedNew: value.title })

      })
      .catch(err => { console.log(err) })
  };

  return (<>
    <ScrollView >

      <Formik
        validationSchema={signUpValidationSchema}
        initialValues={{
          title: '',
          description: '',
          price: '',

        }}
        onSubmit={values => handleAddRoom(values)}>
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
              placeholder="Enter Food Name"
              leftIcon={<Icon name="sign-in" size={24} color="black" />}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            {errors.title && (
              <Text style={{ fontSize: 14, color: 'red' }}>{errors.title}</Text>
            )}
            <View>

            </View>
            <TextInput
              placeholder="Enter Description"
              leftIcon={<Icon name="user" size={24} color="black" />}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              multiline={true}
            />
            {errors.description && (
              <Text style={{ fontSize: 14, color: 'red' }}>{errors.description}</Text>
            )}

            <TextInput
              placeholder="Enter price"
              leftIcon={<Icon name="price" size={24} color="black" />}
              onChangeText={handleChange('price')}
              onBlur={handleBlur('price')}
              value={values.price}
            />
            {errors.price && (
              <Text style={{ fontSize: 14, color: 'red' }}>{errors.price}</Text>
            )}

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
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
              <Button
                icon="image"
                mode="outlined"
                onPress={handleImgInput}
              >Upload food image </Button>
            </View>
            {takenImage && <View
              style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, zIndex: -110 }}>
              <Button icon="plus" mode="contained"
                onPress={handleSubmit}
                disabled={!isValid}
              >Add Food item </Button>
            </View>}
          </>
        )}
      </Formik>
    </ScrollView>

    <Provider>
      <Portal>
        <Modal visible={visible} contentContainerStyle={containerStyle}>
          <Text>Uploading food information. Please wait</Text>
          <ActivityIndicator style={{ paddingTop: 10 }} animating={true} color={Colors.red800} />
        </Modal>
      </Portal>
    </Provider>
  </>
  );
};

export default AddFoods;
