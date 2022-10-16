import React, { useState, createContext } from 'react'
import { openDatabase } from 'expo-sqlite'
import { AnimatedRegion } from 'react-native-maps'

const db = openDatabase('locationsDB.db')

export const AppContext = createContext({
  animatedRegion: new AnimatedRegion({
    latitude: 50.0416088,
    longitude: 25.0305683,
    latitudeDelta: 0.9,
    longitudeDelta: 0.9,
  }),
  setAnimatedRegion: () => {},
  markers: [],
  setMarkers: () => {},
  pin: null,
  setPin: () => {},
  data: [],
  setData: () => {},
  createTable: () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS locations (ID INTEGER PRIMARY KEY AUTOINCREMENT, latitude TEXT,longitude TEXT);',
        (txObj, results) => console.log('Success ct', results.rows)
        // (txObj, error) => console.error('error ct', error)
      )
    })
  },
})

export const AppProvider = ({ children }) => {
  const [animatedRegion, setAnimatedRegion] = useState(
    new AnimatedRegion({
      latitude: 49.63651,
      longitude: 19.809888,
      latitudeDelta: 0.9,
      longitudeDelta: 0.9,
    })
  )
  const [markers, setMarkers] = useState([])
  const [pin, setPin] = useState(null)
  const [data, setData] = useState([])

  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS locations (ID INTEGER PRIMARY KEY AUTOINCREMENT, latitude TEXT,longitude TEXT);',
        (txObj, results) => console.log('Success ct', results.rows)
        // (txObj, error) => console.error('error ct', error)
      )
    })
  }

  const value = {
    animatedRegion,
    setAnimatedRegion,
    markers,
    setMarkers,
    pin,
    setPin,
    data,
    setData,
    createTable,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
