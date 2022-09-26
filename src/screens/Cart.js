import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DataTable, TouchableRipple, Button } from 'react-native-paper';
import { userContext } from '../../App';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useContext(userContext);
  const [distinctItems, setDistinctItems] = useState([])
  const [counts, setCounts] = useState({})

  useEffect(() => {
    let uniqueObjArray = [
      ...new Map(cartItems.items.map((item) => [item["_id"], item])).values(),
    ];
    setDistinctItems(uniqueObjArray)

  }, [cartItems.items.length])

  useEffect(() => {
    cartItems.items.forEach((i) => counts[i._id] = (counts[i._id] || 0) + 1);
  }, [])

  const handleRemoveItems = (id) => {

    const afterRemove = distinctItems.filter(item => item._id !== id)
    const restItems = cartItems.items.filter(item => item._id !== id)
    setDistinctItems(afterRemove)
    setCounts({})
    setCartItems({ ...cartItems, items: restItems })

  }
  const handlePlusBtn = (id) => {
    const newItem = distinctItems.filter(item => item._id === id);
    setCounts({})
    setCartItems({ ...cartItems, items: [newItem[0], ...cartItems.items] })
    counts[id] = (counts[id] || 0) + 1;
    setCounts(counts)
  }

  const handleMinusBtn = (id) => {
    const matched = cartItems.items.filter(item => item._id === id);
    const unMatched = cartItems.items.filter(item => item._id !== id);
    const size = matched.length
    let arr = []
    for (let i = 0; i < (size - 1); i++) {
      arr.push(matched[i])
    }
    setCounts({})
    setCartItems({ ...cartItems, items: [...arr, ...unMatched] })
    counts[id] = (counts[id]) - 1;
    setCounts(counts)
  }

  return (
    <>
      <View style={{ flex: 3 }}>
        <DataTable >
          <DataTable.Header>
            <DataTable.Title>SI.</DataTable.Title>
            <DataTable.Title>Title</DataTable.Title>
            <DataTable.Title numeric>Count</DataTable.Title>
            <DataTable.Title numeric>Price</DataTable.Title>
            <DataTable.Title numeric>Action</DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {
              distinctItems.map((item, index, self) =>

                <DataTable.Row key={index} style={{ marginVertical: 16 }}>
                  <DataTable.Cell>{index + 1}</DataTable.Cell>
                  <DataTable.Cell style={{ marginHorizontal: 16 }}>{item.title}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableRipple
                        onPress={() => handlePlusBtn(item._id)}
                        rippleColor="rgba(0, 0, 0, .32)"
                        style={{ padding: 4 }}
                      >
                        <MaterialCommunityIcons name="plus" color="#000" size={12} />
                      </TouchableRipple>

                      <Text style={{ paddingHorizontal: 4 }}>{counts[item._id]}</Text>

                      <TouchableRipple
                        onPress={() => handleMinusBtn(item._id)}
                        rippleColor="rgba(0, 0, 0, .32)"
                        style={{ padding: 4 }}
                      >
                        <MaterialCommunityIcons name="minus" color="#000" size={12} />
                      </TouchableRipple>

                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{counts[item._id] * item.price}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <TouchableRipple
                      onPress={() => handleRemoveItems(item._id)}
                      rippleColor="rgba(0, 0, 0, .32)"
                      style={{ padding: 4 }}
                    >
                      <MaterialCommunityIcons name="close-circle" color="red" size={14} />
                    </TouchableRipple>

                  </DataTable.Cell>
                </DataTable.Row>

              )
            }
          </ScrollView>
        </DataTable>


      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <Button disabled={!cartItems.items.length > 0} mode="contained" onPress={() => { navigation.navigate("checkout"), { cart: cartItems.items } }}>
          <MaterialCommunityIcons name="text-box-check-outline" color="white" size={14} />
          Checkout
        </Button>
      </View>
    </>
  )
}

export default Cart

const styles = StyleSheet.create({})