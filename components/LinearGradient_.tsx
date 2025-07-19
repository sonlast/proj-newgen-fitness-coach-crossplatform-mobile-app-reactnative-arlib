import React from 'react'
import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { CONSTANT_COLORS } from '@/constants/Colors'

const LinearGradient_ = () => {
    return (
      <LinearGradient
        colors={[CONSTANT_COLORS.GREEN, CONSTANT_COLORS.BLACK]}
        style={
          styles.linearGradient
        }
        start={[0.6, 0.4]}
      >
      </LinearGradient>
    )
}

const styles = StyleSheet.create({
  linearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
    zIndex: 1,
  },
})

export default LinearGradient_;