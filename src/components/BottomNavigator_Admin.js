import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { BottomNavigation } from 'react-native-paper';

import AddFoods from '../screens/admin/AddFoods';
import ManageFoods from '../screens/admin/ManageFoods';
import ManageOrders from '../screens/admin/ManageOrders';

const BottomNavigator_Admin = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'addFoods', title: 'Add Food', icon: 'plus', color: "#795548" },
        { key: 'manageFoods', title: 'Manage Foods', icon: 'delete', color: "#607D8B" },
        { key: 'manageOrders', title: 'Manage Orders', icon: 'plus-minus', color: "#3F51B5" },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        addFoods: AddFoods,
        manageFoods: ManageFoods,
        manageOrders: ManageOrders,
    });
    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    )
}

export default BottomNavigator_Admin

const styles = StyleSheet.create({})