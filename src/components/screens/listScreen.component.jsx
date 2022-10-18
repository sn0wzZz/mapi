import React, { useEffect, useContext } from 'react'
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'

import { AppContext } from '../../contexts/appContext.context'

import { openDatabase } from 'expo-sqlite'

import Icon from 'react-native-vector-icons/Ionicons'
import Button from '../buttons/button.component'
import { ACCENT_COLOR } from '../../variables'

export default function ListScreen({ navigation }) {
  const { markers, data, setData, setPin, animatedRegion, createTable, deleteData,fetchData } =
    useContext(AppContext)

  let db = openDatabase('locationsDB.db')

  useEffect(() => {
    fetchData()
  }, [markers])


  const DeleteLocationAlert = () =>
    Alert.alert('Delete all locations', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          deleteData()
          setPin(null)
          fetchData()
        },
      },
    ])

  const EmptyDBAlert = () =>
    Alert.alert('Recreate the DB', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setPin(null)
          db.closeAsync()
          db.deleteAsync()
          db = openDatabase('locationsDB.db')
          createTable()
          fetchData()
        },
      },
    ])

  if (!data[0])
    return (
      <View style={{ ...styles.screen, justifyContent: 'center' }}>
        <Text style={{ ...styles.title, fontSize: 30 }}>
          No data {<Icon name={'warning'} size={30} color={ACCENT_COLOR} />}
        </Text>
        <Text style={{ color: 'white' }}>Add a marker!</Text>
      </View>
    )

  const pressHandler = (latitude, longitude) => {
    latitude = parseFloat(latitude)
    longitude = parseFloat(longitude)
    let locationPin = { latitude, longitude }
    setPin(locationPin)
    animatedRegion
      .timing({
        ...locationPin,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
        duration: 1000,
      })
      .start()
    // console.log('pin', locationPin)
    navigation.navigate('Home')
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Location List</Text>
      <View style={styles.flatlist}>
        <FlatList
          idExtractor={(item) => item.ID}
          data={data.slice().reverse()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => pressHandler(item.latitude, item.longitude)}
              >
                <View style={styles.container}>
                  <Text style={styles.title}>
                    {String(item.latitude).slice(0, 7)} /{' '}
                    {String(item.longitude).slice(0, 7)}{' '}
                    {<Icon name={'locate'} size={15} color={ACCENT_COLOR} />}
                  </Text>
                  <Text style={styles.content}>
                    {String(item.latitude)} / {String(item.longitude)}{' '}
                    {<Icon name={'location'} size={15} color={'#85EA85'} />}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
      <Button
        iconName={'trash'}
        onPressFunction={DeleteLocationAlert}
        onLongPressFunction={EmptyDBAlert}
        bottom={'13%'}
        color={'tomato'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1b1b1b',
    height: 10,
    flexGrow: 1,
  },
  header: {
    backgroundColor: ACCENT_COLOR,
    fontWeight: 'bold',
    borderRadius: 30,
    paddingHorizontal: 10,
    margin: 10,
  },
  flatlist: { height: '83%', width: '95%' },
  container: {
    width: '100%',
    marginBottom: 20,
    padding: 20,
    borderRadius: 30,
    backgroundColor: 'rgba(40, 40, 40, 0.85)',
  },
  title: {
    color: ACCENT_COLOR,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    color: 'whitesmoke',
  },
})
