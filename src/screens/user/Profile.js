import { StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { Card, Title, Paragraph } from 'react-native-paper';
import { userContext } from '../../../App';

const Profile = () => {
  const [loggedUser, setLoggedUser] = useContext(userContext);
  const { name, email, address, contact, img, contentType } = loggedUser
  return (
    <Card style={{ margin: 5 }}>
      <Card.Cover source={{ uri: `data:${contentType};base64,${img}` }} />
      <Card.Content>
        <Title>Name: {name}</Title>
        <Paragraph style={{ color: 'black' }}>Email: {email}</Paragraph>
      </Card.Content>
      <Card.Title title={`Address: ${address}`} />
      <Card.Title title={`Mobile: ${contact}`} />

    </Card>
  )
}

export default Profile

const styles = StyleSheet.create({})