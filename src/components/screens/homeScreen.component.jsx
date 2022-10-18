import React, { useEffect, useContext, createRef } from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'

// Maps
import MapView, {
  Callout,
  Marker,
  Animated,
  AnimatedRegion,
  onRegionChange,
} from 'react-native-maps'
import * as Location from 'expo-location'
import { openDatabase } from 'expo-sqlite'

// Context
import { AppContext } from '../../contexts/appContext.context'

// Customization
import { DARK_MAP, ACCENT_COLOR } from  '../../variables'

import Button from '../buttons/button.component'

export default function HomeScreen({ navigation }) {
  const {
    markers,
    setMarkers,
    pin,
    setAnimatedRegion,
    animatedRegion,
    createTable,
    insertData
  } = useContext(AppContext)

  // Initialize DB
  const db = openDatabase('locationsDB.db')

  useEffect(() => {
    createTable()
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({})

      animatedRegion
        .timing({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        })
        .start()
    })()
  }, [])

  const animateToLocation = async () => {
    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({})

    animatedRegion
      .timing({
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
        duration: 1000,
      })
      .start()
  }

  const zoomIn = () => {
    animatedRegion
      .timing({
        ...{
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
        },
        duration: 1000,
      })
      .start()
  }

  const zoomOut = () => {
    animatedRegion
      .timing({
        ...{
          latitudeDelta: 0.06,
          longitudeDelta: 0.06,
        },
        duration: 1000,
      })
      .start()
  }

  const mapView = createRef(null)

  return (
    <View style={styles.container}>
      <MapView.Animated
        ref={mapView}
        style={styles.map}
        region={animatedRegion}
        showsUserLocation={true}
        followsUserLocation={true}
        customMapStyle={DARK_MAP}
        onMarkerPress={(e) => {
          animatedRegion
            .timing({
              ...e.nativeEvent.coordinate,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
              duration: 1000,
            })
            .start()
        }}
        provider={'google'}
        onPress={(e) => {
          setMarkers([...markers, e.nativeEvent.coordinate])
          insertData(
            e.nativeEvent.coordinate.latitude,
            e.nativeEvent.coordinate.longitude
          )
          console.log(e.nativeEvent.coordinate)
          animatedRegion
            .timing({
              ...e.nativeEvent.coordinate,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
              duration: 1000,
            })
            .start()
          setTimeout(() => {
            setMarkers([])
          }, 4000)
        }}
      >
        {markers &&
          markers.map((marker, id) => (
            <Marker key={id} coordinate={marker} pinColor={ACCENT_COLOR}>
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.text}>
                    {String(marker.latitude).slice(0, 7)}/
                    {String(marker.longitude).slice(0, 7)}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}

        {pin && (
          <Marker coordinate={pin} pinColor={'#85EA85'}>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={{ color: '#85EA85' }}>
                  {String(pin.latitude).slice(0, 7)}/
                  {String(pin.longitude).slice(0, 7)}
                </Text>
              </View>
            </Callout>
          </Marker>
        )}
      </MapView.Animated>
      <Button
        iconName={'locate'}
        onPressFunction={animateToLocation}
        bottom={'13%'}
        color={ACCENT_COLOR}
      />
      <Button
        iconName={'add'}
        onPressFunction={zoomIn}
        bottom={'33%'}
        color={ACCENT_COLOR}
      />
      <Button
        iconName={'remove'}
        onPressFunction={zoomOut}
        bottom={'23%'}
        color={ACCENT_COLOR}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: 'absolute',
    width: Dimensions.get('window').width + 150,
    height: Dimensions.get('window').height + 150,
  },
  callout: {
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderRadius: 30,
    padding: 10,
    borderWidth: 0.5,
  },
  text: { color: ACCENT_COLOR },
})
