import React, { useContext, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import {
    Modal,
    Portal,
    Button,
    Provider,
    TextInput,
    Card, Title, Paragraph
} from 'react-native-paper';
import { userContext } from '../../../App';


const EachFood = (props) => {
    const { _id, title, description, price, contentType, img } = props.item;
    const [loggedUser, setLoggedUser] = useContext(userContext);
    const [visible, setVisible] = useState(false);
    const [updatedFoodInfo, setUpdatedFoodInfo] = useState({
        title: title,
        description: description,
        price: price,
    })

    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20, zIndex: 99 };

    const handleInputField = (value) => {
        setUpdatedFoodInfo({
            ...updatedFoodInfo, ...value
        })
    }


    const handleDeleteFoodBtn = foodID => {
        fetch(`http://localhost:8085/deleteFood/${foodID}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                data && alert('Food deleted successfully');
                setLoggedUser({ ...loggedUser, deleted: foodID });
            })
            .catch(err => { alert({ err }, 'Error updating food info.Try again later') })
    };

    const handleUpdateFoodModalBtn = () => {
        setVisible(true);
    }

    const handleUpdateFoodBtn = foodID => {
        fetch(`http://localhost:8085/updateFoodInfo/${foodID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foodID: foodID, ...updatedFoodInfo })
        })
            .then(res => res.json())
            .then(data => {
                setVisible(false);
                data && alert('Food info updated successfully');
            }).catch(err => {
                alert('Error updating Food info. Try again later')
            })
    };


    return (
        <>
            <Card style={styles.item}>
                <Card.Cover source={{ uri: `data:${contentType};base64,${img}`, }} />
                <Card.Title title={`Title: ${title} `} />
                {/* <Card.Title title={`Title: ${_id} `} /> */}
                <Card.Content>
                    <Title>Description:</Title>
                    <Paragraph>{description}</Paragraph>
                </Card.Content>
                <View style={styles.btn}>

                    <Card.Actions>
                        <Button icon="update"
                            mode="contained"
                            color="green"
                            onPress={() => handleUpdateFoodModalBtn()}>
                            Update
                        </Button>
                    </Card.Actions>
                    <Card.Actions>
                        <Button icon="delete"
                            mode="contained"
                            color="red"
                            onPress={() => handleDeleteFoodBtn(_id)}>
                            Delete
                        </Button>
                    </Card.Actions>
                </View>
                <Provider style={styles.btn2}>
                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                            <TextInput
                                label="Service title"
                                value={updatedFoodInfo.title}
                                onChangeText={text => handleInputField({ title: text })}
                            // keyboardType='numeric'
                            />
                            <TextInput
                                label="Cause:"
                                value={updatedFoodInfo.description}
                                onChangeText={text => handleInputField({ description: text })}
                            // keyboardType='numeric'
                            />

                            <TextInput
                                label="Price"
                                value={updatedFoodInfo.price}
                                onChangeText={text => handleInputField({ price: text })}
                                keyboardType='numeric'
                            />
                            <View>
                                <Button icon="update"
                                    mode="contained"
                                    color="green"
                                    style={{ marginTop: 10 }}
                                    onPress={() => handleUpdateFoodBtn(props.item._id)}>
                                    Update
                                </Button>
                                <Button icon="cancel"
                                    mode="contained"
                                    color="red"
                                    style={{ marginTop: 10 }}
                                    onPress={() => hideModal()}>
                                    Cancel
                                </Button>
                            </View>
                        </Modal>
                    </Portal>
                </Provider>

            </Card>

        </>
    )
}
const styles = StyleSheet.create({
    item: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        // zIndex: -100
    },
    title: {
        fontSize: 18,
    },
    btn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // zIndex: -100
    },
    btn2: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // zIndex: 100
    }
});
export default EachFood
