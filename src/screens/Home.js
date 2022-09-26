import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Text, Provider, Portal, Modal, ActivityIndicator, Colors } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import NetInfo from "@react-native-community/netinfo";
import EachItem from '../components/EachItem';

const wait = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    })
}

const Home = () => {

    const [allFoods, setAllFoods] = useState([]);
    const [visible, setVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [netStatus, setNetStatus] = useState(true);

    const onRefresh = () => {
        NetInfo.addEventListener(networkState => {
            setNetStatus(networkState.isConnected)
        });
        setRefreshing(true)
        setVisible(true);
        fetch('http://localhost:8085/allFoods')
            .then(res => res.json())
            .then(data => {
                setAllFoods(data);
                setVisible(false);
            })
            .catch(err => { })

        wait(4000).then(() => {
            setRefreshing(false);
        }, [refreshing]).catch(err => { console.log(err) })
    }



    useEffect(() => {
        NetInfo.addEventListener(networkState => {
            setNetStatus(networkState.isConnected)
        });

        setVisible(true);
        fetch('http://localhost:8085/allFoods')
            .then(res => res.json())
            .then(data => {
                setAllFoods(data);
                setVisible(false);
            })
            .catch(err => { console.log(err) })

    }, []);

    const renderItem = ({ item }) => <EachItem item={item} />;
    
    return (
        <View>
            <View style={{ zIndex: -10, marginBottom: 60 }}>
                {allFoods.length ?
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        data={allFoods}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                    />
                    :
                    <Text style={{ fontSize: 30 }}>Empty Foods</Text>
                }
                <Provider>
                    <Portal>
                        <Modal visible={visible} contentContainerStyle={styles.containerStyle}>
                            {
                                !netStatus ?
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', color: "red" }}>
                                        Network failed. Please connect your device to network
                                    </Text>
                                    :
                                    <>
                                        <Text>Loading....Please wait.</Text>
                                        <ActivityIndicator style={{ paddingTop: 10 }} animating={true} color={Colors.red800} />
                                    </>
                            }
                        </Modal>
                    </Portal>
                </Provider>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
    },
    containerStyle: {
        marginHorizontal: 30,
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 20,
        zIndex: 99
    },
});
