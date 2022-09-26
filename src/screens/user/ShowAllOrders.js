import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import NetInfo from "@react-native-community/netinfo";
import { ActivityIndicator, Modal, Portal, Provider, Colors } from 'react-native-paper';
import { userContext } from '../../../App';

const ShowAllOrders = () => {
  const [allOrders, setAllOrders] = useState([])
  const [netStatus, setNetStatus] = useState(true);
  const [visible, setVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggedUser, setLoggedUser] = useContext(userContext);

  // console.log(loggedUser)
  const onRefresh = () => {
    NetInfo.addEventListener(networkState => {
      setNetStatus(networkState.isConnected)
    });
    setRefreshing(true)
    setVisible(true);
    fetch('http://localhost:8085/orders')
      .then(res => res.json())
      .then(orders => {
        const filtered = orders.filter(item => item.email === loggedUser.email)
        setAllOrders(filtered);
        setVisible(false);
      })
      .catch(err => {

      })
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
    fetch(`http://localhost:8085/orders`)
      .then(res => res.json())
      .then(orders => {
        const filtered = orders.filter(item => item.email === loggedUser.email)
        setAllOrders(filtered);
        setVisible(false);
      })
      .catch(err => { console.log(err) })
  }, []);

  const renderItem = ({ item }) => {
    console.log("jaklfjas-->", item)
    const { name, email, address, mobile, paymentMethod, status, items, orderDate } = item;
    let i = 0;
    return (
      <View style={styles.orderCard}>
        <Text>Customer: {name}</Text>
        <Text>Email: {email}</Text>
        <Text>Address: {address}</Text>
        <Text>Mobile: {mobile}</Text>
        <Text>Payment Method: {paymentMethod}</Text>
        {paymentMethod === "bkash" &&
          <>
            <Text>Bkash Number: {item.bkashNumber}</Text>
            <Text>Trx ID: {item.trxID}</Text>
          </>
        }
        <Text>Status:{status}</Text>
        <Text>Order date:{orderDate}</Text>
        <Text></Text>
        <Text>Ordered Services:</Text>

        {
          items.map(item => <Text key={item._id}>{++i}. {item.title}</Text>)
        }
      </View>
    )
  };
  return (<>
    <View style={{ marginBottom: 60 }}>
      {allOrders.length ?
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={allOrders}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        /> : <Text style={{ fontSize: 30 }}>Empty orders</Text>
      }
    </View>
    <Provider>
      <Portal>
        <Modal visible={visible} contentContainerStyle={styles.containerStyle}>
          {!netStatus ?
            <Text style={{ marginTop: 250, color: "red", justifyContent: "center", alignItems: "center" }}>
              Network failed. Please connect your device to network
            </Text>
            :
            <>
              <Text>Loading....Please wait.</Text>
              <ActivityIndicator style={{ paddingTop: 10 }} animating={true} color={Colors.red800} />
            </>}
        </Modal>
      </Portal>
    </Provider>
  </>
  )
}

export default ShowAllOrders
const styles = StyleSheet.create({
  orderCard: {
    borderRadius: 20,
    borderWidth: 1,
    margin: 4,
    padding: 8,
    backgroundColor: 'white',
  },
  selectedText: {

    backgroundColor: 'green',
    color: 'white',
  },
  containerStyle: { marginHorizontal: 30, borderRadius: 10, backgroundColor: 'white', padding: 20, zIndex: 99 }
})