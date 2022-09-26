import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Pressable } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

const statusData = ["pending", "processing", "completed"]

const EachOrder = (props) => {
    console.log(props.order)
    const { name, email, address, bkashNumber, mobile, status, trxID, _id, paymentMethod, items } = props.order
    const [updatedStatus, setUpdatedStatus] = useState(status)
    // const [isSelected, setIsSelected] = useState(false)
    const [visible, setVisible] = useState(false);

    const handleStatus = (status) => {
        console.log(status)

        setVisible(true);
        fetch('http://localhost:8085/updateStatus', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status, _id: _id, email: email })
        })
            .then(res => res.json())
            .then(data => {
                setVisible(false);
                data && alert('Status updated successfully');
                !data && alert('Error updating status. Try again later')
                data && setUpdatedStatus(status)
            }).catch(err => {
                setVisible(false);
                alert('Error updating status. Try again later')
            })
    }

    return (
        <View style={styles.orderCard}>
            <Text>Customer: {name}</Text>
            <Text>Email: {email}</Text>
            <Text>Address: {address}</Text>
            <Text>Mobile: {mobile}</Text>
            <Text>Payment Method: {paymentMethod}</Text>
            {paymentMethod === "bkash" &&
                <>
                    <Text>Bkash Number: {bkashNumber}</Text>
                    <Text >Trx ID: {trxID}</Text>
                </>
            }
            <Text style={{ marginTop: 8 }}>Ordered Foods:</Text>
            {
                items.map(item => <Text key={item.title}>{item.title} </Text>)

            }
            <Text style={{ marginTop: 8 }}>Status:</Text>
            {visible && <ActivityIndicator size="large" color="#00ff00" />}
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: 'center' }}>
                {
                    statusData.map((status) => {
                        if (status === updatedStatus) {
                            return (
                                <TouchableRipple rippleColor="rgba(0, 0, 0, .32)" key={status} onPress={() => handleStatus(status)}>
                                    <Text style={{ backgroundColor: "green", color: "white", borderRadius: 20, padding: 8 }}>{status}</Text>
                                </TouchableRipple>
                            )
                        } else {

                            return (
                                <Pressable key={status} onPress={() => handleStatus(status)}>
                                    <Text >{status}</Text>
                                </Pressable>
                            )
                        }

                    }
                    )
                }
            </View>

        </View>
    )
}

export default EachOrder

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
    }
})