import { StyleSheet } from 'react-native'
import React, { useContext, useState } from 'react'
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { userContext } from '../../App';
import { Icon } from 'react-native-elements'

const EachItem = (props) => {

    const [cartItems, setCartItems] = useContext(userContext);

    const { _id, title, description, price, contentType, img } = props.item;

    const handleAddToCart = (data) => {
        const newData = { ...data }
        console.log(newData);
        setCartItems({ ...cartItems, items: [newData, ...cartItems.items] })
    }

    return (
        <Card style={{ margin: 5 }}>
            <Card.Cover source={{ uri: `data:${contentType};base64,${img}` }} />

            <Card.Content>
                <Title>{title}</Title>
                <Paragraph style={{ color: 'black' }}>{description}</Paragraph>
            </Card.Content>
            <Card.Title title={`Price: $${price}`} />

            <Card.Actions>
                <Button onPress={() => handleAddToCart(props.item)}>Add to Cart</Button>
            </Card.Actions>
        </Card>
    )
}

export default EachItem

const styles = StyleSheet.create({})