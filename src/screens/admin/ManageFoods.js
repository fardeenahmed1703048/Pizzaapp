import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Provider,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";
import { userContext } from '../../../App';
import EachFood from './EachFood';

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  })
}

const ManageFoods = () => {
  const [loggedUser, setLoggedUser] = useContext(userContext);
  const [allFoods, setAllFoods] = useState([]);
  const [visible, setVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [netStatus, setNetStatus] = useState(true);
  const { deleted } = loggedUser;

  const onRefresh = () => {
    NetInfo.addEventListener(networkState => {
      setNetStatus(networkState.isConnected)
    });
    setRefreshing(true)
    setVisible(true);


    fetch('http://localhost:8085/allFoods')

      .then(res => res.json())
      .then(foods => {
        console.log(foods)
        setAllFoods(foods);
        setVisible(false);
      })
      .catch(err => { })

    wait(4000).then(() => {
      setRefreshing(false);
    }
      , [refreshing]).catch(err => { console.log(err) })
  }

  useEffect(() => {
    NetInfo.addEventListener(networkState => {
      setNetStatus(networkState.isConnected)
    });

    setVisible(true);
    fetch('http://localhost:8085/allFoods')
      .then(res => res.json())
      .then(foods => {
        console.log(foods)
        setAllFoods(foods);
        setVisible(false);

      })
      .catch(err => { console.log(err) })
  }, []);


  useEffect(() => {
    setVisible(true);
    const restFoods = allFoods.filter(food => food._id != deleted);
    setAllFoods(restFoods);
    setVisible(false);
  }, [deleted])


  const renderItem = ({ item }) => <EachFood item={item} />;
  return (
    <>
      <View>
        {
          allFoods.length ?
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={allFoods}
              renderItem={renderItem}
              keyExtractor={item => item._id}
            />
            :
            <>
              <Text style={{ fontSize: 30 }}>Empty Food Item</Text>
              <Text>Loading....Please wait.</Text>
              <ActivityIndicator style={{ paddingTop: 10 }} animating={true} color={Colors.red800} />

            </>
        }
      </View>
      <Provider>
        <Portal>
          <Modal visible={visible} contentContainerStyle={styles.containerStyle}>
            {
              !netStatus ?
                <Text style={{ marginTop: 250, color: "red" }}>Network failed. Please connect your device to network</Text>
                :
                <>
                  <Text>Loading....Please wait.</Text>
                  <ActivityIndicator style={{ paddingTop: 10 }} animating={true} color={Colors.red800} />
                </>
            }
          </Modal>
        </Portal>
      </Provider>
    </>
  );
};

export default ManageFoods

const styles = StyleSheet.create({
  containerStyle: {
    marginHorizontal: 30,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 99
  }
})