import React, { useEffect } from 'react'
// import { Animated } from 'react-native'
import ActionSheet from 'react-native-actions-sheet'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { Fonts } from '@/constants/Fonts'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'

const ModalSheet = () => {
  const scaleAnim = new Animated.Value(1);

  const pulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ])
    ).start();
  }

  useEffect(() => {
    pulse();
    return () => scaleAnim.stopAnimation();
  }, [])

  return (
    <ActionSheet
      containerStyle={styles.sheetContainer}
      closeOnTouchBackdrop={true}
      closeOnPressBack={true}
    >
      <View style={styles.sheetView}>
        <Text
          style={styles.titleText}
        >
          Speak To Search
        </Text>
        <View
          style={{
            padding: 40,
          }}
        >
          <Pressable>
            <Animated.View
              style={[styles.micButton, { transform: [{ scale: scaleAnim }] }]}
            >
              <Text>
                <FontAwesomeIcon icon={faMicrophone} size={50} style={styles.micIcon} />
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </ActionSheet>
  )
}

const styles = StyleSheet.create({
  sheetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderColor: '#fff',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  sheetView: {
    padding: 50,
    alignItems: 'center',
  },
  titleText: {
    fontFamily: Fonts.mainFont,
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#fff',
  },
  micButton: {
    backgroundColor: '#666',
    borderRadius: 50,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    color: '#fff',
  },
})

export default ModalSheet;