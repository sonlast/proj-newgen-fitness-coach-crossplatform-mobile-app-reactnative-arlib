import React from 'react'
import { Image, StyleSheet} from 'react-native'

const BackgroundImage = () => {
  return (
    <Image
      source={require("@/assets/images/background.png")}
      style={styles.backgroundImage}
    />
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
})

export default BackgroundImage;