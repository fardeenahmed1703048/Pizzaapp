import { StyleSheet, Text, View } from 'react-native'
import React, { createContext, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-gesture-handler';
import CustomBottomNavBar from './src/components/CustomBottomNavBar';
import Cart from './src/screens/Cart';
import Checkout from './src/screens/Checkout';
import Registration from './src/screens/Registration';
import Login from './src/screens/Login';
import showAllOrders from './src/screens/user/ShowAllOrders'
import Profile from './src/screens/user/Profile'
import BottomNavigator_Admin from './src/components/BottomNavigator_Admin';
import { Button } from 'react-native-paper';
const Stack = createNativeStackNavigator();
export const userContext = createContext();


const App = () => {
    const [userInfo, setUserInfo] = useState({ delete: 0, items: [], totalItem: 0 });
    const signOut = () => {
        setUserInfo({ ...userInfo, isLogged: false, admin: false })
    }
    return (
        <userContext.Provider value={[userInfo, setUserInfo]}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home">
                        {userInfo.isLogged ?
                            (
                                userInfo.admin ?
                                    <Stack.Screen name="Admin"

                                        options={{
                                            headerRight: () => (
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ paddingTop: 5 }}>
                                                        <Text>{userInfo.name} </Text>
                                                    </View>
                                                    <View style={{ paddingRight: 5 }}>
                                                        <Button mode="outlined" onPress={signOut}>logout</Button>

                                                    </View>
                                                </View>
                                            ),
                                        }}

                                        component={BottomNavigator_Admin} />
                                    :
                                    <>
                                        <Stack.Screen name="Home" component={Home} />
                                        <Stack.Screen name="Cart" component={Cart} />
                                        <Stack.Screen name="checkout" component={Checkout} />
                                        <Stack.Screen name="allOrders" component={showAllOrders} />
                                        <Stack.Screen name="profile" component={Profile} />
                                        <Stack.Screen name="Login" component={Login} />
                                    </>
                            )
                            :
                            <>
                                <Stack.Screen name="Home" component={Home} />
                                <Stack.Screen name="Cart" component={Cart} />
                                <Stack.Screen name="checkout" component={Checkout} />
                                {/* <Stack.Screen name="OTPPage" component={OTPPage} /> */}
                                <Stack.Screen name="Registration" component={Registration} />
                                <Stack.Screen name="Login" component={Login} />
                            </>
                        }
                    </Stack.Navigator>
                    {
                        !userInfo.admin &&
                        <CustomBottomNavBar user={userInfo.user} />
                    }
                </NavigationContainer>
            </SafeAreaProvider>
        </userContext.Provider>
    )
}

export default App

const styles = StyleSheet.create({})
// adb -s emulator-5554 reverse tcp:8085 tcp:8085