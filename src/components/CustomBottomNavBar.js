import { StyleSheet, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Text, TouchableRipple, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { userContext } from '../../App';

const CustomBottomNavBar = (props) => {
    const { user } = props
    const navigation = useNavigation()
    const [cartItems, setCartItems] = useContext(userContext);
    const [visible, setVisible] = useState(false);

    const signOut = () => {
        setCartItems({ ...cartItems, isLogged: false, user: false })
    }

    return (
        <View style={styles.containerMain}>
            {visible &&
                <View style={{ marginBottom: 50 }}>
                    <Menu.Item icon="login" onPress={() => { user ? signOut() : navigation.navigate("Login") }} title={user ? "Log out" : "Login"} />
                    <Menu.Item icon="plus" onPress={() => { navigation.navigate("Registration") }} title="Registration" />
                    {
                        user &&
                        <>
                            <Menu.Item icon="order-alphabetical-ascending" onPress={() => { navigation.navigate("allOrders") }} title="Orders" />
                            <Menu.Item icon="account" onPress={() => { navigation.navigate("profile") }} title="Profile" />
                        </>
                    }
                </View>
            }
            <View style={styles.bottomView}>
                <TouchableRipple style={styles.textContainer} onPress={() => { navigation.navigate("Home") }}>
                    <>
                        <Text style={{ color: "white" }}>Home</Text>
                        <MaterialCommunityIcons name="home" color="white" size={26} />
                    </>
                </TouchableRipple>
                <TouchableRipple style={styles.textContainer} onPress={() => { navigation.navigate("Cart") }}>
                    <>
                        <Text style={{ color: "white" }}>Cart: {cartItems.items?.length}</Text>
                        <MaterialCommunityIcons name="cart" color="white" size={26} />
                    </>
                </TouchableRipple>
                <TouchableRipple style={styles.textContainer} onPress={() => { setVisible(!visible) }}>
                    <>
                        {user ?
                            <Text style={{ color: "white" }}>Account</Text>
                            :
                            <Text style={{ color: "white" }}>Menu</Text>
                        }
                        <MaterialCommunityIcons name="menu" color="white" size={26} />
                    </>
                </TouchableRipple>
            </View>
        </View>
    )
}

export default CustomBottomNavBar

const styles = StyleSheet.create({
    containerMain: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    bottomView: {
        width: '100%',
        height: 54,
        backgroundColor: '#6200f0',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
        flexDirection: 'row',
    },
    textContainer: {
        paddingHorizontal: 16,
        fontWeight: 'bold',
        justifyContent: "center", alignItems: "center",
    }
})