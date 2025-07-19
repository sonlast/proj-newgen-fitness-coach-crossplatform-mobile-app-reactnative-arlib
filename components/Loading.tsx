import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import LottieView from 'lottie-react-native'

type LoadingProps = {
  loaderStyle?: StyleProp<ViewStyle>;
}

const Loading = ({ loaderStyle }: LoadingProps) => {
  return (
    <LottieView
      source={require('../assets/loaders/loader_droplets.json')}
      autoPlay
      loop
      style={loaderStyle}
    />
  )
}

export default Loading;