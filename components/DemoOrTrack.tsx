import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { FUNCTION_TYPE } from '@/constants/FunctionType';
import { CAMERA_FACES } from '@/constants/CameraFaces';
import { Fonts } from '@/constants/Fonts';
import { CONSTANT_COLORS } from '@/constants/Colors';

type DemoOrTrackProps = {
  functionType: typeof FUNCTION_TYPE.DEMO | typeof FUNCTION_TYPE.TRACK;
  cameraFace: typeof CAMERA_FACES.FRONT | typeof CAMERA_FACES.BACK;
};

const DemoOrTrack = ({ functionType, cameraFace }: DemoOrTrackProps) => {
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={cameraFace as CameraType}>
        <View style={styles.buttonContainer}>
          <Pressable style={[styles.button, { borderColor: functionType === FUNCTION_TYPE.DEMO ? CONSTANT_COLORS.ORANGE : CONSTANT_COLORS.GREEN }]}>
            <Text style={styles.text}>
              Start {functionType}
            </Text>
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: CONSTANT_COLORS.GRAY,
    padding: 10,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
  },
  text: {
    fontSize: 30,
    fontFamily: Fonts.mainFont,
    color: CONSTANT_COLORS.WHITE,
  },
});

export default DemoOrTrack;