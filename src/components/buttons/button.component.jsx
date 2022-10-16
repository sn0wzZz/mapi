import { TouchableHighlight, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default function Button({
  iconName,
  onPressFunction,
  onLongPressFunction,
  bottom,
  color,
}) {
  return (
    <TouchableHighlight
      style={{ ...styles.button, bottom: bottom }}
      onPress={onPressFunction}
      onLongPress={onLongPressFunction}
    >
      <View>
        <Icon name={iconName} size={22} color={color} />
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderRadius: 100,
    width: 60,
    height: 60,
    right: 20,
    zIndex: 1,
  },
})
